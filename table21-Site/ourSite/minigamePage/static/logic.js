import {UIButton, screenToWorldSpace, UIRect, SCENES, loseLevel} from "./framework.js";

export var startScene;
export var windowAmount;
export var windowStates = [];
export var difficulty;
export var levelLost = false;
export var energyWasted;

const userID = getCookie("login"); // get the userID from the cookie
if (userID == undefined || userID == "") { // if they are not logged in redirect them to the login page
  alert("Please login to take the quiz");
  window.location.href = "/login/";
}

/**
 * no parameters
 * Returns: nothing
 * 
 * Change states of variables
 */
export function logicUpdate() {
    if (Math.random() > (1-(difficulty/10))) {
        var index = Math.floor(Math.random() * (windowAmount+1))
        windowStates[index] = 1
        SCENES.game.UI.buttons[index].resetColor("#eebb33");
    }
    for (let i = 0; i < windowAmount; i++) {
        if (windowStates[i] == 1) {
            energyWasted += 1
            SCENES.game.UI.sprites[5].resetwidth(screenToWorldSpace(0.4*energyWasted/15000,0.052)[0])        }
    }
    difficulty += 0.00003

    if (energyWasted > 15000) {
        loseLevel()
        //console.log("lost at "+difficulty)
    }
    }

/**
 * no parameters
 * Returns: nothing
 * Preset state of windows, timer, energy meter
 */
export function start() {
    startScene = "main_menu";
    windowAmount = 36;
    difficulty = 0.03;
    energyWasted = 0;

    // set all window states to 0
    for (let i = 0; i < windowAmount; i++) {
        windowStates[i] = 0
    }
}

/**
 * 
 */
export function clickWindow(index) {
    // Get which window and then reset the state to 0
    if (windowStates[index] == 1) {
        windowStates[index] = 0;
        SCENES.game.UI.buttons[index].resetColor("#666666");
    }
    else {
        windowStates[index] = 1;
        SCENES.game.UI.buttons[index].resetColor("#eebb33");
    }
}

// function to add the score to the user in the database
function addScore(score) {
    // get the current score of the user
    request = 'http://127.0.0.1:8000/userDB/getUserById?id='+String(userID) // get user details from their id
    getRequest(request)
    .then(response => {
      currentscore = parseInt(response["score"]); // get the score attribute from the json
  
      // add the score to the current score
      request = '/userDB/updateUser?id='+String(id)+'&score='+String(score+currentscore) // use updateUser in contentDB
      getRequest(request)
      .then(response => {
        console.log(response);
      })
    })
  }

// function to make a get request and return the response
async function getRequest(request) {
    try {
      const response = await fetch(request);
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

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