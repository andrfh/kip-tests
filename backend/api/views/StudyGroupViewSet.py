from rest_framework import viewsets
from api.models import StudyGroup
from api.serializers import StudyGroupSerializer
from api.permissions import IsAdminOrReadOnly


class StudyGroupViewSet(viewsets.ModelViewSet):

    queryset = StudyGroup.objects.all()
    serializer_class = StudyGroupSerializer
    permission_classes = [IsAdminOrReadOnly]