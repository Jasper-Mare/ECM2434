// writen by Jasper Mare

// ================================ Classes ================================ //

class GPScoord {
    constructor(lat,lon) {
        this.lat = lat;
        this.lon = lon;
        //console.log("GPSCoord: "+ this.lat +", "+ this.lon);
    }

    getNormalisedCoord(playerGPS, targetedLocation) {
        // correct scaling problem between lat and lon
        const squish = 1.7729;

        // calculate the distance between the player and the location
        const playerTargetDist = playerGPS.getDistance(targetedLocation);

        // only allow the map to zoom in till a certain point
        const viewDist = Math.max(playerTargetDist*(canvasAspectRatio+0.1), playerMinViewDist);

        // get the midpoint to centre the view
        const playerTargetMid = new GPScoord((playerGPS.lat + targetedLocation.lat)/2, (playerGPS.lon + targetedLocation.lon)/2);

        return new NormalisedCoord(
            mapRange(this.lon, playerTargetMid.lon-(viewDist/2)*squish, playerTargetMid.lon+(viewDist/2)*squish, -1, 1),
            mapRange(this.lat, playerTargetMid.lat-viewDist/2, playerTargetMid.lat+viewDist/2, -1, 1),
        );
    }

    getDistance(otherLocation) {
        const a = this.lat - otherLocation.lat;
        const b = this.lon - otherLocation.lon;
        // a² + b² = c²
        // c = √(a² + b²)
        return Math.sqrt(a*a + b*b);
    }
}

class NormalisedCoord {
    // in scale -1 to 1
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    getScreenCoord() {
        const wMarg = (canvasLongestSide - canvasW)*0.5;
        const hMarg = (canvasLongestSide - canvasH)*0.5;
        
        return new ScreenCoord(
            mapRange(this.x, -1, 1, 0, canvasLongestSide)-wMarg,
            mapRange(this.y, -1, 1, canvasLongestSide, 0)-hMarg
        );
    }
}

class ScreenCoord {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    isOnScreen() {
        return (0 < this.x && this.x < canvasW) && (0 < this.y && this.y < canvasH);
    }
}

class Location {
    constructor(id, name, lat, lon, info, radius) {
        this.id = id;
        this.gps = new GPScoord(lat, lon);
        this.name = name;
        this.info = info;
        this.radius = radius;
    }
}

// =========================== Utility Functions =========================== //

