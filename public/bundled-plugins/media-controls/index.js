const {keyboard, Key} = use("@nut-tree/nut-js")
let thisPlugin;
function onEnable(plugin){
    thisPlugin = plugin;
    console.log("Media controls plugin is ready.")
}
function onDisable(){
    console.log("Media controls plugin stopped.");
}

function onGetActions(){
    return [
        {
            displayName: "Play/Pause Media",
            id: "playMedia",
            pluginId: "default",

            ui: [
            ]
        },
        {
            displayName: "Mute/Unmute Media",
            id: "muteMedia",
            pluginId: "default",

            ui: [
            ]
        }
    ]
}

async function onAction(actionId) {
    if (actionId === "playMedia") {
        await keyboard.pressKey(Key.AudioPlay);
        await keyboard.releaseKey(Key.AudioPlay);
    }
    if (actionId === "muteMedia"){
        await keyboard.pressKey(Key.AudioMute);
        await keyboard.releaseKey(Key.AudioMute);
    }
}

module.exports = {onEnable, onDisable, onAction, onGetActions}