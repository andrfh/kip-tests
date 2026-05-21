from rest_framework import serializers

from django.contrib.auth import get_user_model

# backend/api/serializers/UserSerializer.py

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = [
            'id', 'username', 'first_name', 'last_name',
            'surname', 'role', 'password',
            'totp_enabled',  # ← добавить
        ]
        extra_kwargs = {'password': {'write_only': True}}

class ReadUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = ['id', 'role', 'username', 'first_name', 'last_name', 'surname']
