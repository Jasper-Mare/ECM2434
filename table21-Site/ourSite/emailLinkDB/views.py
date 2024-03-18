
# written by Hannahy Jellett
# Create your views here.

from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.template import Context, loader
from math import isnan, nan

from . import databaseInteractions

def index(request):
    template = loader.get_template("EmailLinkDB/instructions.txt")
    return HttpResponse(template.render(), content_type='text/plain')

def createUserPassLink(request):
    linkID = request.GET.get('linkID', -1)
    userID = request.GET.get('userID', -1)

    if (linkID == -1):
        return makeError("parameter missing",  "linkID parameter is missing!")
    if (userID == -1):
        return makeError("parameter missing", "userID parameter is missing!")
    
    user = databaseInteractions.createUserLink(linkID, userID)

    return JsonResponse(user)

def getUserByLinkID(request):
    linkID:int = int(request.GET.get('linkID', -1))

    if (linkID == -1):
        return makeError("parameter missing", "linkID parameter is missing!")

    user = databaseInteractions.getUserByLinkID(linkID)

    return JsonResponse(user)


def makeError(type, errorMsg):
    return JsonResponse({"error":type,"details":errorMsg})