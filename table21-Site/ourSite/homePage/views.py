from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect, render

# Create your views here.
from django.http import HttpResponse


def index(request):

    isLoggedIn = False

    if (isLoggedIn):
        target_url = '/map'
    else:
        target_url = '/login'


    return render(request, 'homePage/redirectPage.html', {'target_url': target_url})


# redirect user to appropriate page depending on if there is a login cookie yet
# https://www.geeksforgeeks.org/django-redirects/