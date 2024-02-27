# written by Hannah Jellett

from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("getQuizById", views.getQuizById, name="getQuizById"),
    path("getLocationById", views.getLocationById, name="getLocationById"),
    path("getAllLocations", views.getAllLocations, name="getAllLocations"),
    path("getNearbyLocations", views.getNearbyLocations, name="getNearbyLocations"),
    path("getQuizzesByLocation", views.getQuizzesByLocation, name="getQuizzesByLocation"),
    path("createLocation", views.createLocation, name="createLocation"),
    path("createQuiz", views.createQuiz, name="createQuiz"),
    path("updateLocation", views.updateLocation, name="updateLocation"),
    path("updateQuiz", views.updateQuiz, name="updateQuiz"),
    path("deleteLocation", views.deleteLocation, name="deleteLocation"),
    path("deleteQuiz", views.deleteQuiz, name="deleteQuiz"),
]

