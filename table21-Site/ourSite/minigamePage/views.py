from django.shortcuts import render
from django.template import Context, loader

# Create your views here.
from django.http import HttpResponse

def index(request):
    template = loader.get_template("game.html")
    return HttpResponse(template.render({}, request))

