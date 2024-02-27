from django.urls import path

from . import views
#create current path for page
urlpatterns = [
    path("", views.index, name="index"),
]