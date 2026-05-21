# backend/api/views/csrf.py
# Endpoint для получения CSRF-токена.
# Фронт вызывает его один раз при загрузке приложения,
# после чего Django устанавливает csrftoken cookie.

from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def get_csrf_token(request: Request):
    token = get_token(request)
    return Response({'csrfToken': token})