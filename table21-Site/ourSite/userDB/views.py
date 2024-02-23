from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.template import Context, loader

from . import databaseInteractions;

# Create your views here.
def index(request):
    template = loader.get_template("userDB/instructions.txt")
    return HttpResponse(template.render(), content_type='text/plain')


def getUserById(request):
    userId:int = int(request.GET.get('id', -1))

    if (userId == -1):
        return makeError("parameter missing", "id parameter is missing!")

    user = databaseInteractions.getUserById(userId)

    return JsonResponse(user)


def getUserByName(request):
    userName:str = request.GET.get('name', "")

    if (userName == ""):
        return makeError("parameter missing", "name parameter is missing!")

    user = databaseInteractions.getUserByName(userName)

    return JsonResponse(user)


def getUsersByScore(request):
    numPlayers:int = int(request.GET.get('number_of_players', -1))

    if (numPlayers == -1):
        return makeError("parameter missing", "number_of_players parameter is missing!")

    usersList = databaseInteractions.getUsersByScore(numPlayers)

    return JsonResponse(usersList)

def createUser(request):
    userName = request.GET.get('name', "")
    userPwordHash = request.GET.get('password_hash', "")
    userAccessLevel = request.GET.get('access_level', "")
    userRecoveryEmail = request.GET.get('recovery_email', "")

    if (userName == ""):
        return makeError("parameter missing", "name parameter is missing!")
    if (userPwordHash == ""):
        return makeError("parameter missing", "password_hash parameter is missing!")
    if (userAccessLevel == ""):
        return makeError("parameter missing", "access_level parameter is missing!")
    if (userRecoveryEmail == ""):
        return makeError("parameter missing", "recovery_email parameter is missing!")

    user = databaseInteractions.createUser(userName, userPwordHash, userAccessLevel, userRecoveryEmail)

    return JsonResponse(user)

def updateUser(request):
    userId:int = request.GET.get('id', -1)

    if (userId == -1):
        return makeError("parameter missing", "id parameter is missing!")

    oldUserInfo = databaseInteractions.getUserById(userId)
    
    # get parameters, with the old versions as the defaults
    userName = request.GET.get('name', oldUserInfo["name"])
    userPwordHash = request.GET.get('password_hash', oldUserInfo["password_hash"])
    userAccessLevel = request.GET.get('access_level', oldUserInfo["access_level"])
    userRecoveryEmail = request.GET.get('recovery_email', oldUserInfo["recovery_email"])
    userScore = request.GET.get('score', oldUserInfo["score"])

    newUserInfo = databaseInteractions.updateUser(userId, userName, userPwordHash, userAccessLevel, userRecoveryEmail, userScore)

    return JsonResponse(newUserInfo)

def deleteUser(request):
    userId:int = request.GET.get('id', -1)

    if (userId == -1):
        return makeError("parameter missing", "id parameter is missing!")

    successfulDelete = databaseInteractions.deleteUser(userId)

    return JsonResponse(successfulDelete)

def makeError(type, errorMsg):
    return JsonResponse({"error":type,"details":errorMsg})