const xhr = new XMLHttpRequest();
const table = document.getElementById('table');

xhr.open('GET', '/userDB/getUsersByScore?number_of_players=50', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);

        count = 0
        for (user of response["users"]) {
            count ++;
            addrow(count, user["name"], user["score"]);
        }
    }
};
xhr.send();

function addrow(email, name, score) {
   const newRow = table.insertRow();
   const emailCell = newRow.insertCell();
   const nameCell = newRow.insertCell();
   const scoreCell = newRow.insertCell();

   emailCell.innerHTML = email;
   nameCell.innerHTML = name;
   scoreCell.innerHTML = score;
}