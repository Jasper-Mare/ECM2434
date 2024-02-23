from django.db import models

# Create your models here.
class Location(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    info = models.CharField(max_length=256)
    gps_lat = models.FloatField()
    gps_long = models.FloatField()
    radius = models.FloatField()

class Quiz(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=256)
    answer0 = models.CharField(max_length=64)
    answer1 = models.CharField(max_length=64)
    answer2 = models.CharField(max_length=64)
    correct_answer =  models.SmallIntegerField()
    points = models.IntegerField()
    location = models.IntegerField() # The foreign key that points to the id of the related location
     # models.ForeignKey(Location, on_delete=models.SET_DEFAULT, to_field='id', default=-1)