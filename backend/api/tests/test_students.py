from django.contrib.auth.hashers import make_password
from rest_framework.test import APITestCase

from api.models import User, Student, StudyGroup

class StudentsTest(APITestCase):
    path = '/students/'
    student_1_data = {
        'role': User.Role.STUDENT,
        'password': make_password('lehaz pw'),
        'username': 'lehaz',
        'first_name': 'Алексей',
        'last_name': 'Затравкин',
        'surname': 'Дмитриевич',
    }
    student_2_data = {
        'role': User.Role.STUDENT,
        'password': make_password('andrfh pw'),
        'username': 'andrfh',
        'first_name': 'Андрей',
        'last_name': 'Солонович',
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
    teacher_2_data = {
        'role': User.Role.TEACHER,
        'password': make_password('dsuvorov pw'),
        'username': 'dsuvorov',
        'first_name': 'Дмитрий',
        'last_name': 'Суворов',
        'surname': 'Алексеевич',
    }

    def setUp(self):
        self.study_group_1 = StudyGroup.objects.create(name='2ИСИП-423')
        self.study_group_2 = StudyGroup.objects.create(name='3ОИБАС-922')

        self.student_1 = Student.objects.create_with_study_group(study_group=self.study_group_1, **self.student_1_data)
        self.student_2 = Student.objects.create_with_study_group(study_group=self.study_group_2, **self.student_2_data)

        self.teacher_1 = User.objects.create(**self.teacher_1_data)
        self.teacher_2 = User.objects.create(**self.teacher_2_data)

    def test_list_students(self):
        self.client.force_authenticate(user=self.teacher_1)

        response = self.client.get(self.path)
        response_data = response.json()

        self.assertEqual(len(response_data), 2)

    def test_get_student(self):
        self.client.force_authenticate(user=self.teacher_1)

        response = self.client.get(self.path + '1/')
        response_data = response.json()

        self.assertEqual(response_data, {
            'id': 1,
            'role': 'STUDENT',
            'username': self.student_1_data['username'],
            'first_name': self.student_1_data['first_name'],
            'last_name': self.student_1_data['last_name'],
            'surname': self.student_1_data['surname'],
            'study_group': {
                'id': 1,
                'name': self.study_group_1.name,
            },
        })
