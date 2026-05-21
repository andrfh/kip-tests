from rest_framework import viewsets
from api.models import Subject
from api.serializers import SubjectSerializer
from api.permissions import IsAdminOrReadOnly


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAdminOrReadOnly]