const {keyboard, Key} = use("@nut-tree/nut-js");
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
        await keyboard.type(Key.AudioPlay);
    }
    if (actionId === "muteMedia"){
        await keyboard.type(Key.AudioMute);
    }
    if (actionId === "volUp"){
        await keyboard.type(Key.AudioVolUp);
    }
    if (actionId === "volDown"){
        await keyboard.type(Key.AudioVolDown);
    }
    if (actionId === "nextSong"){
        await keyboard.type(Key.AudioNext);
    }
    if (actionId === "prevSong"){
        await keyboard.type(Key.AudioPrev);
    }
    if (actionId === "volDial"){
        let volume = Math.floor(value*100);
        if (!isNaN(volume)){
            await loudness.setVolume(volume);
        }
    }
}

module.exports = {onEnable, onDisable, onAction, onGetActions}