
async function submitRegisteration() {

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
    hashedPassword = await hashPassword(passwd);

    alert("hashed passwd is? " + hashedPassword);




    setUserInDB(username, email, hashedPassword);

}

function checkIfEmpty(value) {
    return (value == null || value == "");
}

function setUserInDB(inputUsername, inputEmail, inputPassHash) {

    const xhr = new XMLHttpRequest();
    var uriPasshash = encodeURI(inputPassHash)
    request = '/userDB/createUser?name=' + inputUsername
        + '&password_hash=' + uriPassHash
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

    };
    xhr.send();


}

// need to wait for request to come back 
async function hashPassword(inputPassword) {
    let received = false;
    let hashedPW = "preSet";
    return await fetch('/login/hash', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'password': inputPassword })

    })
        .then(response => {
            if (response.ok == false) {
                alert("error getting response");
            }
            return response.json();


        })
        .then(data => {

            return data.hashedPassword;
        })
        .catch(error => {
            alert("Error hashing password:", error);
            hashedPW = "";

        });


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