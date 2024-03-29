# written by Jasper

from .models import User, PlayerTargetLocation
from urllib.parse import unquote

AccessLevels = ["USER", "GAME_KEEPER", "DEVELOPER"]

def makeUserStruct(id:int, name:str, password_hash:str, access_level:str, recovery_email:str, score:int):
    return {
        "id" : int(id), 
        "name" : name, 
        "password_hash" : password_hash, 
        "access_level" : access_level, 
        "recovery_email": recovery_email,
        "score" : int(score),
    }

def makeTableStruct(id:int, name:str, access_level:str, recovery_email:str):
    return{
        "id" : int(id), 
        "name" : name, 
        "access_level" : access_level, 
        "recovery_email": recovery_email,
    }

def getUserById(id:int):
    try:
        user:User = User.objects.get(id=id)
    except (User.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    return makeUserStruct(user.id, user.name, user.password_hash, user.access_level, user.recovery_email, user.score)


def getUserByEmail(email:str):
    try:
        user:User = User.objects.get(recovery_email=email)
    except (User.DoesNotExist):
        print("email doesn't exist yetttt")
        return {"error":"DoesNotExist", "details":f"email: {email} does not exist"}

    return makeUserStruct(user.id, user.name, user.password_hash, user.access_level, user.recovery_email, user.score)

def getUserTargetLocation(id:int, defaultIfNot:int):
    try:
        playerLocation = PlayerTargetLocation.objects.get(player=id)
    except (PlayerTargetLocation.DoesNotExist):
        playerLocation = PlayerTargetLocation(player=id, location=defaultIfNot)
        playerLocation.save()
        return {"location": defaultIfNot}
    
    return {"location": playerLocation.location}

def updateUserLocation(id:int, location:int):
    try:
        playerLocation = PlayerTargetLocation.objects.get(player=id)
        playerLocation.location = location
        playerLocation.save()
    except (PlayerTargetLocation.DoesNotExist):
        playerLocation = PlayerTargetLocation(player=id, location=location)
        playerLocation.save()

    return getUserTargetLocation(id, location)

def getUserByName(name:str):
    try:
        user:User = User.objects.get(name=name)
    except (User.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"name: {name} does not exist"}

    return makeUserStruct(user.id, user.name, user.password_hash, user.access_level, user.recovery_email, user.score)


def getUsersByScore(numPlayers:int):
    userQueryResults = User.objects.order_by("-score")[:numPlayers].values()
    userArray = []

    for result in userQueryResults:
        userArray.append(makeUserStruct(result["id"], result["name"], result["password_hash"], result["access_level"], result["recovery_email"], result["score"]))

    return {"users": userArray}


def createUser(name:str, password_hash:str, access_level:str, recovery_email:str):
    # decode the sanitised password hash to avoid special characters changing the hash
    uriDecodedPasswordHash = unquote(password_hash)

    user:User = User(name=name, password_hash=uriDecodedPasswordHash, access_level=access_level, recovery_email=recovery_email, score=0)
    user.save()

    return getUserById(user.id)


def updateUser(id:int, new_name:str, new_password_hash:str, new_access_level:str, new_email:str, new_score:int):
    # decode the sanitised password hash to avoid special characters changing the hash
    uriDecodedPasswordHash = unquote(new_password_hash)

    try:
        user:User = User.objects.get(id=id)
    except (User.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}

    user.name = new_name
    user.password_hash = uriDecodedPasswordHash
    user.access_level = new_access_level
    user.recovery_email = new_email
    user.score = new_score

    user.save()

    return getUserById(id)

def deleteUser(id:int):
    try:
        user:User = User.objects.get(id=id)
    except (User.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    user.delete()
    return {"successful" : True}

# ---- MATT ADDITIONS ----

def getNumberOfUsers():
    total = User.objects.count()
    return {'count': total}

def fillTable():
    data = User.objects.values()
    tableArray = []
    for entry in data:
        tableArray.append(makeTableStruct(entry["id"], entry["name"], entry["access_level"], entry["recovery_email"]))

    return {"users": tableArray}