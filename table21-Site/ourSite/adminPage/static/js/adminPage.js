//Written by MF
function getData(){
    const xhr = new XMLHttpRequest();
    // retrieve current username
    request = '/userDB/getUserByName?name=' + username;
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            
        }
    }
    xhr.send();
}

// get searched user
function findUser(){
    //get necessary document elements such as username and entry
    const username = (document.getElementById("username").value).trim();
    const userOption = document.getElementById("results");
    const table = document.getElementById("database").getElementsByTagName('tbody')[0];
    //reset display html
    userOption.innerHTML= "";
    table.innerHTML= "";
    //start a httpRequest to retrieve a valid user
    const xhr = new XMLHttpRequest();
    const request = '/userDB/getUserByName?name=' + username;
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //with json response ...
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            //store name and access level from json
            const entry = response.name;
            const access = response.access_level;
            let button = null;
            //if json has undefined return or couldn't find anything print statement
            if(entry !== username){
                userOption.innerHTML = `<div class="alert py-1 alert-danger alert-dismissible fade show" role="alert">User Not Found 
                                        <button type="button" class="btn-close py-2" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>`;
            }
            //https://toruskit.com/docs/components/alerts/
            else{
                //depending upon current access_level change buttons to either promote or demote
                if(access == "USER"){
                    button = `<button class='btn btn-primary btn-sm' type='button' onclick = 'clearance(1)'>Promote</button>`;
                }
                else if(access == "GAME_KEEPER"){
                    button = `<button class='btn btn-primary btn-sm' type='button' onclick = 'clearance(2)'>Demote</button>`;
                }
                //option to remove user from database
                var newRow = table.insertRow();
                newRow.insertCell().appendChild(document.createTextNode(response.id));
                newRow.insertCell().appendChild(document.createTextNode(entry));
                newRow.insertCell().appendChild(document.createTextNode(response.recovery_email));
                newRow.insertCell().appendChild(document.createTextNode(access));
                var cell_5 = newRow.insertCell();      
                cell_5.innerHTML = button + `<button class='btn btn-danger btn-sm' type='button' onclick = 'clearance(3)'>Remove</button>`;
            }
        }
    };
    //send request
    xhr.send();
}

//function for buttons
//main process for all buttons is the same only need to change type of request hence "access" parameter
function clearance(access){
    //start http request
    const username = (document.getElementById("username").value).trim();
    const xhr = new XMLHttpRequest();
    // retrieve current username
    const request = '/userDB/getUserByName?name=' + username;
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            // get id from json response
            const id = response.id;
            // depending on which button is pressed
            if(access == 1){
                alert("User " + username + " has been promoted to Game Keeper!");
                //promote user to admin through new request
                const xml = new XMLHttpRequest();
                const request = '/userDB/updateUser?id='+id+'&access_level=GAME_KEEPER';
                xml.open('GET', request, true);
                xml.send();
            } else if(access == 2){
                alert("User " + username + " has been demoted to User!");
                //demote admin to user through new request
                const xml = new XMLHttpRequest();
                const request = '/userDB/updateUser?id='+id+'&access_level=USER';
                xml.open('GET', request, true);
                xml.send();
            } else{
                alert("User " + username + " has been deleted!");
                //delete user from database through new request
                const xml = new XMLHttpRequest();
                const request = '/userDB/deleteUser?id='+id;
                xml.open('GET', request, true);
                xml.send();
            }
           
        }
    }
    // send original request for name
    xhr.send();
    //findUser()
}



function getLocation() {
    const x = document.getElementById("localized");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  
  function showPosition(position) {
    const x = document.getElementById("localized");
    x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
  }

//Function getLocation() & showPosition() gets code from: https://www.w3schools.com/html/html5_geolocation.asp