// ================================ Classes ================================ //

class GPScoord {
    constructor(lat,lon) {
        this.lat = lat;
        this.lon = lon;
        //console.log("GPSCoord: "+ this.lat +", "+ this.lon);
    }

    getNormalisedCoord(playerGPS) {
        // correct scaling problem between lat and lon
        const squish = 1.7729;

        return new NormalisedCoord(
            mapRange(this.lat, playerGPS.lat-playerViewDist, playerGPS.lat+playerViewDist, -1, 1),
            mapRange(this.lon, playerGPS.lon-playerViewDist*squish, playerGPS.lon+playerViewDist*squish, -1, 1),
        );
    }

}

class NormalisedCoord {
    // in scale -1 to 1
    constructor(x,y) {
        this.x = x;
        this.y = y;
        //console.log("NormalisedCoord: "+ this.x +", "+ this.y);
    }

    getScreenCoord() {
        const wMarg = (canvasBiggestSide - canvasW)*0.5;
        const hMarg = (canvasBiggestSide - canvasH)*0.5;
        
        return new ScreenCoord(
            mapRange(this.x, -1, 1, 0, canvasBiggestSide)-wMarg,
            mapRange(this.y, -1, 1, canvasBiggestSide, 0)-hMarg
        );
    }
}

class ScreenCoord {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        //console.log("ScreenCoord: "+ this.x +", "+ this.y);
    }
}

// =========================== Utility Functions =========================== //

function mapRange(val, oldMin, oldMax, newMin, newMax) {
    //console.log(val, oldMin, oldMax, newMin, newMax);
    return (val - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
}

// =========================== global variables ============================ //


var canvasW = 0;
var canvasH = 0;
var canvasBiggestSide = 0;
var ctx;
var playerViewDist = 0.002;

var mapTLgps = new GPScoord(50.73846234658168, -3.5394728294843074);
var mapBRgps = new GPScoord(50.73221777159281, -3.5284015186800306);

console.log(mapTLgps.lat-mapBRgps.lat, mapTLgps.lon-mapBRgps.lon);

var mapImgLoaded = false;
const mapImg = new Image();
mapImg.onload = () => {
    mapImgLoaded = true;
};
mapImg.src = `/static/exeter-Map-Edited.png`;

// ============================= main functions ============================ //

function initialiseMap() {
    var c = document.getElementById("map");
    ctx = c.getContext("2d");
    
    // this code is just for now, remove once the map is in the website
    ctx.canvas.width  = window.innerWidth - 20;
    ctx.canvas.height = window.innerHeight - 25;
    //c.onclick = (event) => { // move the debug view around
    //    var mouseDX = (canvasW * 0.5 - event.pageX) / canvasW * playerViewDist * 0.5;
    //    var mouseDY = (canvasH * 0.5 - event.pageY) / canvasH * playerViewDist * 0.5;
    //
    //    debugPlayerPos.lat -= mouseDX;
    //    debugPlayerPos.lon += mouseDY;
    //
    //    debugDraw();
    //}

    canvasW = ctx.canvas.width;
    canvasH = ctx.canvas.height;
    canvasBiggestSide = Math.max(canvasH, canvasW);


    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
    const gpsOptions = {
        enableHighAccuracy: true,
    }

    if (!navigator.geolocation) {
        // geolocation not supported
        gpsNotSupported(ctx);
    } else {
        // geolocation supported
        navigator.geolocation.watchPosition(geoSuccess, geoError, gpsOptions);
    }
    
    //debugDraw();

}

async function geoSuccess(position) {
    console.log(position);
    await drawMap(new GPScoord(position.coords.latitude, position.coords.longitude));
}

async function geoError() {
    if (!mapImgLoaded) {
        await mapImg.decode();
    }

    var maplocTL = new NormalisedCoord(-1,1).getScreenCoord();
    var maplocBR = new NormalisedCoord(1,-1).getScreenCoord();

    var mapWidth = maplocBR.x - maplocTL.x;
    var mapHeight = maplocBR.y - maplocTL.y;

    ctx.drawImage(mapImg, maplocTL.x, maplocTL.y, mapWidth, mapHeight);

    ctx.font = "30px Arial";
    ctx.fillText("Location is not supported or something went wrong!", 10, 50);

}

async function drawMap(playerGPS) {
    if (!mapImgLoaded) {
        await mapImg.decode();
    }
    
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.rect(0, 0, canvasW, canvasH);
    ctx.fillStyle = "#c4bcb1";
    ctx.fill();

    var maplocTL = mapTLgps.getNormalisedCoord(playerGPS).getScreenCoord();
    var maplocBR = mapBRgps.getNormalisedCoord(playerGPS).getScreenCoord();

    var mapWidth = maplocBR.x - maplocTL.x;
    var mapHeight = maplocBR.y - maplocTL.y;

    ctx.drawImage(mapImg, maplocTL.x, maplocTL.y, mapWidth, mapHeight);

    drawPlayer(playerGPS);
}

function drawPlayer(playerGPS) {
    var playerScreenCoord = playerGPS.getNormalisedCoord(playerGPS).getScreenCoord();

    console.log("draw player: ", playerScreenCoord);

    ctx.beginPath();
    ctx.arc(playerScreenCoord.x, playerScreenCoord.y, canvasBiggestSide/80, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

}

function drawLocation(playerGPS, locationGPS) {
    
}

function gpsNotSupported() {
    geoError();
}

async function debugDraw() {
    

    /*
    var pos = new NormalisedCoord(0,0);
    var posScreen = pos.getScreenCoord();

    ctx.beginPath();
    ctx.moveTo(posScreen.x, posScreen.y);
    [[-0.8,0.8], [0.8,0.8], [0.8,-0.8], [-0.8,-0.8], [-0.8,0.8]].forEach(element => {
        pos = new NormalisedCoord(element[0], element[1]);
        posScreen = pos.getScreenCoord();

        ctx.lineTo(posScreen.x, posScreen.y);
        ctx.stroke();
    });
    ctx.stroke();

    // Create gradient
    var grd = ctx.createLinearGradient(0, 0, 200, 0);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(10, 10, 150, 80);
    */

    //geoError();

    //await drawMap(debugPlayerPos);
    
    /*
    posScreen = debugPlayerPos.getNormalisedCoord(debugPlayerPos).getScreenCoord();
    //posScreen = new NormalisedCoord(0,0).getScreenCoord();
    
    ctx.moveTo(posScreen.x+10, posScreen.y+10);
    ctx.lineTo(posScreen.x-10, posScreen.y-10);
    ctx.stroke();

    ctx.moveTo(posScreen.x-10, posScreen.y+10);
    ctx.lineTo(posScreen.x+10, posScreen.y-10);
    ctx.stroke();
    */
}

// https://www.w3schools.com/html/html5_canvas.asp

/*

live update to gps

*/

