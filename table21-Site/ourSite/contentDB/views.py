from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.template import Context, loader

# Create your views here.
"""
    id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=256)
    answer0 = models.CharField(max_length=64)
    answer1 = models.CharField(max_length=64)
    answer2 = models.CharField(max_length=64)
    correctAnswer =  models.SmallIntegerField()
    score = models.IntegerField()
    location = models.ForeignKey()

    """

def index(request):
    template = loader.get_template("contentDB/instructions.txt")
    return HttpResponse(template.render(), content_type='text/plain')



def getQuizzesByLocation(request):
    locationID:int = int(request.GET.get('location_ID', -1))

    if (locationID == -1):
        return makeError("parameter missing", "location_ID parameter is missing!")

    quizzesList = databaseInteractions.getUsersByScore(numPlayers)

    return JsonResponse(usersList)



def makeError(type, errorMsg):
    return JsonResponse({"error":type,"details":errorMsg})
