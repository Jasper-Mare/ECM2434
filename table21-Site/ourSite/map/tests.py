from django.test import TestCase

# Create your tests here.
class testMapPage(TestCase):
    def test_valid_map(self):
        response = self.client.get('/map/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Welcome to EcoQuest Exeter!")
        self.assertContains(response, "Log out")
        self.assertContains(response, "Leaderboard")
        self.assertContains(response, "Click Here")
        self.assertContains(response, "Click this button to find what location you are near")