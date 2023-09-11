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
        },
        {
            displayName: "Volume Up",
            id: "volUp",
            pluginId: "default",

            ui: [
            ]
        },
        {
            displayName: "Volume Down",
            id: "volDown",
            pluginId: "default",

            ui: [
            ]
        },
        {
            displayName: "Next Song",
            id: "nextSong",
            pluginId: "default",

            ui: [
            ]
        },
        {
            displayName: "Previous Song",
            id: "prevSong",
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
    if (actionId === "volUp"){
        await keyboard.pressKey(Key.AudioVolUp);
        await keyboard.releaseKey(Key.AudioVolUp);
    }
    if (actionId === "volDown"){
        await keyboard.pressKey(Key.AudioVolDown);
        await keyboard.releaseKey(Key.AudioVolDown);
    }
    if (actionId === "nextSong"){
        await keyboard.pressKey(Key.AudioNext);
        await keyboard.releaseKey(Key.AudioNext);
    }
    if (actionId === "prevSong"){
        await keyboard.pressKey(Key.AudioPrev);
        await keyboard.releaseKey(Key.AudioPrev);
    }
}

module.exports = {onEnable, onDisable, onAction, onGetActions}