#written by Hannah Jellett
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("Register", views.register, name="Register"),
    path("hash", views.hashPass, name="hash"),
    path("passCheck", views.passCheck, name="passCheck"),
    path("forgotPassword", views.forgotPassword, name="forgotPassword"),
    path("emailCheck", views.emailCheck, name="emailCheck"),
]
