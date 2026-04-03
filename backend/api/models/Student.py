# THIS MODEL IS NOT CURRENTLY USED, though some tests exist

from django.db import models
from api.models.StudyGroup import StudyGroup
from api.models.User import User
from api.models.StudentProfile import StudentProfile

class StudentManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(role=User.Role.STUDENT)

    def create(self, **kwargs):
        kwargs['role'] = User.Role.STUDENT
        return super().create(**kwargs)

    def create_with_study_group(self, study_group: StudyGroup, **kwargs):
        student = self.create(**kwargs)
        StudentProfile.objects.create(student=student, study_group=study_group)

        return student

class Student(User):
    class Meta:
        proxy = True

    # TODO: uhhh
    objects = StudentManager()

    @property
    def study_group(self):
        return StudentProfile.objects.get(student=self).study_group
