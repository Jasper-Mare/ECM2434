//Written by MF
function display(){ //function to get display element and remove hidden class tag to be visible
    element = document.getElementById("display");
    element.classList.remove("hidden");
}

function finduser(){
    //get necessary document elements such as username and entry
    username = (document.getElementById("username").value).trim();
    userResponse = document.getElementById("results");
    //reset display html
    userResponse.innerHTML= "";
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
                userResponse.innerHTML = "User Not Found";
            }
            else{
                //if found return name of user requested
                userResponse.innerHTML = entry
                //depending upon current access_level change buttons to either promote or demote
                if(access == "USER"){
                    userResponse.innerHTML += "<button onclick = 'clearance(1)'>Promote</button>";
                }
                else if(access == "GAME_KEEPER"){
                    userResponse.innerHTML += "<button onclick = 'clearance(2)'>Demote</button>";
                }
                //option to remove user from database
                userResponse.innerHTML += "<button onclick = 'clearance(3)'>Remove</button>";
            }
        }
    };
    //send request
    xhr.send();
}

//function for buttons
//main process for all buttons is the same only need to change type of request hence "access" parametre
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
                //promote user to admin through new request
                const xml = new XMLHttpRequest();
                request = '/userDB/updateUser?id='+id+'&access_level=GAME_KEEPER';
                xml.open('GET', request, true);
                xml.send();
            }
            if(access == 2){
                //demote admin to user through new request
                const xml = new XMLHttpRequest();
                request = '/userDB/updateUser?id='+id+'&access_level=USER';
                xml.open('GET', request, true);
                xml.send();
            }
            else{
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
}



