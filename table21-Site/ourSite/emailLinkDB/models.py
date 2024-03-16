from django.db import models

# Create your models here.
class EmailLink(models.Model):
    linkID = models.IntegerField(primary_key=True)
    userID = models.IntegerField()
    timeCreated = models.TimeField()