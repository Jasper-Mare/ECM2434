//code written by Hannah Jellett
//Jasper Mare helped with hashing passwords

//function runs when submit button is clicked
async function submitLogin() {

    //gets values input by user in both text fields
    //trim both values to remove any whitespaces
    username = (document.getElementById("username").value).trim();
    password = (document.getElementById("passwd").value).trim();

    //ensure no fields are left empty
    if (checkIfEmpty(username) || checkIfEmpty(password)) {
        document.getElementById("loginErrorMessage").classList.remove("hidden");
        document.getElementById("loginErrorMessage").innerHTML = "Please fill in all fields!";
        //alert("Please fill in all fields");
        //leave function if a field is empty
        return;
    }

    //check user input matches a valid login
    validData = await checkValidLogin(password, username);

    // if login is valid, set user cookie and move to map game page
    if (validData.validLogin == true) {
        setCookie("login", validData.userId, 1);
        window.location.replace("../../map/");
    }
    else {
        //let user know that one/both of their fields don't match the DB
        document.getElementById("loginErrorMessage").classList.remove("hidden");
        error = "Username and password don't match any user on our system: <br>Try again, or register";
        document.getElementById("loginErrorMessage").innerHTML = error;
        //alert("Username and password don't match any user on our system: Try again, or register");
    }


}



function checkIfEmpty(value) {
    //check values aren't null or an empty string
    return (value == null || value == '');
}


//check user login attempt is valid
//async to make sure thie function waits for fetch results
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


