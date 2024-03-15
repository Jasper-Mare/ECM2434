from .models import EmailLink

# builds the dictionary that turns into the JSON response for quizzes
def makeEmailLinkStruct(linkID, userID, timeCreated):
    return {
        "linkID" : linkID, 
        "userID" : userID, 
        "linkCreated" : timeCreated,
        
    }

def getUserByLinkID(linkID):
    # if there isn't a user with this link id in the database an error will be thrown, so send the error forwards as a JSON object
    try:
        quiz:EmailLink = EmailLink.objects.get(linkID=linkID)
    except (EmailLink.DoesNotExist):
        return {"error":"DoesNotExist", "details":f"id: {id} does not exist"}
    
    return makeEmailLinkStruct(linkID, EmailLink.userID, EmailLink.timeCreated)
