//written by Hannah Jellett

async function saveNewPass() {

    //gets values input by user in both text fields
    //trim both values to remove any whitespaces
    password = (document.getElementById("password").value).trim();
    repeatPassword = (document.getElementById("repeatPassword").value).trim();

    //ensure no fields are left empty
    if (checkIfEmpty(username) || checkIfEmpty(repeatPassword)) {
        document.getElementById("loginErrorMessage").classList.remove("hidden");
        document.getElementById("loginErrorMessage").innerHTML = "Please fill in all fields!";
        //alert("Please fill in all fields");
        //leave function if a field is empty
        return;
    }

    //check passwords entered match
    if (checkPasswordMatch(passwd, rpasswd) == false) {
        document.getElementById("loginErrorMessage").classList.remove("hidden");
        document.getElementById("loginErrorMessage").innerHTML = "Passwords don't match";
        //("Passwords don't match");
        //return if passwords don't match
        return;
    }

    //check user input matches a valid login
    user = await getUserID();

    //hash password
    hashedPassword = await hashPassword(passwd);

    user.userID
    //store new password in DB
    resetUserPassInDB(user.userID, hashedPassword)

}


//function to reset users password in DB after all checks are complete
function resetUserPassInDB(inputID, inputPassHash) {

    const xhr = new XMLHttpRequest();
    //use encodeURIComponent to make sure all special characters are still included in hash
    var uriPassHash = encodeURIComponent(inputPassHash)
    request = '/userDB/updateUser?id=' + inputID
        + '&password_hash=' + uriPassHash;

    //send xhr request
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);

            //set cookie 'login' with userId
            setCookie("login", inputID, 1);
            //move user to map game page
            window.location.replace("/password_reset_complete/");
        }

    };
    xhr.send();


}

//async to make sure this function waits for fetch results
async function getUserID() {

    //sends POST request to passCheck function in login views
    return await fetch('/login/getToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //sends user input of password and username as the body of request
        //body: JSON.stringify({ 'email': email })

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
            alert("server side error: ", error);
        });

}


