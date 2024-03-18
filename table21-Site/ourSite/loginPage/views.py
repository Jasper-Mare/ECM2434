#written by Hannah Jellett with help from Jasper Mare
from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse, HttpRequest, HttpResponseBadRequest
from django.template import Context, loader
from django.views.decorators.csrf import csrf_exempt,csrf_protect
import json

from django.urls import resolve

from urllib.parse import urlparse

from userDB import databaseInteractions


from django.contrib.auth.hashers import make_password, check_password

from django.core.mail import send_mail

from django.http import HttpRequest

import secrets

#django imports for generating unique link
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes


def index (request):
    template = loader.get_template("loginPage/LoginPage.html")
    return HttpResponse(template.render({}, request))

#returns registration page url
def register(request):
    return render(request, 'loginPage/Register.html')


#returns forgot password page url
def passResetEmail(request):
    return render(request, 'registration/password_reset_form.html')

def resetPassEmailSent(request):
    return render(request, 'registration/password_reset_done.html')

def PasswordBeenReset(request):
    return render(request, 'registration/password_reset_complete.html')

def resetPasswordLink(request):
    return render(request, 'registration/password_reset_confirm.html')


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



@csrf_exempt #This skips csrf validation
def emailCheck(request):
    #function to check email exists on the system

    if request.method == 'POST':
        data = json.loads(request.body.decode('ascii'))
        
        #gets email fields from request
        email = data['email']

        user = databaseInteractions.getUserByEmail(email)

        #if there isn't a user with the input email, return an error
        if "error" in user: 
            return JsonResponse({'validEmail': False, 'error': 'email not found'})
        

    #else return an error if unable to fetch/return the above
    return JsonResponse({'error': 'Method not allowed'}, status=405)
    

def createLink(userID):
    from emailLinkDB import databaseInteractions

    secretsGenerator = secrets.SystemRandom()
    # Generate a unique token for the user
    uniqueToken = str(secretsGenerator.randint(1000000, 9999999))

    user = databaseInteractions.createUserLink(uniqueToken, userID)

    # Construct the reset link URL with token and uid
    resetLink = "http://127.0.0.1:8000/login/password-reset-confirm/?linkID="+uniqueToken

    return resetLink

@csrf_exempt #This skips csrf validation
def sendEmail(request):
    
    #function to check email exists on the system

    if request.method == 'POST':
        try:
            #gets email from request
            data = json.loads(request.body.decode('ascii'))
            email = data['email']

            print("the email sent in isss "+email)

            user = databaseInteractions.getUserByEmail(email)
            userID = user['id']
      
            uniqueLink = createLink(userID)

            print("the unique link issss "+uniqueLink)

            subject = 'Reset Your Password'
            message = "Here's your link to reset your password: "+uniqueLink
            
            sender_email = 'ecoquestexeter@gmail.com'
            recipient_list = [email]

            send_mail(subject, message, sender_email, recipient_list)
            print("Email was sent!")
            return JsonResponse({'success': True})
        

        except Exception as e:
            print("Error sending email:", str(e))
            return JsonResponse({'error': 'An error occurred while sending the email.'}, status=500)

        
    #else return an error if unable to fetch/return the above
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt #This skips csrf validation
def getToken(request):
    from emailLinkDB import databaseInteractions
    print("in get token")
    linkID:int = int(request.GET.get('linkID', -1))

    print(linkID)

    if (linkID == -1):
        print("linkID is not here")
        return makeError("parameter missing", "linkID parameter is missing!")

    user = databaseInteractions.getUserByLinkID(linkID)
    print(user)

    return JsonResponse(user)


def getUserByEmail(request):
    email:str = str(request.GET.get('recovery_email', ""))

    if (email == ""):
        return makeError("parameter missing", "email parameter is missing!")

    user = databaseInteractions.getUserByEmail(email)

    return JsonResponse(user)


def makeError(type, errorMsg):
    return JsonResponse({"error":type,"details":errorMsg})