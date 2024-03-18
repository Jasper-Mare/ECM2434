
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