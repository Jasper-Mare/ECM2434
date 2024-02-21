function submitLogin() {
    a = document.getElementById("username");
    b = document.getElementById("passwd");
    checkIfEmpty(a);
    checkIfEmpty(b);
    alert(a.value);
    alert(b.value);
}


function checkIfEmpty(value) {
    if (!value) {
        alert("is empty!");
    }
    else {
        alert("not empty");
    }

}