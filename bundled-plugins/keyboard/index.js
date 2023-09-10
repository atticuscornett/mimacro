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

            ui: {
                keycode: {
                    type: "string"
                }
            }
        },
        {
            displayName: "Key Up",
            id: "keyup",
            pluginId: "default",

            ui: {
                keycode: {
                    type: "string"
                }
            }
        },
        {
            displayName: "Type",
            id: "type",
            pluginId: "default",

            ui: {
                typestring: {
                    type: "string"
                }
            }
        }
    ]
}

module.exports = {onEnable, onDisable, onGetActions}