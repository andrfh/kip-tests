from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view

from api.models import User
from api.serializers import StudentSerializer, UserSerializer

@api_view()
def me(request: Request):
    if request.user.role == User.Role.STUDENT:
        user_data = StudentSerializer(instance=request.user).data
    else:
        user_data = UserSerializer(instance=request.user).data
        user_data.pop('password')
    return Response(user_data)

