uname = document.getElementById("username");
email = document.getElementById("email");
passwd = document.getElementById("passwd");
rpasswd = document.getElementById("rptpasswd");

function submitRegisteration() {

    alert("you submitted the form");

    alert("the email is: " + email.value);
    alert(rpasswd);

    //alert(checkPasswordMatch(passwd.value, rpasswd.value));
    /*
    if (checkIfEmpty(a) || checkIfEmpty(b)) {
        alert("Please fill in all fields");
        return;
    }
    alert("before")
    */

}

function checkIfEmpty(value) {
    return (value == "");
}

function checkPasswordMatch(p1, p2) {
    if (p1 == p2) {
        return true
    }
    else {
        return false
    }
}