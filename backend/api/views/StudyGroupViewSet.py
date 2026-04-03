from rest_framework import viewsets

from api.models import StudyGroup
from api.serializers import StudyGroupSerializer

class StudyGroupViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StudyGroup.objects.all()

    serializer_class = StudyGroupSerializer
