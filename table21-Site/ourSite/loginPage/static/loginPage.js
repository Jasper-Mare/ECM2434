
function submitLogin() {

    username = (document.getElementById("username").value).trim();
    password = (document.getElementById("passwd").value).trim();

    if (checkIfEmpty(username) || checkIfEmpty(password)) {
        alert("Please fill in all fields");
        return;
    }

    //hash password
    hashedPassword = password

    checkValidLogin(username, hashedPassword);

}

function checkIfEmpty(value) {
    return (value == null || value == '');
}

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
            if (dbUsername == inputUsername) {// && dbPassHash == inputPassHash) {
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


