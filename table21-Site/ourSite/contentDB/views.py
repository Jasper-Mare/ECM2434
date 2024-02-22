from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.template import Context, loader
from math import isnan, nan

# Create your views here.

def index(request):
    template = loader.get_template("contentDB/instructions.txt")
    return HttpResponse(template.render(), content_type='text/plain')


def getQuizById(request):
    quizID:int = int(request.GET.get('quiz_ID', -1))

    if (quizID == -1):
        return makeError("parameter missing", "quiz_id parameter is missing!")

    quiz = databaseInteractions.getQuizByID(quizID)

    return JsonResponse(quiz)


def getQuizzesByLocation(request):
    locationID:int = int(request.GET.get('location_id', -1))

    if (locationID == -1):
        return makeError("parameter missing", "location_id parameter is missing!")

    quizzesList = databaseInteractions.getQuizzesByLocation(locationID)

    return JsonResponse(quizzesList)


def getLocationById(request):
    locationId:int = int(request.GET.get('location_id', -1))

    if (locationId == -1):
        return makeError("parameter missing", "location_id parameter is missing!")

    location = databaseInteractions.getLocationByID(locationId)

    return JsonResponse(location)


def getAllLocations(request):
    location = databaseInteractions.getAllLocations()
    return JsonResponse(location)


def getNearbyLocations(request):
    lat:float = float(request.GET.get('lat', nan))
    long:float = float(request.GET.get('long', nan))

    if (isnan(lat)):
        return makeError("parameter missing", "lat parameter is missing!")
    
    if (isnan(long)):
        return makeError("parameter missing", "long parameter is missing!")

    locations = databaseInteractions.getNearbyLocations()
    return JsonResponse(locations)


def createLocation(request):
    locationName = request.GET.get('location_name', "")
    gpsLat:float = float(request.GET.get('gps_lat', nan))
    gpsLong:float = float(request.GET.get('gps_ong', nan))
    info = request.GET.get('info', "")
    radius:float = float(request.GET.get('radius', -1))

    if (locationName == ""):
        return makeError("parameter missing", "location_name parameter is missing!")
    if (isnan(gpsLat)):
        return makeError("parameter missing", "gps_lat parameter is missing!")
    if (isnan(gpsLong)):
        return makeError("parameter missing", "gps_long parameter is missing!")
    if (info == ""):
        return makeError("parameter missing", "info parameter is missing!")
    if (radius == -1):
        return makeError("parameter missing", "radius parameter is missing!")
    

    location = databaseInteractions.createLocation(locationName, gpsLat,gpsLong, info, radius)

    return JsonResponse(location)


def createQuiz(request):
    question = request.GET.get('question', "")
    answer0 = request.GET.get('answer0', "")
    answer1 = request.GET.get('answer1', "")
    answer2 = request.GET.get('answer2', "")
    correctAnswer = request.GET.get('correct_answer', "")
    points:int = int(request.GET.get('points', -1))

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
    
    quiz = databaseInteractions.createQuiz(question, answer0, answer1, answer2, correctAnswer,points)

    return JsonResponse(quiz)


def updateLocation(request):


def updateQuiz(request):


def deleteLocation(request):


def deleteQuiz(request):



def makeError(type, errorMsg):
    return JsonResponse({"error":type,"details":errorMsg})
