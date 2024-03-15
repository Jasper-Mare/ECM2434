
#written by Hannahy Jellett
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


def getUserByLinkID(request):
    linkId:int = int(request.GET.get('linkID', -1))

    if (linkId == -1):
        return makeError("parameter missing", "id parameter is missing!")

    user = databaseInteractions.getUserByLinkID(linkId)

    return JsonResponse(user)


def makeError(type, errorMsg):
    return JsonResponse({"error":type,"details":errorMsg})