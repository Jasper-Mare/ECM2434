
function submitRegisteration() {

    username = (document.getElementById("username").value).trim();
    email = (document.getElementById("email").value).trim();
    passwd = (document.getElementById("passwd").value).trim();
    rpasswd = (document.getElementById("rptpasswd").value).trim();


    if (checkIfEmpty(username) || checkIfEmpty(email) || checkIfEmpty(passwd) || checkIfEmpty(rpasswd)) {
        alert("Please fill in all fields");
        return;
    }

    checkIfUser(username);
    checkPasswordMatch(passwd, rpasswd);

    //hash password
    hashedPassword = hashPassword(passwd);
    alert("hashed passwd is? " + hashedPassword);

    setUserInDB(username, email, hashedPassword);

}

function checkIfEmpty(value) {
    return (value == null || value == "");
}

function setUserInDB(inputUsername, inputEmail, inputPassHash) {

    const xhr = new XMLHttpRequest();
    request = '/userDB/createUser?name=' + inputUsername
        + '&password_hash=' + inputPassHash
        + '&access_level=USER&recovery_email=' + inputEmail;
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);



            setCookie("login", response.id, 1);
            window.location.replace("../../map/");
            alert("after relocation");

        }
        else {
            alert("didn't work");
        }
    };
    xhr.send();


}

// need to wait for request to come back 
function hashPassword(inputPassword) {
    let received = false;
    let hashedPW = "preSet";
    fetch('hash/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'password': inputPassword })

    })
        .then(response => {
            received = true;
            alert("is it hashed?");

        })
        .catch(error => {
            alert("there was an error");
            received = true;
            hashedPW = "";
            // error checking/messages
        });
    /*
        while (received == false) {
            continue;
        }
        */


}


function checkIfUser(inputUsername) {

    const xhr = new XMLHttpRequest();
    request = '/userDB/getUserByName?name=' + username;
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);

            const stringResponse = xhr.responseText;
            const dbUsername = response.name;

            //check username and password matches ones in DB
            if (dbUsername == inputUsername) {// && dbPassHash == inputPassHash) {
                alert("There's already an account with this username. Please login, or register with a different username");
            }
            //doesn't match any details in system
            else {
                alert("Congrats, you can register with this username ");
                setCookie("login", response.id, 1);
            }

        }
    };
    xhr.send();
}


function checkPasswordMatch(p1, p2) {
    if (p1 == p2) {
        alert("they match!")
        return true
    }
    else {
        alert("they don't match!")
        return false
    }
}