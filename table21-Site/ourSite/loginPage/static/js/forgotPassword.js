//code written by Hannah Jellett

async function sendPasswordEmail() {
    //alert("we will send you an email!");
    //save all user input fields
    //trim all the values to remove any whitespaces
    email = (document.getElementById("email").value).trim();

    //check field isn't empty
    if (checkIfEmpty(email)) {
        //show error message on screen to user
        document.getElementById("loginErrorMessage").classList.remove("hidden");
        document.getElementById("loginErrorMessage").innerHTML = "Please fill in all fields!";
        return;
    }
    else {
        //window.location.replace("/password_reset_done/");
        //alert("uibiub");
        alert("beforeeeee");
        checkSendEmail = await sendEmailRequest(email);
        alert("afterrr " + checkSendEmail + " bubub");

        //alert("check is " + checkSendEmail.sendEmail);
        if (checkSendEmail.sendEmail == True) {
            window.location.replace("https://www.w3schools.com/");
            //window.location.replace("/password_reset_done/");
        }

    }

    //checks email exists in system
    /*
    checkEmail = await checkEmailExists(email);
    if (checkEmail.validEmail == false) {
        //show error message on screen to user
        message = "This email isn't registered on our system<br>Please enter the email you used to register:";
        document.getElementById("loginErrorMessage").classList.remove("hidden");
        document.getElementById("loginErrorMessage").innerHTML = message;
        return;
    }
    */

    //alert(checkEmail.validEmail);
    //send user an email
}


//sends email to user
async function sendEmailRequest() {
    //sends POST request to sendEmail function in login views
    return await fetch('/login/sendEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //sends user input of password and username as the body of request
        body: JSON.stringify({ 'email': email })

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


//check email exists in the DB
async function checkEmailExists() {
    //sends POST request to passCheck function in login views
    return await fetch('/login/emailCheck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //sends user input of password and username as the body of request
        body: JSON.stringify({ 'email': email })

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
