
function submitRegisteration() {

    username = (document.getElementById("username").value).trim();
    email = (document.getElementById("email").value).trim();
    passwd = (document.getElementById("passwd").value).trim();
    rpasswd = (document.getElementById("rptpasswd").value).trim();


    if (checkIfEmpty(username) || checkIfEmpty(email) || checkIfEmpty(passwd) || checkIfEmpty(rpasswd)) {
        alert("Please fill in all fields");
        return;
    }

    checkPasswordMatch(passwd, rpasswd);

    setCookie("username", username, 1);
    setCookie("email", email, 1);

    alert("cookie is " + getCookie("username"));
    alert("cookie is " + getCookie("email"));


}

function checkIfEmpty(value) {
    return (value == null || value == "");
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