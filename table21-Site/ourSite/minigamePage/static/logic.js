const SCENES = {
    game: {
        buttons: [],
        text: [],
        sprites: [],
        background: []
    }
}


var currentScene = "game";
const windowAmount = "5";
windowStates = [];
var difficulty = 1;


/**
 * no parameters
 * Returns: nothing
 * 
 * Change states of variables
 */
function logicUpdate() {
    if (Math.random() > 1-((difficulty/10)+1)) {
        windowStates[Math.floor(Math.random() * windowAmount)] = 1
    }
}

/**
 * no parameters
 * Returns: nothing
 * Preset state of windows, timer, energy meter
 */
function start() {
    // set all window states to 0
    for (let i = 0; i < windowAmount; i++) {
        windowStates[i] = 0
    }
}

/**
 * 
 */
function clickWindow() {
    // Get which window and then reset the state to 0
}