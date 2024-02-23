a = document.getElementById("username");
b = document.getElementById("passwd");

function submitLogin() {
    if (checkIfEmpty(a) || checkIfEmpty(b)) {
        alert("Please fill in all fields");
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:8000/userDB/getUserByName?name=' + a.value, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
        }
    };
}

function checkIfEmpty(value) {
    return (value == "");
}