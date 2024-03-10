#written by Hannah Jellett with help from Jasper Mare
from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.template import Context, loader
from django.views.decorators.csrf import csrf_exempt,csrf_protect
import json

from userDB import databaseInteractions

from django.contrib.auth.hashers import make_password, check_password


def index (request):
    template = loader.get_template("loginPage/LoginPage.html")
    return HttpResponse(template.render({}, request))

#returns registration page url
def register(request):
    return render(request, 'loginPage/Register.html')


@csrf_exempt #This skips csrf validation
def hashPass(request):
    #hashes password sent in by request

    if request.method == 'POST':
        #convert into ascii and then into a json object
        data = json.loads(request.body.decode('ascii'))

        #gets password field from request
        password = data['password']

        # Hash the password using built in DJango function
        hashedPassword = make_password(password)

        #return hashed password
        return JsonResponse({'hashedPassword': hashedPassword})

    #else return error if unable to hash password
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt #This skips csrf validation
def passCheck(request):
    #function to check password is valid for login 

    if request.method == 'POST':
        data = json.loads(request.body.decode('ascii'))
        
        #gets password and username fields from request
        password = data['password']
        username = data['username']

        user = databaseInteractions.getUserByName(username)

        #if there isn't a user with the input username, return an error
        if "error" in user: 
            return JsonResponse({'validLogin': False, 'error': 'user not found'})
        
        #get hashed password of input user
        hashedPW = user['password_hash']
        
        #gets user id 
        userId = user['id']

        #check input password against hashed password from DB
        validLogin = check_password(password, hashedPW)
        
        #return valid login (boolean) and the userId
        return JsonResponse({'validLogin': validLogin, 'userId': userId})

    #else return an error if unable to fetch/return the above
    return JsonResponse({'error': 'Method not allowed'}, status=405)
