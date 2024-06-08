const robotjs = use("@jitsi/robotjs");
const loudness = use("loudness");
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

            ui: [
            ]
        },
        {
            displayName: "Mute/Unmute Media",
            id: "muteMedia",

            ui: [
            ]
        },
        {
            displayName: "Volume Up",
            id: "volUp",

            ui: [
            ]
        },
        {
            displayName: "Volume Down",
            id: "volDown",

            ui: [
            ]
        },
        {
            displayName: "Next Song",
            id: "nextSong",

            ui: [
            ]
        },
        {
            displayName: "Previous Song",
            id: "prevSong",

            ui: [
            ]
        },
        {
            displayName: "Volume Dial",
            id: "volDial",

            ui: [
            ]
        }
    ]
}

async function onAction(actionId, metadata, value) {
    console.log(value);
    if (actionId === "playMedia") {
        robotjs.keyTap("audio_play");
    }
    if (actionId === "muteMedia"){
        robotjs.keyTap("audio_mute");
    }
    if (actionId === "volUp"){
        robotjs.keyTap("audio_vol_up");
    }
    if (actionId === "volDown"){
        robotjs.keyTap("audio_vol_down");
    }
    if (actionId === "nextSong"){
        robotjs.keyTap("audio_next");
    }
    if (actionId === "prevSong"){
        robotjs.keyTap("audio_prev");
    }
    if (actionId === "volDial"){
        let volume = Math.floor(value*100);
        if (!isNaN(volume)){
            await loudness.setVolume(volume);
        }
    }
}

module.exports = {onEnable, onDisable, onAction, onGetActions}