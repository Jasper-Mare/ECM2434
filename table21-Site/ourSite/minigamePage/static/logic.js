import {UIButton, screenToWorldSpace, UIRect, SCENES, loseLevel} from "./framework.js";

export var startScene;
export var windowAmount;
export var windowStates = [];
export var difficulty;
export var energyWasted;
var gameover;

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
        var index = 1+Math.floor(Math.random() * (windowAmount-1))
        windowStates[index] = 1
        SCENES.game.UI.buttons[index].resetColor("#eebb33");
    }
    difficulty += 0.00003
    SCENES.game.UI.text[1].resetText(String(Math.floor(16 * difficulty))+" points")

    if (energyWasted > 15000) {
      if (!gameover) {
        gameover = true;
        loseLevel()
        addScore() // write the score to the database
      }
    }
    else {
      for (let i = 0; i < windowAmount; i++) {
        if (windowStates[i] == 1) {
          energyWasted += 1
          SCENES.game.UI.sprites[5].resetwidth(screenToWorldSpace(0.4*energyWasted/15000,0.052)[0])
        }
      }
    }
  }

/**
 * no parameters
 * Returns: nothing
 * Preset state of windows, timer, energy meter
 */
export function start() {
    startScene = "main_menu";
    windowAmount = 42;
    difficulty = 0.03;
    energyWasted = 0;
    gameover = false;
    SCENES.game.UI.sprites[5].resetwidth(screenToWorldSpace(0,0.052)[0])
    SCENES.game.UI.text[1].resetText(String(Math.floor(16 * difficulty))+" points")

    // set all window states to 0
    for (let i = 1; i < windowAmount; i++) {
        windowStates[i] = 0
        SCENES.game.UI.buttons[i].resetColor("#666666");
    }
}

/**
 * 
 */
export function clickWindow(index) {
    // Get which window and then reset the state to 0
    console.log(index)
    if (windowStates[index-2] == 1) {
        windowStates[index-2] = 0;
        SCENES.game.UI.buttons[index-2].resetColor("#666666");
    }
    else {
        windowStates[index-2] = 1;
        SCENES.game.UI.buttons[index-2].resetColor("#eebb33");
    }
}

// function to add the score to the user in the database
function addScore() {
  var score = Math.floor(14 * difficulty); // calculate the score
  alert(score)
  console.log("score=",score)
  // get the current score of the user
  var request = "../userDB/getUserById?id="+String(userID) // get user details from their id
  getRequest(request)
  .then(response => {
    var currentscore = parseInt(response["score"]); // get the score attribute from the json

    // add the score to the current score
    var request = '../userDB/updateUser?id='+String(userID)+'&score='+String(score+currentscore) // use updateUser in contentDB
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

