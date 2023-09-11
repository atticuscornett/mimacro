const {mouse, Button} = use("@nut-tree/nut-js")
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
            pluginId: "default",

            ui: [
            ]
        },
        {
            displayName: "Right Click",
            id: "rightClick",
            pluginId: "default",

            ui: [
            ]
        },
        {
            displayName: "Double Left Click",
            id: "doubleLeftClick",
            pluginId: "default",

            ui: [
            ]
        },
        {
            displayName: "Double Right Click",
            id: "doubleRightClick",
            pluginId: "default",

            ui: [
            ]
        }
    ]
}

async function onAction(actionId) {
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
}

module.exports = {onEnable, onDisable, onAction, onGetActions}