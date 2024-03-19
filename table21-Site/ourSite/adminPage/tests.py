from django.test import TestCase

# Create your tests here.
class testAdminPage(TestCase):
    def test_valid_admin(self):
        response = self.client.get('/adminPage/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Admin")
        self.assertContains(response, "EcoQuest")
        self.assertContains(response, "App Data")
        self.assertContains(response, "Manage Users")
        self.assertContains(response, "Add Location")
        self.assertContains(response, "New Quiz")
        self.assertContains(response, "New Quest")
        self.assertContains(response, "Help")
        self.assertContains(response, "Exit")