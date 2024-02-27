from django.test import TestCase

# Create your tests here.
class testAdminPage(TestCase):
    def test_valid_admin(self):
        response = self.client.get('/adminPage/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Create new quiz")
        self.assertContains(response, "User Authority")
        self.assertContains(response, "Home")