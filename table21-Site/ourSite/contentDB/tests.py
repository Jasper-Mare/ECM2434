from django.test import TestCase
import json

# Create your tests here.

class testContentDB(TestCase):
    def test_createLocation(self):
        # create a location, check they are in the DB, with the correct info
        response = self.client.get('/contentDB/createLocation?name=Testing&gps_lat=0.0&gps_long=0.0&info=This is a test&radius=0.0001')
        self.assertEqual(response.status_code, 200)

        self.assertContains(response, "\"name\": \"Testing\"")
        self.assertContains(response, "\"gps_lat\": 0.0")
        self.assertContains(response, "\"gps_long\": 0.0")
        self.assertContains(response, "\"info\": \"This is a test\"")
        self.assertContains(response, "\"radius\": 0.0001")

    def test_createQuiz(self):
        # create a location, so the quiz has something to attach to
        response = self.client.get('/contentDB/createLocation?name=Testing&gps_lat=0.0&gps_long=0.0&info=This is a test&radius=0.0001')
        locationJSON = json.loads(response.content.decode('ascii'))
        locationId = locationJSON["id"]

        response2 = self.client.get(f'/contentDB/createQuiz?question=Test Question?&answer0=one&answer1=two&answer2=three&correct_answer=2&points=10&location_id={locationId}')
        self.assertEqual(response2.status_code, 200)
        self.assertJSONEqual(response2.content.decode('ascii'), {"id":locationId,"question":"Test Question?","answer0":"one","answer1":"two","answer2":"three","correct_answer":2,"points":10,"location":1})

    