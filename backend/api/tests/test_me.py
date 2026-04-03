from django.contrib.auth.hashers import make_password
from rest_framework.test import APITestCase

from api.models import User, Student, StudyGroup

class MeTest(APITestCase):
    path = '/me/'
    student_1_data = {
        'role': User.Role.STUDENT,
        'password': make_password('lehaz pw'),
        'username': 'lehaz',
        'first_name': 'Алексей',
        'last_name': 'Затравкин',
        'surname': 'Дмитриевич',
    }
    teacher_1_data = {
        'role': User.Role.TEACHER,
        'password': make_password('sdavydov pw'),
        'username': 'sdavydov',
        'first_name': 'Сергей',
        'last_name': 'Давыдов',
        'surname': 'Иванович',
    }
    def setUp(self):
        self.study_group_1 = StudyGroup.objects.create(name='2ИСИП-423')
        self.student_1 = Student.objects.create_with_study_group(study_group=self.study_group_1, **self.student_1_data)

        self.teacher_1 = User.objects.create(**self.teacher_1_data)
    
    def test_get_me_as_student(self):
        self.client.force_authenticate(user=self.student_1)
        response = self.client.get(self.path)

        response_data = response.json()

        self.assertEqual(response_data['role'], 'STUDENT')
        self.assertEqual(response_data['study_group'], {'name': '2ИСИП-423', 'id': 1})

    def test_get_me_as_teacher(self):
        self.client.force_authenticate(user=self.teacher_1)
        response = self.client.get(self.path)

        response_data = response.json()

        self.assertEqual(response_data['role'], 'TEACHER')
        self.assertEqual(response_data['username'], 'sdavydov')
