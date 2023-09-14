const {mouse, Button, straightTo, Point} = use("@nut-tree/nut-js")
let thisPlugin;
function onEnable(plugin){
    thisPlugin = plugin;
    console.log("Mouse plugin is ready.")
}
function onDisable(){
    console.log("Mouse plugin stopped.");
}

function onGetActions(){
    return [
        {
            displayName: "Left Click",
            id: "leftClick",

            ui: [
            ]
        },
        {
            displayName: "Right Click",
            id: "rightClick",

            ui: [
            ]
        },
        {
            displayName: "Double Left Click",
            id: "doubleLeftClick",

            ui: [
            ]
        },
        {
            displayName: "Double Right Click",
            id: "doubleRightClick",

            ui: [
            ]
        },
        {
            displayName: "Move Mouse to Position",
            id: "movePosition",

            ui: [
                {
                    id: "x",
                    label: "Mouse X",
                    type: "number"
                },
                {
                    id: "y",
                    label: "Mouse Y",
                    type: "number"
                }
            ]
        },
        {
            displayName: "Scroll Down",
            id: "scrollDown",

            ui: [
                {
                    id: "ticks",
                    label: "Scroll Ticks",
                    type: "number"
                }
            ]
        },
        {
            displayName: "Scroll Up",
            id: "scrollUp",

            ui: [
                {
                    id: "ticks",
                    label: "Scroll Ticks",
                    type: "number"
                }
            ]
        },
        {
            displayName: "Drag Mouse to Position",
            id: "dragPosition",

            ui: [
                {
                    id: "x",
                    label: "Mouse X",
                    type: "number"
                },
                {
                    id: "y",
                    label: "Mouse Y",
                    type: "number"
                }
            ]
        },
        {
            displayName: "Set Mouse Position",
            id: "setPosition",

            ui: [
                {
                    id: "x",
                    label: "Mouse X",
                    type: "number"
                },
                {
                    id: "y",
                    label: "Mouse Y",
                    type: "number"
                }
            ]
        },
        {
            displayName: "Set Mouse Speed",
            id: "mouseSpeed",

            ui: [
                {
                    id: "speed",
                    label: "Mouse Movement Speed (Pixels per Second)",
                    type: "number"
                }
            ]
        }
    ]
}

async function onAction(actionId, parameters) {
    if (actionId === "leftClick") {
        await mouse.click(Button.LEFT);
    }
    if (actionId === "rightClick"){
        await mouse.click(Button.RIGHT);
    }
    if (actionId === "doubleLeftClick") {
        await mouse.doubleClick(Button.LEFT);
    }
    if (actionId === "doubleRightClick"){
        await mouse.doubleClick(Button.RIGHT);
    }
    if (actionId === "setPosition"){
        await mouse.setPosition(new Point(parameters.x, parameters.y));
    }
    if (actionId === "movePosition"){
        await mouse.move(straightTo(new Point(parameters.x, parameters.y)));
    }
    if (actionId === "mouseSpeed"){
        mouse.config.mouseSpeed = parameters.mouseSpeed;
    }
    if (actionId === "dragPosition"){
        await mouse.drag(straightTo(new Point(parameters.x, parameters.y)));
    }
    if (actionId === "scrollDown"){
        await mouse.scrollDown(parameters.ticks);
    }
    if (actionId === "scrollUp"){
        await mouse.scrollUp(parameters.ticks);
    }
}

module.exports = {onEnable, onDisable, onAction, onGetActions}