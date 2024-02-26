
function submitLogin() {

    username = (document.getElementById("username").value).trim();
    password = (document.getElementById("passwd").value).trim();

    if (checkIfEmpty(username) || checkIfEmpty(password)) {
        alert("Please fill in all fields");
        return;
    }

    checkValidLogin(username);

    setCookie("username", username, 1);
    // Save password in cookie
    setCookie("password", password, 1);
    //alert("cookie is " + getCookie("username"));


}

function checkIfEmpty(value) {
    return (value == null || value == '');
}

function checkValidLogin(inputUsername, inputPasswd) {

    const xhr = new XMLHttpRequest();
    request = 'http://127.0.0.1:8000/userDB/getUserByName?name=' + username;
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            //alert(response);
            const stringResponse = xhr.responseText;
            const dbUsername = response.name;

            //check username and password matches ones in DB
            if (dbUsername == inputUsername) {
                alert("they match!!!");
            }
            //doesn't match any details in system
            else {
                alert("they don't");
            }

        }
    };
    xhr.send();





    //get username and password from db
    //check they match
}


