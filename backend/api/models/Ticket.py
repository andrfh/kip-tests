from django.db import models

from api.models.StudyGroup import StudyGroup
from api.models.Subject import Subject
from api.models.User import User

class Ticket(models.Model):
    name = models.CharField(max_length=128)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True)
    study_group = models.ForeignKey(StudyGroup, on_delete=models.SET_NULL, null=True)
    is_open = models.BooleanField(default=True)
    closes_at = models.DateTimeField(null=True)
    questions = models.JSONField()
    max_points = models.SmallIntegerField()
    time_limit_seconds = models.SmallIntegerField()
    max_attempts = models.SmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name
