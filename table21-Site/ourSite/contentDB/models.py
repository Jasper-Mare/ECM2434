from django.db import models

# Create your models here.
class Location:
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    info = models.CharField(max_length=256)
    gpsLat = models.FloatField()
    gpsLon = models.FloatField()
    radius = models.FloatField()

class Quiz:
    id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=256)
    answer0 = models.CharField(max_length=64)
    answer1 = models.CharField(max_length=64)
    answer2 = models.CharField(max_length=64)
    correctAnswer =  models.SmallIntegerField()
    score = models.IntegerField()