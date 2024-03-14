# written by Jasper Mare and Ruby Ham

from .models import Quiz, Location, Quest

# builds the dictionary that turns into the JSON response for quizzes
def makeQuizStruct(id, question, answer0, answer1, answer2, correctAnswer, points, location_id):
    return {
        "id" : int(id), 
        "question" : question, 
        "answer0" : answer0,
        "answer1" : answer1, 
        "answer2" : answer2, 
        "correct_answer" : correctAnswer, 
        "points": int(points),
        "location": int(location_id),
    }

# builds the dictionary that turns into the JSON response for locations
def makeLocationStruct(id, name, lat, long, info, radius):
    return {
        "id" : int(id), 
        "name" : name, 
        "gps_lat" : float(lat), 
        "gps_long" : float(long), 
        "info": info,
        "radius" : float(radius),
    }

def makeQuestStruct(id, task ,points):
    return {
        "id" : int(id), 
        "quest" : task, 
        "points": int(points),
    }


def getQuizById(id):
    # if there isn't a quiz with this id in the database an error will be thrown, so send the error forwards as a JSON object
    try:
        quiz:Quiz = Quiz.objects.get(id=id)
    except (Quiz.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    return makeQuizStruct(id, quiz.question, quiz.answer0, quiz.answer1, quiz.answer2, quiz.correct_answer, quiz.points, quiz.location)


def getQuizzesByLocation(id):
    quizQueryResults = Quiz.objects.all().filter(location=id).values()
    quizArray = []

    for result in quizQueryResults:
        quizArray.append(makeQuizStruct(result["id"], result["question"], result["answer0"], result["answer1"], result["answer2"], result["correct_answer"], result["points"], result["location"]))

    return {"quizzes": quizArray}


def getLocationById(id):
    try:
        location:Location = Location.objects.get(id=id)
    except (Location.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    return makeLocationStruct(id, location.name, location.gps_lat, location.gps_long, location.info, location.radius)


def getAllLocations():
    locationQueryResults = Location.objects.all().values()
    locationArray = []

    for result in locationQueryResults:
        locationArray.append(makeLocationStruct(result["id"], result["name"], result["gps_lat"], result["gps_long"], result["info"], result["radius"]))

    return {"locations": locationArray}


def getNearbyLocations(lat, long):
    locationQueryResults = Location.objects.all().values()
    locationArray = []

    for result in locationQueryResults:

        # calculate the distance to the location, 
        # if the provided latitude and longitutde is in the radius of the location, add it to the list

        rLat = result["gps_lat"]
        rLong = result["gps_long"]
        rRadius = result["radius"]

        deltaLat = lat - rLat
        deltaLong = long - rLong

        distanceSQ = deltaLat**2 + deltaLong**2

        if (distanceSQ >= rRadius**2):
            continue
        locationArray.append(makeLocationStruct(result["id"], result["name"], rLat, rLong, result["info"], rRadius))

    return {"locations": locationArray}

def getQuestById(id):
    # if there isn't a quiz with this id in the database an error will be thrown, so send the error forwards as a JSON object
    try:
        quest:Quest = Quest.objects.get(id=id)
    except (Quest.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    return makeQuestStruct(id, quest.task, quest.points)



def createLocation(lat, long, name, info, radius):
    location:Location = Location(name=name, info=info, gps_lat=lat, gps_long=long, radius=radius)
    location.save()

    return getLocationById(location.id)

def createQuiz(question, answer0, answer1, answer2, correctAnswer, points, location_id):
    quiz:Quiz = Quiz(question=question, answer0=answer0, answer1=answer1, answer2=answer2, correct_answer=correctAnswer, points=points, location=location_id)
    quiz.save()

    return getQuizById(quiz.id)

def createQuest(task, points):
    quest:Quest = Quest(task=task, points=points)
    quiz.save()

    return getQuizById(quiz.id)

def updateLocation(id, new_lat, new_long, new_name, new_info, new_radius):
    try:
        location:Location = Location.objects.get(id=id)
    except (Location.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    location.name = new_name
    location.info = new_info
    location.gps_lat = new_lat
    location.gps_long = new_long
    location.radius = new_radius

    location.save()

    return getLocationById(id)


def updateQuiz(id, new_question, new_answer0, new_answer1, new_answer2, new_correctAnswer, new_points, new_location):
    try:
        quiz:Quiz = Quiz.objects.get(id=id)
    except (Quiz.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    quiz.question = new_question
    quiz.answer0 = new_answer0
    quiz.answer1 = new_answer1
    quiz.answer2 = new_answer2
    quiz.correct_answer = new_correctAnswer
    quiz.points = new_points
    quiz.location = new_location

    quiz.save()

    return getQuizById(id)

def updateQuest(id, new_task, new_points):
    try:
        quest:Quest = Quest.objects.get(id=id)
    except (Quest.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    quest.task = new_task
    quest.points = new_points

    quest.save()

    return getQuestById(id)

def deleteLocation(id):
    try:
        location:Location = Location.objects.get(id=id)
    except (Location.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    # mark linked quizzes as belonging to the null location (-1)

    locationQuizzes =  getQuizzesByLocation(id)["quizzes"]
    for quiz in locationQuizzes:
        quiz["location"] = -1
        quiz.save()

    location.delete()
    return {"successful" : True}


def deleteQuiz(id):
    try:
        quiz:Quiz = Quiz.objects.get(id=id)
    except (Quiz.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    quiz.delete()
    return {"successful" : True}

def deleteQuest(id):
    try:
        quest:Quest = Quest.objects.get(id=id)
    except (Quest.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    quest.delete()
    return {"successful" : True}