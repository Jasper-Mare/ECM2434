from django.test import TestCase
import json

# Create your tests here.

class testEmailDB(TestCase):
    def test_getUser(self):
        # check that the request can be made successfully and that expected user is not in the DB
        response = self.client.get('/emailLinkDB/getUserByLinkID?linkID=0')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "\"error\": \"DoesNotExist\"")