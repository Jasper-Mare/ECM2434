//code written by Hannah Jellett

async function sendPasswordEmail() {
    //save all user input fields
    //trim all the values to remove any whitespaces
    email = (document.getElementById("email").value).trim();

    //check field isn't empty
    if (checkIfEmpty(email)) {
        //show error message on screen to user
        alert("Please fill in all fields!")
        return;
    }

    //checks email exists in system
    if (await checkEmailExists(email) == false) {
        //show error message on screen to user
        message = "This email isn't registered on our system. Please enter the email you used to register:";
        alert(message);
        return;
    }
    else {
        //send email request and if successful, send user to next page
        if (await sendEmailRequest(email) == true) {
            window.location.replace("password-reset-done");
        }

    }
}


//sends email to user
async function sendEmailRequest(inputEmail) {
    //sends POST request to sendEmail function in login views
    return await fetch('/login/sendEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //sends user input of email as the body of request
        body: JSON.stringify({ 'email': inputEmail })

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
            //return true that the email has sent 
            return true;

        })
        //catch any errors
        .catch(error => {
            alert("server side error: " + error);
        });

}

//async to make sure this function waits for fetch results
//function to check input email exists in the DB
async function checkEmailExists(inputEmail) {
    request = '/userDB/getUserByEmail?recovery_email=' + inputEmail;

    //send GET request
    return await fetch(request, {
        method: 'GET'
    })
        .then(response => {
            if (response.ok == false) {
                alert("error getting response");
            }
            return response.json();

        })
        .then(data => {
            //sends back response to function 
            //true if they have an email in the system, else false
            return (data.error == undefined);
        })
        .catch(error => {
            alert("Server side error: ", error);
        });

}

//check user login attempt is valid
//async to make sure this function waits for fetch results
async function checkValidLogin(inputPassword, inputUsername) {

    //sends POST request to passCheck function in login views
    return await fetch('/login/passCheck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //sends user input of password and username as the body of request
        body: JSON.stringify({ 'password': inputPassword, 'username': inputUsername })

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
            hashedPW = "";

        });


}

//check value sent in isn't empty
function checkIfEmpty(value) {
    return (value == null || value == "");
}

