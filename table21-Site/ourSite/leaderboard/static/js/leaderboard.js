// written by Jacob
// get the table to be added to
const table = document.getElementById('table');
const youTable = document.getElementById('yourScore');

const userID = getCookie("login"); // get the userID from the cookie

// request the top 50 players ranked by their score
const xhr = new XMLHttpRequest();
xhr.open('GET', '/userDB/getUsersByScore?number_of_players=50', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        let count = 0
        for (let user of response["users"]) { // go through all the users and list their score
            count ++;
            addrow(count, user["name"], user["score"]); // add a row of the details of the user
        }
        const xml = new XMLHttpRequest();
        xml.open('GET', '/userDB/getUserById?id='+String(userID), true);
        xml.onreadystatechange = function() {
            if (xml.readyState === 4 && xml.status === 200) {
                const response = JSON.parse(xml.responseText);
                const person = response.name;
                var newRow = youTable.insertRow();
                newRow.insertCell().appendChild(document.createTextNode(count));
                newRow.insertCell().appendChild(document.createTextNode(response.name));
                newRow.insertCell().appendChild(document.createTextNode(response.score));
            }
        };
        xml.send();
    } 
};
xhr.send();

// function to add the details of the user as a row in the leaderboard
function addrow(email, name, score) {
    const newRow = table.insertRow();
    const emailCell = newRow.insertCell();
    const nameCell = newRow.insertCell();
    const scoreCell = newRow.insertCell();
 
    emailCell.innerHTML = email;
    nameCell.innerHTML = name;
    scoreCell.innerHTML = score;
 }

function getCookie(cname) {
    // function to get the cookie of a given name
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    //Function getCookie() gets code from: https://www.w3schools.com/js/js_cookies.asp