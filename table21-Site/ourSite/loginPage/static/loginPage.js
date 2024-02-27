//function run 
async function submitLogin() {

    username = (document.getElementById("username").value).trim();
    password = (document.getElementById("passwd").value).trim();

    if (checkIfEmpty(username) || checkIfEmpty(password)) {
        alert("Please fill in all fields");
        return;
    }

    validData = await checkValidLogin(password, username);

    if (validData.validLogin == true) {
        setCookie("login", validData.userId, 1);
        window.location.replace("../../map/");
    }
    else {
        alert("Username and password don't match any user on our system: Try again, or register");
    }


}



function checkIfEmpty(value) {
    return (value == null || value == '');
}


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
            alert("server side error: ", error);
            hashedPW = "";

        });


}


