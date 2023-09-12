let thisPlugin;
const {keyboard, Key} = use("@nut-tree/nut-js")
const keyList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
    "T", "U", "V", "W", "X", "Y", "Z", "Num0", "Num1", "Num2", "Num3", "Num4", "Num5", "Num6", "Num7", "Num8", "Num9",
    "Left", "Right", "Up", "Down", "Space", "Enter", "Shift", "CapsLock", "Backspace", "Delete", "Backslash", "Comma",
    "Period", "Semicolon", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14",
    "F15", "F16", "F17", "F18", "F19", "F20"];


function onEnable(plugin){
    thisPlugin = plugin;
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
            pluginId: "default",

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
            pluginId: "default",

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
            pluginId: "default",

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
            pluginId: "default",

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
            pluginId: "default",

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
        await keyboard.type(parameters.typeString);
    }
    if (actionId === "keyPress"){
        if (parameters.ctrl){
            await keyboard.pressKey(Key.LeftControl);
        }
        if (parameters.win){
            await keyboard.pressKey(Key.LeftWin);
        }
        if (parameters.shift){
            await keyboard.pressKey(Key.LeftShift);
        }
        await keyboard.pressKey(Key[parameters.key]);
        await keyboard.releaseKey(Key[parameters.key]);
        if (parameters.ctrl){
            await keyboard.releaseKey(Key.LeftControl);
        }
        if (parameters.win){
            await keyboard.releaseKey(Key.LeftWin);
        }
        if (parameters.shift){
            await keyboard.releaseKey(Key.LeftShift);
        }
    }
    if (actionId === "keyDown"){
        await keyboard.pressKey(Key[parameters.key]);
    }
    if (actionId === "keyUp"){
        await keyboard.releaseKey(Key[parameters.key]);
    }
    if (actionId === "typeSpeed"){
        keyboard.config.autoDelayMs = Number(parameters.speed);
    }
}

module.exports = {onEnable, onDisable, onAction, onGetActions}