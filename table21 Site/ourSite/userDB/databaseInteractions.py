from django.core import serializers

AccessLevels = ["USER", "GAME KEEPER", "DEVELOPER"]

def getUserById(id:int):
    userData = {
        "id" : id, 
        "name" : "dummyName", 
        "password_hash" : "1234", 
        "access_level" : AccessLevels[0], 
        "recovery_email": "dummyEmail@exeter.ac.uk",
        "score" : 0,
    }

    return userData

