//Written by MF

function display(){ //function to get display element and remove hidden class tag to be visible
    element = document.getElementById("display");
    element.classList.remove("hidden");
}

function display2(){ //function to get display element and remove hidden class tag to be visible
    element = document.getElementById("locDisplay");
    element.classList.remove("hidden");
    getLocation()
}

function findUser(){
    //get necessary document elements such as username and entry
    username = (document.getElementById("username").value).trim();
    userOption = document.getElementById("results");
    //reset display html
    userOption.innerHTML= "";
    //start a httpRequest to retrieve a valid user
    const xhr = new XMLHttpRequest();
    request = '/userDB/getUserByName?name=' + username;
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //with json response ...
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            //store name and access level from json
            const entry = response.name;
            const access = response.access_level;
            //if json has undefined return or couldn't find anything print statement
            if(entry !== username){
                userOption.innerHTML = "User Not Found";
            }
            else{
                //if found return name of user requested
                userOption.innerHTML = entry;
                //depending upon current access_level change buttons to either promote or demote
                if(access == "USER"){
                    userOption.innerHTML += "<button type='button' class ='action' onclick = 'clearance(1)'>Promote</button>";
                }
                else if(access == "GAME_KEEPER"){
                    userOption.innerHTML += "<button type='button' class ='action' onclick = 'clearance(2)'>Demote</button>";
                }
                //option to remove user from database
                userOption.innerHTML += "<button type='button' class ='action' onclick = 'clearance(3)'>Remove</button>";
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
    username = (document.getElementById("username").value).trim();
    const xhr = new XMLHttpRequest();
    // retrieve current username
    request = '/userDB/getUserByName?name=' + username;
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            // get id from json response
            id = response.id;
            // depending on which button is pressed
            if(access == 1){
                alert("User " + username + " has been promoted to Game Keeper!");
                //promote user to admin through new request
                const xml = new XMLHttpRequest();
                request = '/userDB/updateUser?id='+id+'&access_level=GAME_KEEPER';
                xml.open('GET', request, true);
                xml.send();
            } else if(access == 2){
                alert("User " + username + " has been demoted to User!");
                //demote admin to user through new request
                const xml = new XMLHttpRequest();
                request = '/userDB/updateUser?id='+id+'&access_level=USER';
                xml.open('GET', request, true);
                xml.send();
            } else{
                alert("User " + username + " has been deleted!");
                //delete user from database through new request
                const xml = new XMLHttpRequest();
                request = '/userDB/deleteUser?id='+id;
                xml.open('GET', request, true);
                xml.send();
            }
           
        }
    };
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