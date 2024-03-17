//code written by Hannah Jellett
//Jasper Mare helped with hashing passwords

//function called when user presses submit button
async function submitRegisteration() {

    //save all user input fields
    //trim all the values to remove any whitespaces
    username = (document.getElementById("username").value).trim();
    email = (document.getElementById("email").value).trim();
    passwd = (document.getElementById("passwd").value).trim();
    rpasswd = (document.getElementById("rptpasswd").value).trim();

    //check no fields are empty
    if (checkIfEmpty(username) || checkIfEmpty(email) || checkIfEmpty(passwd) || checkIfEmpty(rpasswd)) {
        //show error message on screen to user
        document.getElementById("loginErrorMessage").classList.remove("hidden");
        document.getElementById("loginErrorMessage").innerHTML = "Please fill in all fields!";
        return;
    }

    //check if user or email already exists
    if (await checkIfUser(username) == true || await checkIfEmailExists(email) == true) {
        message = "There's already an account with this username or email.<br> Please login, or register with a different username/email";
        document.getElementById("loginErrorMessage").classList.remove("hidden");
        document.getElementById("loginErrorMessage").innerHTML = message;

        //if user exists, exit from the function
        return;
    }

    //check both password and repeatPassword match
    //extra security to ensure user types in the same password both times
    if (checkPasswordMatch(passwd, rpasswd) == false) {
        document.getElementById("loginErrorMessage").classList.remove("hidden");
        document.getElementById("loginErrorMessage").innerHTML = "Passwords don't match";
        //("Passwords don't match");
        //return if passwords don't match
        return;
    }

    //check if email is a valid format
    if (checkValidEmail(email) == false) {
        message = "The email is invalid! Please enter a valid email";
        document.getElementById("loginErrorMessage").classList.remove("hidden");
        document.getElementById("loginErrorMessage").innerHTML = message;
        return;
    }


    //hash password
    hashedPassword = await hashPassword(passwd);

    //once done all checks, set up user in DB
    setUserInDB(username, email, hashedPassword);

}

//ensure no fields are empty or null
function checkIfEmpty(value) {
    return (value == null || value == "");
}


//function to set up new user in DB after all checks are complete
function setUserInDB(inputUsername, inputEmail, inputPassHash) {

    const xhr = new XMLHttpRequest();
    //use encodeURIComponent to make sure all special characters are still included in hash
    var uriPassHash = encodeURIComponent(inputPassHash)
    request = '/userDB/createUser?name=' + inputUsername
        + '&password_hash=' + uriPassHash
        + '&access_level=USER&recovery_email=' + inputEmail;

    //send xhr request
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);

            //set cookie 'login' with userId
            setCookie("login", response.id, 1);
            //move user to map game page
            window.location.replace("/map/");
        }

    };
    xhr.send();


}

//use async to ensure function waits for fetch to return a value
async function hashPassword(inputPassword) {

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
            alert("Server side error: ", error);

        });


}

//async so function waits for fetch response
//function checks if user trying to register is already a user on the system
async function checkIfUser(inputUsername) {
    request = '/userDB/getUserByName?name=' + inputUsername;

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

async function checkIfEmailExists(inputEmail) {
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

//check both passwords user enters match each other 
function checkPasswordMatch(p1, p2) {
    if (p1 == p2) {
        return true
    }
    else {
        return false
    }
}

//code from: 
//https://www.geeksforgeeks.org/javascript-program-to-validate-an-email-address/
//check email is in a valid format and not just a string of chars
function checkValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailPattern.test(email);
    return isValid;
}