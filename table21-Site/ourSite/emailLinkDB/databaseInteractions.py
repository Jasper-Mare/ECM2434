#written by Hannah Jellett
from .models import EmailLink

from urllib.parse import unquote

def makeEmailLinkStruct(linkID, userID):
    return {
        "linkID" : linkID, 
        "userID" : userID,         
    }

def createUserLink(linkToken:int, user:int):
    # decode the sanitised password hash to avoid special characters changing the hash

    user:EmailLink = EmailLink(linkID=linkToken, userID=user)
    user.save()

    return getUserByLinkID(linkToken)


def getUserByLinkID(linkID):
    # if there isn't a user with this link id in the database an error will be thrown, so send the error forwards as a JSON object
    try:
        emailLink:EmailLink = EmailLink.objects.get(linkID=linkID)
    except (EmailLink.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    return makeEmailLinkStruct(linkID, emailLink.userID)

