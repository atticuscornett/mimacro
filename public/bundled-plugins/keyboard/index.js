let thisPlugin;
let defaultDelay = 10;
const robotjs = use("@jitsi/robotjs");
const keyList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
    "T", "U", "V", "W", "X", "Y", "Z", "Num0", "Num1", "Num2", "Num3", "Num4", "Num5", "Num6", "Num7", "Num8", "Num9",
    "Left", "Right", "Up", "Down", "Space", "Enter", "Shift", "CapsLock", "Backspace", "Delete", "Backslash", "Comma",
    "Period", "Semicolon", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14",
    "F15", "F16", "F17", "F18", "F19", "F20"];


function onEnable(plugin){
    thisPlugin = plugin;
    robotjs.setKeyboardDelay(defaultDelay);
    console.log("Keyboard plugin is ready.")
}
function onDisable(){
    console.log("Keyboard plugin stopped.");
}

function onGetActions(){
    return [
        {
            displayName: "Key Press",
            id: "keyPress",

            ui: [
                {
                    id: "key",
                    label: "Key",
                    type: "options-select",
                    options: keyList
                },
                {
                    id: "ctrl",
                    label: "Add Ctrl modifier",
                    type: "checkbox"
                },
                {
                    id: "shift",
                    label: "Add Shift modifier",
                    type: "checkbox"
                },
                {
                    id: "win",
                    label: "Add Windows/Command modifier",
                    type: "checkbox"
                }
            ]
        },
        {
            displayName: "Type",
            id: "type",

            ui: [
                {
                    id: "typeString",
                    label: "Text to Type",
                    type: "string"
                }
            ]
        },
        {
            displayName: "Key Down",
            id: "keyDown",

            ui: [
                {
                    id: "key",
                    label: "Key",
                    type: "options-select",
                    options: keyList
                }
            ]
        },
        {
            displayName: "Key Up",
            id: "keyUp",

            ui: [
                {
                    id: "key",
                    label: "Key",
                    type: "options-select",
                    options: keyList
                }
            ]
        },
        {
            displayName: "Set Typing Speed",
            id: "typeSpeed",

            ui: [
                {
                    id: "speed",
                    label: "Typing Speed (delay between key presses in millis)",
                    type: "number"
                }
            ]
        }
    ]
}

async function onAction(actionId, parameters) {
    if (actionId === "type") {
        robotjs.typeStringDelayed(parameters.typeString, 60000/defaultDelay);
    }
    if (actionId === "keyPress"){
        if (parameters.ctrl){
            robotjs.keyToggle("control", "down");
        }
        if (parameters.win){
            robotjs.keyToggle("command", "down");
        }
        if (parameters.shift){
            robotjs.keyToggle("shift", "down");
        }
        robotjs.keyTap(parameters.key);
        if (parameters.ctrl){
            robotjs.keyToggle("control", "up");
        }
        if (parameters.win){
            robotjs.keyToggle("command", "up");
        }
        if (parameters.shift){
            robotjs.keyToggle("shift", "up");
        }
    }
    if (actionId === "keyDown"){
        robotjs.keyToggle(parameters.key, "down");
    }
    if (actionId === "keyUp"){
        robotjs.keyToggle(parameters.key, "up");
    }
    if (actionId === "typeSpeed"){
        robotjs.setKeyboardDelay(Number(parameters.speed));
        defaultDelay = Number(parameters.speed);
    }
}

module.exports = {onEnable, onDisable, onAction, onGetActions}