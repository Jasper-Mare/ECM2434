# Content Database

This is the database definitions, API, and server-side interactions for the database that holds the content for the quizes as well as the locations.

views.py manages the API endpoint, while databaseInteractions.py manages the database interaction.

This database is a table holding all the quizzes, linked to a table holding all the locations.


# Authors

 - Jasper Mare
 - Hannah Jellett
 - Ruby Ham

# Testing

I (Jasper) ran through each of the urls with valid and invalid data in the parameters, 
when a bug was found we (Jasper and Hannah) searched for the problems in our scripts and fixed each bug at the 
point the problem was discovered.




## Welcome to the Content Database API

http://127.0.0.1:8000/contentDB/getQuizById?id=1
 - get the json for a quiz by requesting with its id

http://127.0.0.1:8000/contentDB/getQuizzesByLocation?id=1
 - gets all quizzes that have the same location 

http://127.0.0.1:8000/contentDB/getQuestById?id=1
 - get the json for a quest by requesting with its id

http://127.0.0.1:8000/contentDB/getLocationById?id=1
 - get the json for a location by requesting with its id

 http://127.0.0.1:8000/contentDB/getAllLocations
 - gets all locations

 http://127.0.0.1:8000/contentDB/getNearbyLocations?gps_lat=50.7351567&gps_long=-3.5345085
 - gets locations within a radius by requesting the latitude and longitude values

 http://127.0.0.1:8000/contentDB/createLocation?name=DH1&gps_lat=50.7351567&gps_long=-3.5345085&info=This is DH1&radius=10
- create a location and get the json of its info, all parameters are necessary

http://127.0.0.1:8000/contentDB/createQuiz?question=What year is it?&answer0=2022&answer1=2023&answer2=2024&correct_answer=2&points=10&location_id=1
- create a quiz and get the json of its info, all parameters are necessary

http://127.0.0.1:8000/contentDB/createQuest?task=Use a reusable coffee cup&points=10
- create a quest and get the json of its info, all parameters are necessary

http://127.0.0.1:8000/contentDB/updateLocation?id=1&name=DH1&gps_lat=50.7351567&long=-3.5345085&info=This is DH1&radius=10
- update a location's info and return the updated json, id is necessary, all other parameters are optional

http://127.0.0.1:8000/contentDB/updateQuiz?id=1&question=What year is it?&answer0=2022&answer1=2023&answer2=2024&correct_answer=2&points=10&location_id=1
- update a quiz's info and return the updated json, id is necessary, all other parameters are optional

http://127.0.0.1:8000/contentDB/updateQuest?id=1&task=Use a reusable coffee cup?&points=10&
- update a quest's info and return the updated json, id is necessary, all other parameters are optional

http://127.0.0.1:8000/contentDB/deleteLocation?id=1
 - delete a location, returns json dictionary, where successful is true or false

 http://127.0.0.1:8000/contentDB/deleteQuiz?id=1
 - delete a quiz, returns json dictionary, where successful is true or false

  http://127.0.0.1:8000/contentDB/deleteQuest?id=1
 - delete a quest, returns json dictionary, where successful is true or false



(instructions written by Hannah Jellett and Ruby Ham)
