#written by Hannah Jellett
from django.urls import path, include
from django.contrib import auth
from django.contrib.auth import views as auth_views


from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static


from . import views

from django.contrib.auth.views import (
    LogoutView, 
    PasswordResetView, 
    PasswordResetDoneView, 
    PasswordResetConfirmView,
    PasswordResetCompleteView
)

urlpatterns = [
    path("", views.index, name="index"),
    path("Register", views.register, name="Register"),
    path("hash", views.hashPass, name="hash"),
    path("passCheck", views.passCheck, name="passCheck"),
    path("emailCheck", views.emailCheck, name="emailCheck"),

    path("password-reset-form", views.passResetEmail, name="password_reset_form"),
    path("password-reset-confirm/", views.resetPasswordLink, name="password_reset_confirm"),
    #path("password-reset-confirm/<uidb64>/<token>", views.resetPasswordLink, name="password_reset_confirm"),

    path("sendEmail", views.sendEmail, name="sendEmail"),
    path("getToken", views.getToken, name="getToken"),

]
