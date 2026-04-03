from django.contrib.auth.hashers import make_password
from rest_framework.test import APITestCase

from api.models import User

class TicketsLoginTestCase(APITestCase):
    path = '/login/'
    def setUp(self):
        self.username = 'leha'
        self.password = 'lehaspassword'
        self.user = User.objects.create(
            username=self.username,
            password=make_password(self.password),
        )

    def test_login_with_valid_credentials(self):
        response = self.client.post(self.path, {
            'username': self.username,
            'password': self.password,
        })
        self.assertEqual(200, response.status_code)
        self.assertTrue('token' in response.json())

    def test_login_with_invalid_password(self):
        response = self.client.post(self.path, {
            'username': self.username,
            'password': 'goofy wrong password',
        })
        self.assertEqual(404, response.status_code)

    def test_login_without_password(self):
        response = self.client.post(self.path, {
            'username': self.username,
        })
        self.assertEqual(400, response.status_code)

