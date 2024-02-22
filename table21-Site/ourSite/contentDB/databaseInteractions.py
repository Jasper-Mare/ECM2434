from .models import Quiz, Location

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


def makeLocationStruct(id, name, lat, long, info, radius):
    return {
        "id" : int(id), 
        "name" : name, 
        "gps_lat" : float(lat), 
        "gps_long" : float(long), 
        "info": info,
        "radius" : int(radius),
    }


def getQuizById(id):
    try:
        quiz:Quiz = Quiz.objects.get(id=id)
    except (Quiz.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    return makeQuizStruct(id, quiz.question, quiz.answer0, quiz.answer1, quiz.answer2, quiz.correctAnswer, quiz.points, quiz.location)


def getQuizzesByLocation(id):
    quizQueryResults = Location.objects.all().filter(location=id).values()
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

        rLat = result["GPS_lat"]
        rLong = result["GPS_long"]
        rRadius = result["radius"]

        deltaLat = lat - rLat
        deltaLong = long - rLong

        distanceSQ = deltaLat**2 + deltaLong**2

        if (distanceSQ >= rRadius**2):
            continue
        locationArray.append(makeLocationStruct(result["id"], result["name"], rLat, rLong, result["info"], rRadius))

    return {"locations": locationArray}


def createLocation(lat, long, name, info, radius):
    location:Location = Location(name=name, info=info, gps_lat=lat, gps_long=long, radius=radius)
    location.save()

    return getLocationById(location.id)

def createQuiz(question, answer0, answer1, answer2, correctAnswer, points, location_id):
    quiz:Quiz = Quiz(question=question, answer0=answer0, answer1=answer1, answer2=answer2, correct_answer=correctAnswer, points=points, location=location_id)
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

def deleteLocation(id):
    try:
        location:Location = Location.objects.get(id=id)
    except (Location.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    location.delete()
    return {"successful" : True}


def deleteQuiz(id):
    try:
        quiz:Quiz = Quiz.objects.get(id=id)
    except (Quiz.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    quiz.delete()
    return {"successful" : True}