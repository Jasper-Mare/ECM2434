import {UIButton, screenToWorldSpace, UIRect, SCENES} from "./framework.js";

export var startScene;
export var windowAmount;
export var windowStates = [];
export var difficulty;
export var levelLost = false;
export var energyWasted = 0;


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
        levelLost = true;
        console.log("lost at "+difficulty)
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