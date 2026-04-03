from django.contrib.auth.hashers import make_password
from django.utils import timezone
from api.models import StudentProfile, User, StudyGroup, Subject, Ticket
from datetime import datetime, timedelta

def run():
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

    teacher_1 = User.objects.create(**teacher_1_data)
    teacher_2 = User.objects.create(**teacher_2_data)

    subject_1 = Subject.objects.create(name='Математика')
    subject_2 = Subject.objects.create(name='Не математика')

    study_group_1 = StudyGroup.objects.create(name='2ИСИП-423')
    study_group_2 = StudyGroup.objects.create(name='3ОИБАС-922')

    student_1 = User.objects.create(**student_1_data)
    student_1_profile = StudentProfile.objects.create(student=student_1, study_group=study_group_1)

    student_2 = User.objects.create(**student_2_data)
    student_2_profile = StudentProfile.objects.create(student=student_2, study_group=study_group_2)

    ticket_1_data = {
        'name': 'Билет 1',
        'subject': subject_1,
        'study_group': study_group_1,
        'author': teacher_1,
        'is_open': True,
        'closes_at': timezone.now() + timedelta(days=2),
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

    ticket_2_data = {
        'name': 'Билет 2',
        'subject': subject_2,
        'study_group': study_group_2,
        'author': teacher_2,
        'is_open': False,
        'closes_at': timezone.now() + timedelta(days=1),
        'time_limit_seconds': 1 * 60 * 15, # 10 минут
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

    ticket_1 = Ticket.objects.create(**ticket_1_data)
    ticket_2 = Ticket.objects.create(**ticket_2_data)
