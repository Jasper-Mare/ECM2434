from django.shortcuts import render
from django.template import Context, loader

# Create your views here.
from django.http import HttpResponse

def new(request):
    template = loader.get_template("newquiz/newquiz.html")
    return HttpResponse(template.render({}, request))

def index(request):
    template = loader.get_template("quiz/quiz.html")
    return HttpResponse(template.render({}, request))