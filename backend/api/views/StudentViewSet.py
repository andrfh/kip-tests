from rest_framework import viewsets

from api.models.Student import Student
from api.serializers.StudentSerializer import StudentSerializer


class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Student.objects.all()

    def get_serializer_class(self):
        return StudentSerializer
