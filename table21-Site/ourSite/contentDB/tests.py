from django.test import TestCase

# Create your tests here.

class testContentDB(TestCase):
    def test_createLocation(self):
        # create a user, check they are in the DB, with the correct info
        response = self.client.get('/contentDB/createLocation?name=Testing&gps_lat=0.0&gps_long=0.0&info=This is a test&radius=0.0001')
        self.assertEqual(response.status_code, 200)]
        #self.assertJSONEqual()