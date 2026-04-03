from rest_framework.test import APITestCase

from api.models.Student import Student
from api.models.StudyGroup import StudyGroup

class StudentProxyTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        StudyGroup.objects.create(name='2isip-228')

    def test_create(self):
        student = Student.objects.create_with_study_group(study_group=StudyGroup.objects.get(name='2isip-228'), username='dubstep', password='okay')
        self.assertEqual(student.study_group.name, '2isip-228')
