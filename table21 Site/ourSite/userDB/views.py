from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseBadRequest

import databaseInteractions;

# Create your views here.
def index(request):
    return HttpResponse("Welcome to the User Database API")

def getUserById(request):
    userId = request.GET.get('id', -1)

    if (userId == -1):
        return HttpResponseBadRequest("id parameter is missing!")

    dummyUser = databaseInteractions.getUserById(userId)

    return JsonResponse(dummyUser)