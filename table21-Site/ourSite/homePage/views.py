# written by Jasper

from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect, render

# Create your views here.

def index(request):

    # load up the redirect page, set to redirect to the map or login pages depending on whether the user is logged in

    loginCookie = request.COOKIES.get('login', 'no_login')
    
    isLoggedIn = (loginCookie != 'no_login')

    if (isLoggedIn):
        target_url = '/map'
    else:
        target_url = '/login'

    return render(request, 'homePage/redirectPage.html', {'target_url': target_url})