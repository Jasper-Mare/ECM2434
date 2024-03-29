// code written by Hannah Jellett

//function to save users new password in DB
async function saveNewPass() {
    //gets values input by user in both text fields
    //trim both values to remove any whitespaces
    password = (document.getElementById("password").value).trim();
    repeatPassword = (document.getElementById("repeatPassword").value).trim();
    //ensure no fields are left empty
    if (checkIfEmpty(password) || checkIfEmpty(repeatPassword)) {
        alert("Please fill in all fields");
        //leave function if a field is empty
        return;
    }
    //check passwords entered match
    if (checkPasswordMatch(password, repeatPassword) == false) {
        alert("Passwords don't match");
        //return if passwords don't match
        return;
    }
    //check user input matches a valid login (from their unique link)
    user = await getUserID();
    //gets userID from above GET rquest
    userID = user['userID'];
    //hash new password
    hashedPassword = await hashPass(password);
    //store new password in DB
    resetUserPassInDB(userID, hashedPassword);
}

//function to reset users password in DB after all checks are complete
function resetUserPassInDB(inputID, inputPassHash) {
    const xhr = new XMLHttpRequest();
    //use encodeURIComponent to make sure all special characters are still included in hash
    var uriPassHash = encodeURIComponent(inputPassHash)
    request = '/userDB/updateUser?id=' + inputID + '&password_hash=' + uriPassHash
    //send xhr request
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            //move user to confirm their password has been reset
            window.location.replace("/login/password-reset-complete");
        }
    };
    xhr.send();
}

function getUrlLinkID() {
    // Address of the current window 
    thisUrl = window.location.search
    parameterList = new URLSearchParams(thisUrl)
    // Returning the value from 'linkID'
    return parameterList.get("linkID")
}

//async to make sure this function waits for fetch results
//gets userID by using the token in the url parameter
async function getUserID() {
    // Gets the value associated with the key "linkID" 
    token = getUrlLinkID();
    //sends POST request to getToken function in login views
    return await fetch('/login/getToken?linkID=' + token, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        //once a response, check there's no errors
        .then(response => {
            if (response.ok == false) {
                alert("error getting response");
            }
            //send response to function below 
            return response.json();
        })
        .then(data => {
            //return data from fetch 
            return data;
        })
        //catch any errors
        .catch(error => {
            alert("server side error: " + error);
        });
}
//check value sent in isn't empty
function checkIfEmpty(value) {
    return (value == null || value == "");
}

//check both passwords user enters match each other 
function checkPasswordMatch(p1, p2) {
    if (p1 == p2) {
        return true
    }
    else {
        return false
    }
}

//use async to ensure function waits for fetch to return a value
//function to hash user password
async function hashPass(inputPassword) {
    //send POST request
    return await fetch('/login/hash', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //send users input password in body
        body: JSON.stringify({ 'password': inputPassword })
    })
        .then(response => {
            if (response.ok == false) {
                alert("error getting response");
            }
            return response.json();
        })
        .then(data => {
            //return hashed password back to function
            return data.hashedPassword;
        })
        .catch(error => {
            alert("Server side error: " + error);
        });
}


