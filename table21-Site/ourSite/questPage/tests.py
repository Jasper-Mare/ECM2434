from django.test import TestCase

# Create your tests here.
class testQuestPage(TestCase):
    def test_valid_quest(self):
        response = self.client.get('/quest/')
        print(response)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "EcoQuest")
        self.assertContains(response, "Completed")