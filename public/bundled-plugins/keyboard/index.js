let thisPlugin;
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
            displayName: "Key Down",
            id: "keydown",
            pluginId: "default",

            ui: [
                {
                    id: "keycode",
                    label: "Keycode",
                    type: "string"
                }
            ]
        },
        {
            displayName: "Key Up",
            id: "keyup",
            pluginId: "default",

            ui: [
                {
                    id: "keycode",
                    label: "Keycode",
                    type: "string"
                }
            ]
        },
        {
            displayName: "Type",
            id: "type",
            pluginId: "default",

            ui: [
                {
                    id: "typestring",
                    label: "Type String",
                    type: "string"
                }
            ]
        }
    ]
}

function onAction(actionId){
    console.log("I am supposed to run " + actionId);
}

module.exports = {onEnable, onDisable, onAction, onGetActions}