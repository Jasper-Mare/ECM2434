//code written by Hannah Jellett

async function sendPasswordEmail() {
    //alert("we will send you an email!");
    //save all user input fields
    //trim all the values to remove any whitespaces
    email = (document.getElementById("email").value).trim();

    //checks email exists in system
    //checkEmail = await checkEmailExists(email);

    //check field isn't empty
    if (checkIfEmpty(email)) {
        //show error message on screen to user
        //document.getElementById("loginErrorMessage").classList.remove("hidden");
        //document.getElementById("loginErrorMessage").innerHTML = "Please fill in all fields!";
        alert("Please fill in all fields!")
        return;
    }

    if (await checkEmailExists(email) == false) {
        //show error message on screen to user
        message = "This email isn't registered on our system. Please enter the email you used to register:";
        //document.getElementById("loginErrorMessage").classList.remove("hidden");
        //document.getElementById("loginErrorMessage").innerHTML = message;
        alert(message);
        return;
    }
    else {

        //window.location.replace("/password_reset_done/");
        //alert("uibiub");
        alert("beforeeeee");
        //checkSendEmail = await sendEmailRequest(email);

        if (await sendEmailRequest(email) == true) {
            alert("the email was senttt")
            window.location.replace("https://www.w3schools.com/");
        }
        //i need to get this to do proper checks!!
        else {
            window.location.replace("https://www.w3schools.com/");
            alert("hiegner")

        }
        //alert("check is " + checkSendEmail.sendEmail);
        /*
        if (checkSendEmail.sendEmail == True) {
            window.location.replace("https://www.w3schools.com/");
            //window.location.replace("/password_reset_done/");
        }
        */
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
        //sends user input of password and username as the body of request
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
            return true;

            /*
            if (data.includes("Email sent successfully!"))
                return True;
            else {
                return False
            }
            */
            //alert("ifjeijgoerjge");
            //return data from fetch 
            //return data;
        })
        //catch any errors
        .catch(error => {
            //alert(data)
            alert("server side error: " + error);
        });

}

/*
//check email exists in the DB
async function checkEmailExists(inputEmail) {
    //sends POST request to passCheck function in login views
    return await fetch('/login/emailCheck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //sends user input of password and username as the body of request
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
            //return data from fetch 
            return data;
        })
        //catch any errors
        .catch(error => {
            alert("server side error: ", error);
        });
 
}
*/



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
            //true if they're already a user, else false
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

function checkIfEmpty(value) {
    return (value == null || value == "");
}

