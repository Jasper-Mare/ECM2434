// writen by Jasper Mare

// ================================ Classes ================================ //

class GPScoord {
    constructor(lat,lon) {
        this.lat = lat;
        this.lon = lon;
    }

    getNormalisedCoord(playerGPS, targetedLocation) {
        // correct scaling problem between lat and lon
        const squish = 1.7729;

        // calculate the distance from the user to the centre and the location to the centre
        const playerDist = playerGPS.getDistance(mapCentre);
        const targetDist = playerGPS.getDistance(mapCentre);

        // only allow the map to zoom in till a certain point
        const viewDist = Math.max(playerDist, targetDist, playerMinViewDist)*canvasAspectRatio;

        return new NormalisedCoord(
            mapRange(this.lon, mapCentre.lon-(viewDist/2)*squish, mapCentre.lon+(viewDist/2)*squish, -1, 1),
            mapRange(this.lat, mapCentre.lat-viewDist/2, mapCentre.lat+viewDist/2, -1, 1),
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
var locationFGColour = playerFGColour;
var locationBGColour = '#66F678';
var locationRadiusColour = '#ff000055'; // RR GG BB AA
var targetLocationBGColour = locationBGColour;

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

    function waitForLocations() {
        locationsWithId = locations.filter(loc => {return loc.id === targetedLocationId});
        if (locationsWithId.length == 0) {
            // locations aren't loaded, so wait
            setTimeout(() => {
                waitForLocations();
            },100);
        } else {
            targetedPosition = locationsWithId[0].gps;
        }
    }
    waitForLocations();
})

var locations = [];
fetch("/contentDB/getAllLocations", {method: "GET"})
    .then((response) => response.json())
    .then((json) => {
        json["locations"].forEach(e => {
            locations.push(new Location(e["id"], e["name"], e["gps_lat"], e["gps_long"], e["info"], e["radius"]));
        });
        checkIfAtLocation();
    })

const mapCentre = new GPScoord((mapTLgps.lat + mapBRgps.lat)/2, (mapTLgps.lon + mapBRgps.lon)/2);
var targetedPosition = mapCentre;
var playerLastPosition = targetedPosition;

var gpsError = false;

var mapImgLoaded = false;
const mapImg = new Image();
mapImg.onload = () => {
    mapImgLoaded = true;
};
mapImg.src = `/static/images/exeter-Map-Edited.png`;

window.addEventListener('resize', resizeMap, true);

// ============================= main functions ============================ //

function initialiseMap() {
    var c = document.getElementById("map");
    ctx = c.getContext("2d");
    
    resizeMap();
    checkIfAtLocation();

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

    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    canvasW = ctx.canvas.width;
    canvasH = ctx.canvas.height;
    canvasLongestSide = Math.max(canvasH, canvasW);
    
    // longest side divided by shortest side
    canvasAspectRatio = canvasLongestSide/Math.min(canvasH, canvasW);
}

async function geoSuccess(position) {
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
        ctx.fillStyle = targetLocationBGColour;
    } else {
        ctx.fillStyle = locationBGColour;
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

    // location icon
    var iconHeight = locationIconSize / Math.sqrt(4);
    var iconWidth = iconHeight * 0.6;
    var iconTL = new ScreenCoord(locationScreenCoord.x-iconWidth/2, locationScreenCoord.y-iconHeight/2);
    var iconBR = new ScreenCoord(locationScreenCoord.x+iconWidth/2, locationScreenCoord.y+iconHeight/2);

    ctx.fillStyle = locationFGColour;
    ctx.fillRect(iconTL.x, iconTL.y, iconWidth*0.5, iconHeight);
    ctx.fillRect(iconTL.x, iconBR.y, iconWidth, -iconHeight*0.35);
}

function gpsNotSupported() {
    gpsError = true;
}

function checkIfAtLocation() {
    if (locations.length === 0) {
        // locations are not loaded yet, wait for them
        setTimeout(checkIfAtLocation, 100);
    }

    console.log("checking if player at location:", playerLastPosition);

    // get the locations close enough
    var targetLocationIfInRangeArray = locations.filter(loc => {
        return loc.id === targetedLocationId;
    }).filter(loc => {
        return loc.gps.getDistance(playerLastPosition) <= loc.radius;
    });
    
    const locationOptions = document.getElementById("locationOptions");
    console.log("checking if player at location:", targetLocationIfInRangeArray.length);

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
        window.location.href="/quiz/?id="+targetedLocationId;
    };
    document.getElementById("quest button").onclick = () => {
        window.location.href="/quest/";
    };
    document.getElementById("game button").onclick = () => {
        window.location.href="/minigame/";
    };

}

// https://www.w3schools.com/html/html5_canvas.asp
