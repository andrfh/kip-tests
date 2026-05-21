from django.conf import settings

from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)

from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def token_refresh(request):
    refresh_token = request.COOKIES.get(
        'refresh_token'
    )

    if not refresh_token:
        return Response(
            {'detail': 'No refresh token'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        refresh = RefreshToken(refresh_token)

        access = refresh.access_token

        response = Response({
            'detail': 'Token refreshed'
        })

        jwt_settings = settings.SIMPLE_JWT

        response.set_cookie(
            key='access_token',
            value=str(access),

            httponly=True,

            secure=False,

            samesite='Lax',

            max_age=int(
                jwt_settings[
                    'ACCESS_TOKEN_LIFETIME'
                ].total_seconds()
            ),

            path='/'
        )

        return response

    except Exception:
        return Response(
            {'detail': 'Invalid refresh token'},
            status=status.HTTP_401_UNAUTHORIZED
        )