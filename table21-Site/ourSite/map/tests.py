from django.test import TestCase

# Create your tests here.
class testMapPage(TestCase):
    def test_valid_map(self):
        response = self.client.get('/map/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "EcoQuest")