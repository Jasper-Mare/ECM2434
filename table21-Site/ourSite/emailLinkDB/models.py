from django.db import models

# Create your models here.
class EmailLink(models.Model):
    id = models.IntegerField(primary_key=True)
    userID = models.IntegerField()
    timeCreated = models.TimeField()