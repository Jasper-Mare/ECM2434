from django.test import TestCase

# Create your tests here.
class testLeaderboardPage(TestCase):
    def test_valid_leaderboard(self):
        response = self.client.get('/leaderboard/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Exit")
        self.assertContains(response, "Leaderboard")
        self.assertContains(response, "Score")
