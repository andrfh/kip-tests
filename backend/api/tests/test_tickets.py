from datetime import datetime
import json
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from api.models import StudentProfile, StudyGroup, Subject, Ticket, User

class TicketsTest(APITestCase):
    path = '/tickets/'
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

    ticket_data = {
        'name': 'Билет 1',
        'subject': 1, # should be the one we create in setUp()
        'study_group': 1, # should be the one we create in setUp() 🤠
        'is_open': True,
        'closes_at': timezone.now(),
        'time_limit_seconds': 1 * 60 * 10, # 10 минут
        'max_attempts': 1,
        'questions': [
            {
                'id': 0,
                'points': 1,
                'answer_type': 'option',
                'text': 'Сколько решений у квадратного уравнения x^2 = 9?',
                'options': [
                    '1',
                    '2',
                    '3',
                    'нет решений'
                ],
                'correct_answer': '2'
            },
            {
                'id': 1,
                'points': 1,
                'answer_type': 'options',
                'text': 'Какие из перечеслинных чисел являются решениями уравнения x^2 = 9?',
                'options': [
                    '1',
                    '3',
                    '4',
                    '-3'
                ],
                'correct_answer': ['-3', '3']
            },
            {
                'id': 2,
                'points': 1,
                'answer_type': 'text',
                'text': 'Какое уравнение содержит неизвестную во второй степени? Ответ - одно слово в И.п.',
                'options': [],
                'correct_answer': 'квадратное'
            }
        ],
        'max_points': 3,
    }

    def setUp(self):
        self.teacher_1 = User.objects.create(**self.teacher_1_data)
        self.teacher_2 = User.objects.create(**self.teacher_2_data)

        self.study_group_1 = StudyGroup.objects.create(name='2ИСИП-423')
        self.study_group_2 = StudyGroup.objects.create(name='3ОИБАС-922')
        self.subject_1 = Subject.objects.create(name='Математика и там ещё чота')
        self.subject_2 = Subject.objects.create(name='Не математика и всё ничо')

        self.student_1 = User.objects.create(**self.student_1_data)
        self.student_1_profile = StudentProfile.objects.create(
            student=self.student_1,
            study_group=self.study_group_1
        )
        self.student_2 = User.objects.create(**self.student_2_data)
        self.student_2_profile = StudentProfile.objects.create(
            student=self.student_2,
            study_group=self.study_group_2
        )

    def test_post_detail(self):
        self.client.force_authenticate(user=self.teacher_1)
        response = self.client.post(
            self.path + '1/',
            self.ticket_data,
        )
        self.assertEqual(405, response.status_code)

    def test_unauthenticated(self):
        response = self.client.get(self.path)
        self.assertEqual(401, response.status_code)

    def test_create_ticket_as_teacher(self):
        self.client.force_authenticate(user=self.teacher_1)
        response = self.client.post(
            self.path,
            self.ticket_data,
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        ticket = Ticket.objects.get(name=self.ticket_data['name'])
        self.assertEqual(ticket.name, response.json()['name'])
        self.assertEqual(ticket.author.id, self.teacher_1.id)
        self.assertEqual(ticket.study_group.id, self.ticket_data['study_group'])
        self.assertEqual(ticket.subject.id, self.ticket_data['subject'])

    def test_create_ticket_as_student(self):
        self.client.force_authenticate(user=self.student_1)
        response = self.client.post(
            self.path,
            self.ticket_data,
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_tickets_as_student(self):
        data = self.ticket_data.copy()
        data['study_group'] = self.study_group_1
        data['subject'] = self.subject_2

        # два билета с разными учебными группами
        ticket_1 = Ticket.objects.create(author=self.teacher_1, **data)
        data['study_group'] = self.study_group_2
        ticket_2 = Ticket.objects.create(author=self.teacher_1, **data)

        self.client.force_authenticate(user=self.student_1)

        response = self.client.get(self.path)
        self.assertEqual(len(response.json()), 1)

    def test_list_tickets_as_teacher(self):
        data = self.ticket_data.copy()
        data['study_group'] = self.study_group_1
        data['subject'] = self.subject_2

        # два билета с разными авторами
        ticket_1 = Ticket.objects.create(author=self.teacher_1, **data)
        ticket_2 = Ticket.objects.create(author=self.teacher_2, **data)

        self.client.force_authenticate(user=self.teacher_1)

        response = self.client.get(self.path)
        self.assertEqual(len(response.json()), 1)


    def test_get_ticket_as_teacher(self):
        data = self.ticket_data.copy()
        data['study_group'] = self.study_group_1
        data['subject'] = self.subject_2
        ticket = Ticket.objects.create(author=self.teacher_1, **data)

        # свой билет
        self.client.force_authenticate(user=self.teacher_1)

        response = self.client.get(f'{self.path}{ticket.pk}/')
        self.assertEqual(200, response.status_code)

        # чужой билет
        self.client.force_authenticate(user=self.teacher_2)

        response = self.client.get(f'{self.path}{ticket.pk}/')
        self.assertEqual(404, response.status_code)

    def test_get_ticket_as_student(self):
        data = self.ticket_data.copy()
        data['study_group'] = self.study_group_1
        data['subject'] = self.subject_2
        ticket = Ticket.objects.create(author=self.teacher_1, **data)

        # билет своей группы
        self.client.force_authenticate(user=self.student_1)

        response = self.client.get(f'{self.path}{ticket.pk}/')
        self.assertEqual(200, response.status_code)

        # билет чужой группы
        self.client.force_authenticate(user=self.student_2)

        response = self.client.get(f'{self.path}{ticket.pk}/')
        self.assertEqual(404, response.status_code)
