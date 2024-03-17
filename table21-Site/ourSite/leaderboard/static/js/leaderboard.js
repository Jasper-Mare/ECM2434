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
        let found = false;
        for (let user of response["users"]) { // go through all the users and list their score
            count ++;
            addRow(table, count, user["name"], user["score"]); // add a row of the details of the user
            if(userID == user["id"]){
                addRow(youTable, count, "YOU", user["score"]);
                found = true;
            }
        }
        if(found == false){
            const xml = new XMLHttpRequest();
            xml.open('GET', '/userDB/getUserById?id='+String(userID), true);
            xml.onreadystatechange = function() {
                if (xml.readyState === 4 && xml.status === 200) {
                    const response = JSON.parse(xml.responseText);
                    addRow(youTable, "-", "YOU", response.score);
                }
            };
            xml.send(); 
        }
    } 
};
xhr.send();

// function to add the details of the user as a row in the leaderboard
function addRow(chart, position, name, score) {
    const newRow = chart.insertRow();
    newRow.insertCell().appendChild(document.createTextNode(position));
    newRow.insertCell().appendChild(document.createTextNode(name));
    newRow.insertCell().appendChild(document.createTextNode(score));
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