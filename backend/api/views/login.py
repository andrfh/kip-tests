from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response

from api.models import StudyGroup, User, StudentProfile
from api.serializers import UserSerializer


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def login(request: Request):
    user = get_object_or_404(get_user_model(), username=request.data['username'])

    if not all(key in request.data for key in ('password', 'password')):
        return Response({'detail': 'Bad request.'}, status.HTTP_400_BAD_REQUEST)

    if not user.check_password(request.data['password']):
        return Response({'detail': 'Not found.'}, status.HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)

    user_data = serializer.data.copy()

    if user.role == User.Role.STUDENT:
        user_data['study_group'] = StudentProfile.objects.get(student=user).study_group.pk

    return send_user_and_token(user_data, token.key)

def send_user_and_token(user_data, token_key):
    """общая логика login и register"""
    # удаляем поле хэша пароля из данных, что будут отправлены обратно клиенту
    user_data.pop('password')

    return Response({
        'user': user_data,
        'token': token_key,
    })

# @api_view(['POST'])
# def register(request: Request):
#     user_data = request.data.copy()
#     # сразу преобразовываем пароль в хэш (в дальнейшем он будет записан в базу данных)
#     user_data['password'] = make_password(user_data['password'])
#     user_data['role'] = User.Role.ADMIN
#     serializer = UserSerializer(data=user_data)
#
#     if serializer.is_valid():
#         serializer.save()
#         user = get_user_model().objects.get(username=user_data['username'])
#         token = Token.objects.create(user=user)
#
#         return send_user_and_token(serializer.data, token.key)
#
#     return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
