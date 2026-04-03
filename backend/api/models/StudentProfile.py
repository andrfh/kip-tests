from django.db import models

from api.models.StudyGroup import StudyGroup
from api.models.User import User

class StudentProfile(models.Model):
    student = models.OneToOneField(User, on_delete=models.CASCADE)
    study_group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE)
