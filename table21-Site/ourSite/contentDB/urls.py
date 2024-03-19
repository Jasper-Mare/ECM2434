# written by Hannah Jellett and Ruby Ham

from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("getQuizById", views.getQuizById, name="getQuizById"),
    path("getLocationById", views.getLocationById, name="getLocationById"),
    path("getQuestById", views.getQuestById, name="getQuestById"),
    path("getAllLocations", views.getAllLocations, name="getAllLocations"),
    path("getAllQuests", views.getAllQuests, name="getAllQuests"),
    path("getNearbyLocations", views.getNearbyLocations, name="getNearbyLocations"),
    path("getQuizzesByLocation", views.getQuizzesByLocation, name="getQuizzesByLocation"),
    path("createLocation", views.createLocation, name="createLocation"),
    path("createQuiz", views.createQuiz, name="createQuiz"),
    path("createQuest", views.createQuest, name="createQuest"),
    path("updateLocation", views.updateLocation, name="updateLocation"),
    path("updateQuiz", views.updateQuiz, name="updateQuiz"),
    path("updateQuest", views.updateQuest, name="updateQuest"),
    path("deleteLocation", views.deleteLocation, name="deleteLocation"),
    path("deleteQuiz", views.deleteQuiz, name="deleteQuiz"),
    path("deleteQuest", views.deleteQuest, name="deleteQuest"),
]

