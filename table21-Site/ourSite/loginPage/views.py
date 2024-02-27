from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.template import Context, loader

from django.contrib.auth.hashers import make_password

# Create your views here.

def index (request):
    template = loader.get_template("loginPage/LoginPage.html")
    return HttpResponse(template.render({}, request))

def register(request):
    return render(request, 'loginPage/Register.html')


def hashPass(request):
    if request.method == 'POST':
        data = request.POST
        password = data.get('password')

        # Hash the password
        hashed_password = make_password(password)

        # Store or use hashed_password as needed
        
        return JsonResponse({'hashed_password': hashed_password})

    return JsonResponse({'error': 'Method not allowed'}, status=405)

