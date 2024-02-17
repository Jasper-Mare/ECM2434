from django.core import serializers

AccessLevels = ["USER", "GAME_KEEPER", "DEVELOPER"]

def makeUserStruct(id:int, name:str, password_hash:str, accessLevel:str, recovery_email:str, score:int):
    return {
        "id" : id, 
        "name" : name, 
        "password_hash" : password_hash, 
        "access_level" : accessLevel, 
        "recovery_email": recovery_email,
        "score" : score,
    }

def getUserById(id:int):
    
    return makeUserStruct(id, "dummyName", "1234", AccessLevels[0], "dummyEmail@exeter.ac.uk", 0)


def getUserByName(name:str):
    
    return makeUserStruct(0, name, "1234", AccessLevels[0], "dummyEmail@exeter.ac.uk", 0)


def getUsersByScore(numPlayers:int):
    user1 = makeUserStruct(0, "dummyName", "1234", AccessLevels[0], "dummyEmail@exeter.ac.uk", 0)
    user2 = makeUserStruct(1, "dummyName", "1234", AccessLevels[0], "dummyEmail@exeter.ac.uk", 0)
    userArray = [user1, user2]
    return {"users": userArray}


def createUser(name:str, password_hash:str, access_level:str, recovery_email:str):

    return makeUserStruct(0, name, password_hash, access_level, recovery_email, 0)


def updateUser(id:int, new_name:str, new_password_hash:str, new_access_level:str, new_email:str, new_score:int):

    return makeUserStruct(id, new_name, new_password_hash, new_access_level, new_email, new_score)


def deleteUser(id:int):
    
    return {"successful" : True}