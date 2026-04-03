from rest_framework import serializers

from api.models import StudyGroup

class StudyGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyGroup
        fields = ['id', 'name']
