from django.test import TestCase

# Create your tests here.
class testQuizPage(TestCase):
    def test_valid_quizPage(self):
        response = self.client.get('/quiz/?id=4/')
        self.assertEqual(response.status_code, 200)
        response2 = self.client.get('/quiz/?id=13/')
        self.assertEqual(response2.status_code, 200)

    def test_valid_newquizPage(self):
        response = self.client.get('/quiz/new/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Enter a new sustainability question")