function mapRange(val, oldMin, oldMax, newMin, newMax) {
    return (val - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
}

// =========================== global variables ============================ //

var playerBGColour = '#F87666';
var playerFGColour = '#000000';
var locationColour = 'yellow';
var locationRadiusColour = '#ff000055'; // RR GG BB AA
var targetLocationColour = 'gold';

var canvasW = 0;
var canvasH = 0;
var canvasLongestSide = 0;
var canvasAspectRatio = 1;
var ctx;
var playerMinViewDist = 0.004;

var mapTLgps = new GPScoord(50.73846234658168, -3.5394728294843074);
var mapBRgps = new GPScoord(50.73221777159281, -3.5284015186800306);

var targetedLocationId;
fetch("/userDB/getUserTargetLocation?id="+userID, {method: "GET"})
.then((response) => response.json())
.then((json) => {
    targetedLocationId = json["location"];
    
    locationsWithId = locations.filter(loc => {return loc.id === targetedLocationId});
    if (locationsWithId.length == 0) {
        targetedPosition = playerLastPosition;
    } else {
        targetedPosition = locationsWithId[0].gps;
    }
})

var locations = [];
fetch("/contentDB/getAllLocations", {method: "GET"})
    .then((response) => response.json())
    .then((json) => {
        json["locations"].forEach(e => {
            locations.push(new Location(e["id"], e["name"], e["gps_lat"], e["gps_long"], e["info"], e["radius"]));
        });
        console.log(locations);
        checkIfAtLocation();
    })

var targetedPosition = new GPScoord((mapTLgps.lat + mapBRgps.lat)/2, (mapTLgps.lon + mapBRgps.lon)/2);
var playerLastPosition = targetedPosition;

var gpsError = false;

//console.log(mapTLgps.lat-mapBRgps.lat, mapTLgps.lon-mapBRgps.lon);

var mapImgLoaded = false;
const mapImg = new Image();
mapImg.onload = () => {
    mapImgLoaded = true;
};
mapImg.src = `/static/images/exeter-Map-Edited.png`;

// ============================= main functions ============================ //

function initialiseMap() {
    console.log("running init map");
    var c = document.getElementById("map");
    ctx = c.getContext("2d");
    
    resizeMap();

    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
    const gpsOptions = {
        enableHighAccuracy: true,
    }

    if (!navigator.geolocation) {
        // geolocation not supported
        gpsNotSupported();
    } else {
        // geolocation supported
        navigator.geolocation.watchPosition(geoSuccess, gpsNotSupported, gpsOptions);
    }
    
    // redraw the map every 100ms
    setInterval(refreshMap, 100);
}

function resizeMap() {
    // this code is just for now, remove once the map is in the website
    ctx.canvas.width  = window.innerWidth - 20;
    ctx.canvas.height = window.innerHeight - 25;

    canvasW = ctx.canvas.width;
    canvasH = ctx.canvas.height;
    canvasLongestSide = Math.max(canvasH, canvasW);
    // longest side divided by shortest side
    canvasAspectRatio = canvasLongestSide/Math.min(canvasH, canvasW);
}

async function geoSuccess(position) {
    //console.log(position);
    playerLastPosition = new GPScoord(position.coords.latitude, position.coords.longitude);

    locationsWithId = locations.filter(loc => {return loc.id === targetedLocationId});
    if (locationsWithId.length == 0) {
        targetedPosition = playerLastPosition;
    } else {
        targetedPosition = locationsWithId[0].gps;
    }

    gpsError = false;

    checkIfAtLocation();
}

async function geoError(onCampus = true) {
    if (!mapImgLoaded) {
        await mapImg.decode();
    }

    var maplocTL = new NormalisedCoord(-1,1).getScreenCoord();
    var maplocBR = new NormalisedCoord(1,-1).getScreenCoord();

    var mapWidth = maplocBR.x - maplocTL.x;
    var mapHeight = maplocBR.y - maplocTL.y;

    ctx.drawImage(mapImg, maplocTL.x, maplocTL.y, mapWidth, mapHeight);

    const text = onCampus ? "Location is not supported or something went wrong!" : "You are not on campus!";
    ctx.fillStyle = "white";
    ctx.fillRect(9,25, text.length * 15, 34);
    ctx.fillStyle = "black"
    ctx.font = "30px Arial";
    ctx.fillText(text, 10, 50);
    
}

async function refreshMap() {
    var onCampus = (mapBRgps.lat < playerLastPosition.lat && playerLastPosition.lat < mapTLgps.lat) 
             && (mapTLgps.lon < playerLastPosition.lon && playerLastPosition.lon < mapBRgps.lon);

    if (!onCampus || gpsError) {
        await geoError(gpsError);
    } else {
        await drawMap(playerLastPosition);
    }
}

async function drawMap(playerGPS) {
    console.log("draw map");
    
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.rect(0, 0, canvasW, canvasH);
    ctx.fillStyle = "#c4bcb1";
    ctx.fill();

    var maplocTL = mapTLgps.getNormalisedCoord(playerGPS, targetedPosition).getScreenCoord();
    var maplocBR = mapBRgps.getNormalisedCoord(playerGPS, targetedPosition).getScreenCoord();

    var mapWidth = maplocBR.x - maplocTL.x;
    var mapHeight = maplocBR.y - maplocTL.y;

    if (mapImgLoaded) {
        ctx.drawImage(mapImg, maplocTL.x, maplocTL.y, mapWidth, mapHeight);
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.rect(maplocTL.x, maplocTL.y, mapWidth, mapHeight);
        ctx.stroke();
    }

    locations.forEach(loc => {
        drawLocation(playerGPS, loc);
    });
    drawPlayer(playerGPS);

}

function drawPlayer(playerGPS) {
    var playerScreenCoord = playerGPS.getNormalisedCoord(playerGPS, targetedPosition).getScreenCoord();

    //console.log("draw player: ", playerScreenCoord);

    var playerIconRaduis = canvasLongestSide/80;
    var playerBGRadius = playerIconRaduis * 1.2;

    // player circle
    ctx.beginPath();
    ctx.fillStyle = playerBGColour;
    ctx.arc(playerScreenCoord.x, playerScreenCoord.y, playerBGRadius, 0, 2 * Math.PI);
    ctx.fill();

    // player icon
    var playerHeadRadius = playerIconRaduis/2.5;
    var playerBodyWidth = playerIconRaduis;
    var playerBodyHeight = playerIconRaduis/2;
    var playerNeckY = playerScreenCoord.y - canvasLongestSide/500;

    ctx.beginPath();
    ctx.fillStyle = playerFGColour;
    ctx.arc(playerScreenCoord.x, playerNeckY - playerHeadRadius+2, playerHeadRadius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(playerScreenCoord.x, playerNeckY+playerBodyWidth/2, playerBodyWidth/2, Math.PI, 0);
    ctx.fill();

    ctx.fillRect(playerScreenCoord.x-playerBodyWidth/2, playerNeckY+playerBodyWidth/2, playerBodyWidth, playerBodyHeight);

}

function drawLocation(playerGPS, location) {
    locationGPS = location.gps;
    var locationScreenCoord = locationGPS.getNormalisedCoord(playerGPS, targetedPosition).getScreenCoord();
    var isTargeted = (targetedLocationId === location.id);

    console.log("draw location: ", location.name, locationScreenCoord);

    const locationIconSize = Math.abs(
        new GPScoord(
            location.gps.lat + 0.00015, 
            location.gps.lon
        ).getNormalisedCoord(playerGPS, targetedPosition)
        .getScreenCoord()
        .y - locationScreenCoord.y
    );

    if (isTargeted) {
        // radius indicator
        // calculate the radius of the radius indicator
        var radius = Math.abs(
            new GPScoord(
                location.gps.lat, 
                location.gps.lon + location.radius
            ).getNormalisedCoord(playerGPS, targetedPosition)
            .getScreenCoord()
            .x - locationScreenCoord.x
        );

        ctx.beginPath();
        ctx.arc(locationScreenCoord.x, locationScreenCoord.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = locationRadiusColour;
        ctx.fill();
    }
                
    // location marker
    ctx.beginPath();
    ctx.arc(locationScreenCoord.x, locationScreenCoord.y, locationIconSize/2, 0, 2 * Math.PI);
    if (isTargeted) { 
        // is the targeted location
        ctx.fillStyle = targetLocationColour;
    } else {
        ctx.fillStyle = locationColour;
    }
    ctx.fill();
    
    if (isTargeted) {
        ctx.font = "12px Arial";
        
        const measuredText = ctx.measureText(location.name);
        const textOffY = locationIconSize/1.25 * (locationScreenCoord.y > canvasH/2 ? -1: 1);

        ctx.fillStyle = "white";
        ctx.fillRect(locationScreenCoord.x - measuredText.actualBoundingBoxRight*1.1/2, locationScreenCoord.y + textOffY + measuredText.actualBoundingBoxAscent*0.75, measuredText.actualBoundingBoxRight*1.1, -measuredText.actualBoundingBoxAscent*2.5);

        ctx.fillStyle = "black";
        ctx.fillText(location.name, locationScreenCoord.x - measuredText.actualBoundingBoxRight/2, locationScreenCoord.y + textOffY);

    }

}

function gpsNotSupported() {
    gpsError = true;
}

function checkIfAtLocation() {
    // get the locations close enough
    var targetLocationIfInRangeArray = locations.filter(loc => {
        return loc.id === targetedLocationId;
    }).filter(loc => {
        return loc.gps.getDistance(playerLastPosition) <= loc.radius;
    });
    
    const locationOptions = document.getElementById("locationOptions");

    // target location isn't in range
    if (targetLocationIfInRangeArray.length === 0) {
        // hide the location options
        locationOptions.style.display = "none";
        return;
    }

    var location = targetLocationIfInRangeArray[0];

    locationOptions.style.display = "block";
    document.getElementById("location name").innerText = location.name;
    document.getElementById("location info").innerText = location.info;

    document.getElementById("quiz button").onclick = () => {
        alert("clicked quiz!");
    };
    document.getElementById("quest button").onclick = () => {
        alert("clicked quest!");
    };
    document.getElementById("game button").onclick = () => {
        alert("clicked game!");
    };

}

// https://www.w3schools.com/html/html5_canvas.asp

/*

options on arriving at location
 - quest
 - quiz
 - game

track next location, go in order

add in the rest of the page

*/
