from django.shortcuts import render
from django.http import HttpResponse
from django.template import Context, loader


def index(request):
    template = loader.get_template("map/index.html")
    return HttpResponse(template.render({},request))

def about(request):
    template = loader.get_template("map/about.html")
    return HttpResponse(template.render({},request))
 
