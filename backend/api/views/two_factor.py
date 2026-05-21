import base64
import io
import pyotp
import qrcode

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from api.audit import log_action
from api.models.AuditLog import AuditLog
from api.permissions import IsAdminOrTeacher
from api.views.login import _issue_tokens_response

User = get_user_model()


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def verify_otp(request: Request):
    """
    Второй шаг входа для пользователей с 2FA.
    Принимает user_id и code из тела запроса.
    user_id выдаётся на первом шаге login при статусе 202.
    """
    user_id = request.data.get('user_id')
    code = request.data.get('code', '').strip()

    if not user_id or not code:
        return Response(
            {'detail': 'Необходимо указать user_id и code.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(pk=user_id, totp_enabled=True)
    except User.DoesNotExist:
        return Response(
            {'detail': 'Пользователь не найден или 2FA не включена.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if not user.verify_totp(code):
        log_action(request, AuditLog.Action.OTP_FAILED, user=user, details={
            'user_id': user_id,
        })
        return Response(
            {'detail': 'Неверный код.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    log_action(request, AuditLog.Action.OTP_VERIFIED, user=user)
    return _issue_tokens_response(user)


@api_view(['GET'])
def setup_2fa(request: Request):
    """
    Шаг 1 настройки 2FA: генерирует секрет и QR-код.
    Только для Teacher и Admin.
    QR-код возвращается как base64 PNG.
    """
    user = request.user

    if user.role not in (User.Role.TEACHER, User.Role.ADMIN):
        return Response(
            {'detail': '2FA доступна только для преподавателей и администраторов.'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Генерируем новый секрет (или возвращаем существующий если 2FA не активирована)
    if not user.totp_secret or user.totp_enabled:
        user.totp_secret = pyotp.random_base32()
        user.totp_enabled = False
        user.save(update_fields=['totp_secret', 'totp_enabled'])

    # Генерируем QR-код
    uri = user.get_totp_uri()
    img = qrcode.make(uri)
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    qr_base64 = base64.b64encode(buffer.getvalue()).decode()

    return Response({
        'secret': user.totp_secret,
        'qr_code': f'data:image/png;base64,{qr_base64}',
        'manual_entry': uri,
    })


@api_view(['POST'])
def confirm_2fa(request: Request):
    """
    Шаг 2 настройки 2FA: подтвердить что приложение настроено корректно.
    Принимает code из Google Authenticator, активирует 2FA.
    """
    user = request.user
    code = request.data.get('code', '').strip()

    if not code:
        return Response(
            {'detail': 'Необходимо указать code.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.totp_secret:
        return Response(
            {'detail': 'Сначала выполните GET /2fa/setup/ для получения QR-кода.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.verify_totp(code):
        return Response(
            {'detail': 'Неверный код. Проверьте что время на устройстве правильное.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.totp_enabled = True
    user.save(update_fields=['totp_enabled'])

    return Response({'detail': '2FA успешно активирована.'})


@api_view(['POST'])
def disable_2fa(request: Request):
    """Отключить 2FA. Требует подтверждения текущим OTP-кодом."""
    user = request.user
    code = request.data.get('code', '').strip()

    if not user.totp_enabled:
        return Response({'detail': '2FA не активирована.'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.verify_totp(code):
        return Response({'detail': 'Неверный код.'}, status=status.HTTP_401_UNAUTHORIZED)

    user.totp_enabled = False
    user.totp_secret = ''
    user.save(update_fields=['totp_enabled', 'totp_secret'])

    return Response({'detail': '2FA отключена.'})