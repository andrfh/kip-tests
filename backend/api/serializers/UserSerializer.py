from rest_framework import serializers

from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'role', 'username', 'password', 'first_name', 'last_name', 'surname']
        # fields = '__all__'

class ReadUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = ['id', 'role', 'username', 'first_name', 'last_name', 'surname']
