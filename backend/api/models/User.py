from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    surname = models.CharField(max_length=150)

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        STUDENT = 'STUDENT', 'Student'
        TEACHER = 'TEACHER', 'Teacher'

    role = models.CharField(max_length=32, choices=Role.choices)
    base_role = None

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role or self.role
        super().save(*args, **kwargs)

