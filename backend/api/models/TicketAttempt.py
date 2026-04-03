from django.db import models

from api.models.Ticket import Ticket
from api.models.User import User

class TicketAttempt(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    questions = models.JSONField()
    answers = models.JSONField(null=True)
    points = models.SmallIntegerField(null=True)
    time_spent_seconds = models.SmallIntegerField(null=True)
    started_at = models.DateTimeField()
    finished_at = models.DateTimeField(null=True)
