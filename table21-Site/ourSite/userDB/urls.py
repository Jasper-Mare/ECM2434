# Written by Jasper

from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("getUserById", views.getUserById, name="getUserById"),
    path("getUserTargetLocation", views.getUserLocation, name="getUserTargetLocation"),
    path("getUserByName", views.getUserByName, name="getUserByName"),
    path("getUsersByScore", views.getUsersByScore, name="getUsersByScore"),
    path("createUser", views.createUser, name="createUser"),
    path("updateUser", views.updateUser, name="updateUser"),
    path("deleteUser", views.deleteUser, name="deleteUser"),
]

