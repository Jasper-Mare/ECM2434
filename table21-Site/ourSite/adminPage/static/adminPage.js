function display(){
    element = document.getElementById("display");
    element.classList.remove("hidden");
}

function finduser(){
    username = (document.getElementById("username").value).trim();
    userResponse = document.getElementById("results");
    userResponse.innerHTML= "";
    const xhr = new XMLHttpRequest();
    request = '/userDB/getUserByName?name=' + username;
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            const entry = response.name;
            const access = response.access_level;
            if(entry !== username){
                userResponse.innerHTML = "User Not Found";
            }
            else{
                userResponse.innerHTML = entry
                if(access == "USER"){
                    userResponse.innerHTML += "<button onclick = 'clearance(1)'>Promote</button>";
                }
                else if(access == "GAME_KEEPER"){
                    userResponse.innerHTML += "<button onclick = 'clearance(2)'>Demote</button>";
                }
                userResponse.innerHTML += "<button onclick = 'clearance(3)'>Remove</button>";
            }
            
        }
    };
    xhr.send();
}

function clearance(access){
    username = (document.getElementById("username").value).trim();
    const xhr = new XMLHttpRequest();
    request = '/userDB/getUserByName?name=' + username;
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            id = response.id;
            if(access == 1){
                const xml = new XMLHttpRequest();
                request = '/userDB/updateUser?id='+id+'&access_level=GAME_KEEPER';
                xml.open('GET', request, true);
                xml.send();
            }
            if(access == 2){
                const xml = new XMLHttpRequest();
                request = '/userDB/updateUser?id='+id+'&access_level=USER';
                xml.open('GET', request, true);
                xml.send();
            }
            else{
                const xml = new XMLHttpRequest();
                request = '/userDB/deleteUser?id='+id;
                xml.open('GET', request, true);
                xml.send();
            }
           
        }
    };
    xhr.send();
}



