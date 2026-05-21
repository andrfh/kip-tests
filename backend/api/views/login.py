# backend/api/views/login.py

from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from api.models import StudentProfile, User
from api.serializers import UserSerializer
from api.throttles import LoginRateThrottle
from api.audit import log_action
from api.models.AuditLog import AuditLog


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def login(request: Request):
    throttle = LoginRateThrottle()
    if not throttle.allow_request(request, None):
        log_action(request, AuditLog.Action.LOGIN_BLOCKED, details={
            'username': request.data.get('username', ''),
        })
        wait = throttle.wait()
        return Response(
            {'detail': 'Слишком много попыток входа. Подождите минуту.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
            headers={'Retry-After': str(int(wait)) if wait else '60'}
        )

    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'detail': 'Необходимо указать username и password.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    UserModel = get_user_model()

    try:
        user = UserModel.objects.get(username=username)
    except UserModel.DoesNotExist:
        log_action(request, AuditLog.Action.LOGIN_FAILED, details={
            'username': username,
            'reason': 'user_not_found',
        })
        return Response(
            {'detail': 'Неверный логин или пароль.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.check_password(password):
        log_action(request, AuditLog.Action.LOGIN_FAILED, user=user, details={
            'username': username,
            'reason': 'wrong_password',
        })
        return Response(
            {'detail': 'Неверный логин или пароль.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.is_active:
        return Response(
            {'detail': 'Аккаунт заблокирован.'},
            status=status.HTTP_403_FORBIDDEN
        )

    # 2FA: если включена — не выдаём токены, требуем OTP
    if user.totp_enabled:
        return Response(
            {'detail': '2fa_required', 'user_id': user.pk},
            status=status.HTTP_202_ACCEPTED
        )

    log_action(request, AuditLog.Action.LOGIN_SUCCESS, user=user)
    return _issue_tokens_response(user)


def _issue_tokens_response(user):
    """Выдать JWT-токены и установить их в HttpOnly cookie."""
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token

    UserModel = get_user_model()

    serializer = UserSerializer(instance=user)
    user_data = serializer.data.copy()
    user_data.pop('password', None)

    if user.role == UserModel.Role.STUDENT:
        try:
            profile = StudentProfile.objects.select_related('study_group').get(student=user)
            user_data['study_group'] = {
                'id': profile.study_group.pk,
                'name': profile.study_group.name,
            }
        except StudentProfile.DoesNotExist:
            user_data['study_group'] = None

    response = Response({'user': user_data}, status=status.HTTP_200_OK)

    jwt_settings = settings.SIMPLE_JWT
    cookie_kwargs = {
        'httponly': jwt_settings.get('AUTH_COOKIE_HTTP_ONLY', True),
        'secure': jwt_settings.get('AUTH_COOKIE_SECURE', False),
        'samesite': jwt_settings.get('AUTH_COOKIE_SAMESITE', 'Lax'),
        'path': '/',
    }

    response.set_cookie(
        key=jwt_settings.get('AUTH_COOKIE', 'access_token'),
        value=str(access),
        max_age=int(jwt_settings['ACCESS_TOKEN_LIFETIME'].total_seconds()),
        **cookie_kwargs
    )
    response.set_cookie(
        key=jwt_settings.get('AUTH_COOKIE_REFRESH', 'refresh_token'),
        value=str(refresh),
        max_age=int(jwt_settings['REFRESH_TOKEN_LIFETIME'].total_seconds()),
        **cookie_kwargs
    )

    return response