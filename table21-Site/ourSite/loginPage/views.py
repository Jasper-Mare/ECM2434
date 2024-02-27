from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.template import Context, loader
from django.views.decorators.csrf import csrf_exempt,csrf_protect
import json

from userDB import databaseInteractions

from django.contrib.auth.hashers import make_password, check_password

# Create your views here.

def index (request):
    template = loader.get_template("loginPage/LoginPage.html")
    return HttpResponse(template.render({}, request))

def register(request):
    return render(request, 'loginPage/Register.html')

@csrf_exempt #This skips csrf validation
def hashPass(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('ascii'))
        password = data['password']
        print("password isss ", password)

        # Hash the password
        hashedPassword = make_password(password)

        print("hashedPassword is  ", hashedPassword)

        # Store or use hashed_password as needed
        
        return JsonResponse({'hashedPassword': hashedPassword})

    return JsonResponse({'error': 'Method not allowed'}, status=405)

#checks input password matches 
@csrf_exempt #This skips csrf validation
def passCheck(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('ascii'))
        
        password = data['password']
        username = data['username']

        #print("request.body ", request.body)
        #print("request.POST ", request.POST)
        

        print("data is ", data)
        print("username is ",username)
        print("password is ",password)

        user = databaseInteractions.getUserByName(username)
        print(user)

        if "error" in user: 
            return JsonResponse({'validLogin': False, 'error': 'user not found'})

        hashedPW = user['password_hash']
        print("hashed passs   ", hashedPW)
        #a = make_password("hi")
        #print("is ittttt   ", check_password(password, hashedPW))

        userId = user['id']

        # Hash the password
        validLogin = check_password(password, hashedPW)

        # Store or use hashed_password as needed
        
        return JsonResponse({'validLogin': validLogin, 'userId': userId})

    return JsonResponse({'error': 'Method not allowed'}, status=405)
