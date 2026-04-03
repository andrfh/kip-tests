from rest_framework.test import APITestCase

from api.models import StudyGroup, User

class GetStudyGroupsTest(APITestCase):
    path = '/study_groups/'
    def setUp(self):
        self.isip_423 = StudyGroup.objects.create(name='2ИСИП-423')
        self.oibas_922 = StudyGroup.objects.create(name='3ОИБАС-922')
        self.user = User.objects.create(username='testuser')

    def test_unauthenticated(self):
        reponse = self.client.get(self.path)
        self.assertEqual(401, reponse.status_code)

    def test_readonly(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.path, {'name': '1ИСИП-424'})
        self.assertEqual(405, response.status_code) # Not Allowed

    def test_list_groups(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.path)

        self.assertEqual(200, response.status_code)

        data = response.json()
        self.assertEqual(data[0]['name'], self.isip_423.name)
        self.assertEqual(data[1]['name'], self.oibas_922.name)

    def test_get_group(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(f'{self.path}2/')

        self.assertEqual(200, response.status_code)

        data = response.json()
        self.assertEqual(data['name'], self.oibas_922.name)

