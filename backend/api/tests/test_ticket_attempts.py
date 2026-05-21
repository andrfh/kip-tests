import json
from rest_framework.test import APITestCase

from api.models.StudentProfile import StudentProfile
from api.models.StudyGroup import StudyGroup
from api.models.Subject import Subject
from api.models.Ticket import Ticket
from api.models.TicketAttempt import TicketAttempt
from api.models.User import User
from api.serializers import ReadTicketSerializer, WriteTicketSerializer

from django.utils import timezone


class TicketAttemptsTest(APITestCase):
    def setUp(self):
        self.attempt_data_2of3_points = {
            'ticket': 1, # единственный, который мы создаём в setUp()
            'time_spent_seconds': 60 * 5, # 5 минут
            'answers': [
                {
                    'id': 0,
                    'answer': '2', # правильно
                },
                {
                    'id': 1,
                    'answer': '4', # неправильно
                },
                {
                    'id': 2,
                    'answer': 'квадратное' # правильно
                }
            ]
        } # ожидаемое кол-во баллов: 2/3

        self.attempt_data_1of3_points = {
            'ticket': 1, # единственный, который мы создаём в setUp()
            'time_spent_seconds': 60 * 5, # 5 минут
            'answers': [
                {
                    'id': 0,
                    'answer': 'нет решений', # неправильно
                },
                {
                    'id': 1,
                    'answer': '3', # правильно
                },
                {
                    'id': 2,
                    'answer': 'кубическое' # неправильно
                }
            ]
        }

        subject = Subject.objects.create(name='предмет 1')
        study_group = StudyGroup.objects.create(name='группа 1')
        self.teacher1 = User.objects.create(username='teacher1', role=User.Role.TEACHER)
        self.teacher2 = User.objects.create(username='teacher2', role=User.Role.TEACHER)
        self.student1 = User.objects.create(username='student1', role=User.Role.STUDENT)
        self.student_profile = StudentProfile.objects.create(student=self.student1, study_group=study_group)
        serializer = WriteTicketSerializer(data={
            'name': 'Билет 1',
            'subject': subject.pk,
            'study_group': study_group.pk,
            'author': self.teacher1.pk,
            'is_open': True,
            'closes_at': timezone.now(),
            'time_limit_seconds': 1 * 60 * 10, # 10 минут
            'max_attempts': 2,
            'questions': json.dumps([
                {
                    'id': 0,
                    'points': 1,
                    'answer_type': 'text',
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
                    'answer_type': 'text',
                    'text': 'Какие из перечеслинных чисел являются решениями уравнения x^2 = 9?',
                    'options': [
                        '1',
                        '3',
                        '4',
                        '-3'
                    ],
                    'correct_answer': '3'
                },
                {
                    'id': 2,
                    'points': 1,
                    'answer_type': 'text',
                    'text': 'Какое уравнение содержит неизвестную во второй степени? Ответ - одно слово в И.п.',
                    'options': [],
                    'correct_answer': 'квадратное'
                }
            ]),
            'max_points': 3,
        })
        if serializer.is_valid():
            self.ticket1 = serializer.save()
        else:
            self.fail(serializer.errors)

        self.ticket2 = self.ticket1
        self.ticket2.pk = None
        self.ticket2.author = self.teacher2
        self.ticket2.save()

    def test_post_attempt(self):
        self.client.force_authenticate(user=self.student1)

        # this retarted method (client.post) does some stupid and retarted
        # thing to nested array in the json so we convert all data to json before
        # letting client.post touch it
        # 
        # in fact the behaviour is so strange that i should report it to drf's
        # devs but i'll leave it till some better times when i won't have as
        # much things to do
        response = self.client.post('/attempts/', json.dumps(self.attempt_data_2of3_points), content_type='application/json')
        self.assertEqual(201, response.status_code)
        attempt_id = response.json()['id']

        response = self.client.post(
            f'/attempts/{attempt_id}/submit/',
            json.dumps(self.attempt_data_2of3_points['answers']),
            content_type='application/json'
        )
        response_data = response.json()
        self.assertEqual(200, response.status_code)
        self.assertEqual(2, response_data['points'])

        response = self.client.post('/attempts/', json.dumps(self.attempt_data_1of3_points), content_type='application/json')
        self.assertEqual(201, response.status_code)
        attempt_id = response.json()['id']

        response = self.client.post(
            f'/attempts/{attempt_id}/submit/',
            json.dumps(self.attempt_data_1of3_points['answers']),
            content_type='application/json'
        )
        response_data = response.json()
        self.assertEqual(200, response.status_code)
        self.assertEqual(1, response_data['points'])

    def test_post_attempt_with_different_group(self):
        another_study_group = StudyGroup.objects.create(name='группа 2')
        self.student_profile.study_group = another_study_group
        self.student_profile.save()

        self.client.force_authenticate(user=self.student1)

        response = self.client.post('/attempts/', json.dumps(self.attempt_data_2of3_points), content_type='application/json')
        self.assertEqual(403, response.status_code)

    def test_post_more_than_max_attempts(self):
        self.client.force_authenticate(user=self.student1)

        response = self.client.post('/attempts/', json.dumps(self.attempt_data_2of3_points), content_type='application/json')
        self.assertEqual(201, response.status_code)

        response = self.client.post('/attempts/', json.dumps(self.attempt_data_1of3_points), content_type='application/json')
        self.assertEqual(201, response.status_code)

        response = self.client.post('/attempts/', json.dumps(self.attempt_data_1of3_points), content_type='application/json')
        self.assertEqual(406, response.status_code)

    def test_list_attempts_as_teacher(self):
        self.client.force_authenticate(user=self.student1)
        self.client.post('/attempts/', json.dumps(self.attempt_data_2of3_points), content_type='application/json')
        self.client.post('/attempts/', json.dumps(self.attempt_data_1of3_points), content_type='application/json')

        self.attempt_data_1of3_points['ticket'] = 2 # второй билет, который создал teacher2
        self.client.post('/attempts/', json.dumps(self.attempt_data_1of3_points), content_type='application/json')

        self.client.force_authenticate(user=self.teacher1)
        response = self.client.get('/attempts/')
        self.assertEqual(2, len(response.json()))
