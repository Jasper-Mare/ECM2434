
userID = getCookie("login"); // get the userID from the cookie
if (userID == undefined || userID == "") { // if they are not logged in redirect them to the login page
    alert("Please login");
    document.cookie = "login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;" // set it to an expired date so its deleted
    window.location.href = "/login/";
}

/*
//Function written by MF
document.addEventListener('DOMContentLoaded',function(){ //page loading event triggers function
    const xhr = new XMLHttpRequest(); //start http using ID retrieved from cookie
    request = '/userDB/getUserById?id='+String(userID)
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            //when json response comes from http request check access_level of user
            const access = response.access_level;
            //if user doesn't have authority hide button
            if(access == "USER"){
                document.getElementById("admin").classList.add("hidden");
            }
        }
    };
    //send request
    xhr.send();
})

function playmusic() {
// function to play Henry's music he created
    var funAudio;
    const container = document.getElementById("container");
    if (funAudio == undefined) {
        funAudio = document.createElement("audio");
        funAudio.src = "../static/henrys jam.mp3";
        funAudio.loop = true;
        funAudio.autoplay = true;
        funAudio.volume = 0.2;
        container.appendChild(funAudio);
    }
    funAudio.play();
}
*/
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

/*
function getLocation() {
// function to get current user position only once
    const x = document.getElementById("myButton");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
    }

   
function showPosition(position) {
// function to show what the user's curent position is by getting their latitude and longitude
    fetch("/contentDB/getNearbyLocations?gps_lat="+ position.coords.latitude + "&gps_long="+position.coords.longitude, {method: "GET"})
    .then((response) => response.json())
    .then((json) => {writeLocationToSite(json); console.log(json)})
}

//Function getLocation() & showPosition() gets code from: https://www.w3schools.com/html/html5_geolocation.asp

function writeLocationToSite(results){
    const x = document.getElementById("myButton");
    console.log(results);
    console.log(results.locations); 
    console.log(results.locations.length);
    // checks if user is near a location
    if (results && results.locations && results.locations.length > 0) {
        // sets constant for the location and quiz url the user is near
        const firstLocation = results.locations[0];
        const quizPageUrl = "/quiz/?id="+firstLocation.id; 

        // writes what location the user is near and the quiz page link, depending on the location
        x.innerHTML = "You are near: " + firstLocation.name + ". " +
                    "<a href='" + quizPageUrl + "'>Take the quiz!</a>";

        console.log("First location name:", firstLocation.name);
        
    // if the user isn't near a location then returns this    
    } else {
        x.innerHTML="No locations available or results is not defined.";
        console.log("No locations available or results is not defined.");
    }
}

function logOut() {
    document.cookie = "login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;" // set it to an expired date so its deleted
    window.location.href = "/login/";
}