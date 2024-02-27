from django.test import TestCase

# Create your tests here.
class testLoginPage(TestCase):
    def test_valid_login(self):
        response = self.client.get('/login/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Username")
        self.assertContains(response, "Password")
        self.assertContains(response, "Haven't signed up yet?")
