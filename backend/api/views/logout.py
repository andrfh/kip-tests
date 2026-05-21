# backend/api/views/logout.py

from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from api.audit import log_action
from api.models.AuditLog import AuditLog


@api_view(['POST'])
def logout(request: Request):
    jwt_settings = settings.SIMPLE_JWT
    refresh_cookie_name = jwt_settings.get('AUTH_COOKIE_REFRESH', 'refresh_token')
    raw_refresh = request.COOKIES.get(refresh_cookie_name)

    if raw_refresh:
        try:
            token = RefreshToken(raw_refresh)
            token.blacklist()  # добавляем в чёрный список
        except TokenError:
            pass  # токен уже невалиден — ничего страшного

    response = Response({'detail': 'Выход выполнен.'}, status=status.HTTP_200_OK)

    # Удаляем оба cookie
    response.delete_cookie(jwt_settings.get('AUTH_COOKIE', 'access_token'))
    response.delete_cookie(jwt_settings.get('AUTH_COOKIE_REFRESH', 'refresh_token'))

    # логирование
    log_action(request, AuditLog.Action.LOGOUT)
    
    return response