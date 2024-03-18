from django.db import models

# Create your models here.

class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    password_hash = models.CharField(max_length=60)
    access_level = models.CharField(max_length=11)
    recovery_email = models.EmailField()
    score = models.IntegerField()

    def __str__(self):
        return f"user {self.id} : {self.name}"
    
class PlayerTargetLocation(models.Model):
    player = models.IntegerField()
    location = models.IntegerField()