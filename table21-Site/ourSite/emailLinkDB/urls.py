# written by Hannah Jellett

from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("getUserByLinkID", views.getUserByLinkID, name="getUserByLinkID"),
]