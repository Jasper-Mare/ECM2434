
async function submitLogin() {

    username = (document.getElementById("username").value).trim();
    password = (document.getElementById("passwd").value).trim();

    if (checkIfEmpty(username) || checkIfEmpty(password)) {
        alert("Please fill in all fields");
        return;
    }

    alert("username is " + username);
    validData = await checkValidLogin(password, username);
    alert("yujbk " + validData.validLogin);

    if (validData.validLogin == true) {
        setCookie("login", validData.userId, 1);
        window.location.replace("../../map/");
    }
    else {
        alert(validData.error)
        alert("Username and password don't match any user on our system: Try again, or register");
    }


    //move to map page

    //if data isn't valid
    //alert("Username and password don't match any user on our system: Try again, or register");

}



function checkIfEmpty(value) {
    return (value == null || value == '');
}


/*
function checkValidLogin(inputUsername, inputPassHash) {

    const xhr = new XMLHttpRequest();
    request = '/userDB/getUserByName?name=' + username;
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);

            const stringResponse = xhr.responseText;
            const dbUsername = response.name;
            const dbPassHash = response.password_hash;
            alert(stringResponse);

            alert(dbPassHash + "compared to " + inputPassHash);


            //check username and password matches ones in DB
            if (dbUsername == inputUsername && dbPassHash == inputPassHash) {
                alert("they match!!!");

                setCookie("login", response.id, 1);
                window.location.replace("../../map/");
                //move to map page
            }
            //doesn't match any details in system
            else {
                alert("Username and password don't match any user on our system: Try again, or register");
                //refresh login page
            }

        }
    };
    xhr.send();

    //get username and password from db
    //check they match
}
*/

async function checkValidLogin(inputPassword, inputUsername) {

    return await fetch('/login/passCheck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'password': inputPassword, 'username': inputUsername })

    })
        .then(response => {
            if (response.ok == false) {
                alert("error getting response");
            }
            return response.json();


        })
        .then(data => {

            return data;
        })
        .catch(error => {
            alert("Error hashing password:", error);
            hashedPW = "";

        });


}


