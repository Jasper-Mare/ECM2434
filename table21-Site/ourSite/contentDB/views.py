# written by Hannah Jellett

from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.template import Context, loader
from math import isnan, nan

from . import databaseInteractions

# Create your views here.

def index(request):
    template = loader.get_template("contentDB/instructions.txt")
    return HttpResponse(template.render(), content_type='text/plain')


def getQuizById(request):
    quizId:int = int(request.GET.get('id', -1))

    if (quizId == -1):
        return makeError("parameter missing", "id parameter is missing!")

    quiz = databaseInteractions.getQuizById(quizId)

    return JsonResponse(quiz)


def getQuizzesByLocation(request):
    locationID:int = int(request.GET.get('id', -1))

    if (locationID == -1):
        return makeError("parameter missing", "id parameter is missing!")

    quizzesList = databaseInteractions.getQuizzesByLocation(locationID)

    return JsonResponse(quizzesList)


def getLocationById(request):
    locationId:int = int(request.GET.get('id', -1))

    if (locationId == -1):
        return makeError("parameter missing", "id parameter is missing!")

    location = databaseInteractions.getLocationById(locationId)

    return JsonResponse(location)


def getAllLocations(request):
    location = databaseInteractions.getAllLocations()
    return JsonResponse(location)


def getNearbyLocations(request):
    lat:float = float(request.GET.get('gps_lat', nan))
    long:float = float(request.GET.get('gps_long', nan))

    if (isnan(lat)):
        return makeError("parameter missing", "gps_lat parameter is missing!")
    
    if (isnan(long)):
        return makeError("parameter missing", "gps_long parameter is missing!")

    locations = databaseInteractions.getNearbyLocations(lat, long)
    return JsonResponse(locations)


def createLocation(request):
    locationName = request.GET.get('name', "")
    gpsLat:float = float(request.GET.get('gps_lat', nan))
    gpsLong:float = float(request.GET.get('gps_long', nan))
    info = request.GET.get('info', "")
    radius:float = float(request.GET.get('radius', -1))

    if (locationName == ""):
        return makeError("parameter missing", "name parameter is missing!")
    if (isnan(gpsLat)):
        return makeError("parameter missing", "gps_lat parameter is missing!")
    if (isnan(gpsLong)):
        return makeError("parameter missing", "gps_long parameter is missing!")
    if (info == ""):
        return makeError("parameter missing", "info parameter is missing!")
    if (radius == -1):
        return makeError("parameter missing", "radius parameter is missing!")
    

    location = databaseInteractions.createLocation(gpsLat, gpsLong, locationName, info, radius)

    return JsonResponse(location)


def createQuiz(request):
    question = request.GET.get('question', "")
    answer0 = request.GET.get('answer0', "")
    answer1 = request.GET.get('answer1', "")
    answer2 = request.GET.get('answer2', "")
    correctAnswer:int = int(request.GET.get('correct_answer', ""))
    points:int = int(request.GET.get('points', -1))
    locationId:int = int(request.GET.get('location_id', -1))

    if (question == ""):
        return makeError("parameter missing", "question parameter is missing!")
    if (answer0 == ""):
        return makeError("parameter missing", "answer0 parameter is missing!")
    if (answer1 == ""):
        return makeError("parameter missing", "answer1 parameter is missing!")
    if (answer2 == ""):
        return makeError("parameter missing", "answer2 parameter is missing!")
    if (correctAnswer == ""):
        return makeError("parameter missing", "correct_answer parameter is missing!")
    if (points == -1):
        return makeError("parameter missing", "points parameter is missing!")
    if (locationId == -1):
        return makeError("parameter missing", "location_id parameter is missing!")
    
    quiz = databaseInteractions.createQuiz(question, answer0, answer1, answer2, correctAnswer, points, locationId)

    return JsonResponse(quiz)


def updateLocation(request):
    locationId:int = request.GET.get('id', -1)

    if (locationId == -1):
        return makeError("parameter missing", "id parameter is missing!")

    oldLocationInfo = databaseInteractions.getLocationById(locationId)
    
    # get parameters, with the old versions as the defaults
    locationName = request.GET.get('name', oldLocationInfo["name"])
    gpsLat:float = float(request.GET.get('gps_lat', oldLocationInfo["gps_lat"]))
    gpsLong:float = float(request.GET.get('gps_long', oldLocationInfo["gps_long"]))
    info = request.GET.get('info', oldLocationInfo["info"])
    radius:float = float(request.GET.get('radius', oldLocationInfo["radius"]))

    newLocationInfo = databaseInteractions.updateLocation(locationId, gpsLat, gpsLong, locationName, info, radius)

    return JsonResponse(newLocationInfo)

def updateQuiz(request):
    quizId:int = request.GET.get('id', -1)

    if (quizId == -1):
        return makeError("parameter missing", "id parameter is missing!")

    oldQuizInfo = databaseInteractions.getQuizById(quizId)
    
    # get parameters, with the old versions as the defaults
    question = request.GET.get('question', oldQuizInfo["question"])
    answer0 = request.GET.get('answer0', oldQuizInfo["answer0"])
    answer1 = request.GET.get('answer1', oldQuizInfo["answer1"])
    answer2 = request.GET.get('answer2', oldQuizInfo["answer2"])
    correct_answer = request.GET.get('correct_answer', oldQuizInfo["correct_answer"])
    points:int = int(request.GET.get('points', oldQuizInfo["points"]))
    locationId:int = int(request.GET.get('location_id', oldQuizInfo["location"]))

    newQuizInfo = databaseInteractions.updateQuiz(quizId, question, answer0, answer1, answer2, correct_answer, points, locationId)

    return JsonResponse(newQuizInfo)


def deleteLocation(request):
    locationId:int = request.GET.get('id', -1)

    if (locationId == -1):
        return makeError("parameter missing", "id parameter is missing!")

    successfulLocationDelete = databaseInteractions.deleteLocation(locationId)

    return JsonResponse(successfulLocationDelete)


def deleteQuiz(request):
    quizId:int = request.GET.get('id', -1)

    if (quizId == -1):
        return makeError("parameter missing", "id parameter is missing!")

    successfulQuizDelete = databaseInteractions.deleteQuiz(quizId)

    return JsonResponse(successfulQuizDelete)



def makeError(type, errorMsg):
    return JsonResponse({"error":type,"details":errorMsg})
