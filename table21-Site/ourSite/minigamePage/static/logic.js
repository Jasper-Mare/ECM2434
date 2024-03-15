import {UIButton, screenToWorldSpace, UIRect} from "./framework.js";

export const SCENES = {
    game: {
        buttons: [
            new UIButton(screenToWorldSpace(0.5, 0.5), screenToWorldSpace(100, 100), screenToWorldSpace(100, 100), clickWindow(), "", "#f49d37")
        ],
        text: [],
        sprites: [],
        background: []
    }
}

export var currentScene;
export var windowAmount;
export var windowStates;
export var difficulty;


/**
 * no parameters
 * Returns: nothing
 * 
 * Change states of variables
 */
export function logicUpdate() {
    if (Math.random() > 1-((difficulty/10)+1)) {
        windowStates[Math.floor(Math.random() * windowAmount)] = 1
    }
}

/**
 * no parameters
 * Returns: nothing
 * Preset state of windows, timer, energy meter
 */
export function start() {
    currentScene = "game";
    windowAmount = 5;
    difficulty = 1;

    // set all window states to 0
    for (let i = 0; i < windowAmount; i++) {
        windowStates[i] = 0
    }
}

/**
 * 
 */
export function clickWindow() {
    // Get which window and then reset the state to 0
}