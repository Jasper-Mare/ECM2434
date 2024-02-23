from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.template import Context, loader

# Create your views here.

def index (request):
    template = loader.get_template("loginPage/LoginPage.html")
    return HttpResponse(template.render({}, request))
