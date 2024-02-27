// get the table to be added to
const table = document.getElementById('table');

// request the top 50 players ranked by their score
const xhr = new XMLHttpRequest();
xhr.open('GET', '/userDB/getUsersByScore?number_of_players=50', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);

        count = 0
        for (user of response["users"]) { // go through all the users and list their score
            count ++;
            addrow(count, user["name"], user["score"]); // add a row of the details of the user
        }
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