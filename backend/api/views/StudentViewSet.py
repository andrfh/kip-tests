from rest_framework import viewsets
from api.models.Student import Student
from api.serializers.StudentSerializer import StudentSerializer
from api.permissions import IsAdminOrTeacher


class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Student.objects.all().select_related('studentprofile__study_group')
    serializer_class = StudentSerializer
    permission_classes = [IsAdminOrTeacher]