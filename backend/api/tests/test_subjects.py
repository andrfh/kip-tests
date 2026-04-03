from rest_framework.test import APITestCase

from api.models import Subject, User


class GetSubjectsTest(APITestCase):
    path = '/subjects/'
    def setUp(self):
        self.math = Subject.objects.create(name='Математика')
        self.not_math = Subject.objects.create(name='Не математика')
        self.user = User.objects.create(username='testuser')

    def test_unauthenticated(self):
        reponse = self.client.get(self.path)
        self.assertEqual(401, reponse.status_code)

    def test_readonly(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.path, {'name': '1ИСИП-424'})
        self.assertEqual(405, response.status_code) # Not Allowed

    def test_list_subjects(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.path)

        self.assertEqual(200, response.status_code)

        data = response.json()

        self.assertEqual(data[0]['name'], self.math.name)
        self.assertEqual(data[1]['name'], self.not_math.name)

    def test_get_subject(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(f'{self.path}2/')

        self.assertEqual(200, response.status_code)

        data = response.json()
        self.assertEqual(data['name'], self.not_math.name)
