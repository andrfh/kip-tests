from rest_framework import serializers

from api.models import Student
from api.models import StudentProfile
from api.serializers.StudyGroupSerializer import StudyGroupSerializer


class StudentSerializer(serializers.ModelSerializer):
    study_group = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['id', 'role', 'study_group', 'username', 'first_name', 'last_name', 'surname']

    def get_study_group(self, obj):
        return StudyGroupSerializer(instance=StudentProfile.objects.get(student=obj).study_group).data
