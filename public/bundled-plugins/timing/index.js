let thisPlugin;
function onEnable(plugin){
    thisPlugin = plugin;
    console.log("Timing plugin is ready.")
}
function onDisable(){
    console.log("Timing plugin stopped.");
}

function onGetActions(){
    return [
        {
            displayName: "Wait X Seconds",
            id: "waitSeconds",

            ui: [
                {
                    id: "seconds",
                    label: "Seconds to Wait",
                    type: "number"
                },
            ]
        },
        {
            displayName: "Wait X Milliseconds",
            id: "waitMilliseconds",

            ui: [
                {
                    id: "milliseconds",
                    label: "Milliseconds to Wait",
                    type: "number"
                }
                ]
        }
    ]
}

async function onAction(actionId, parameters) {
    if (actionId === "waitSeconds") {
        const seconds = parameters.seconds || 1;
        await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    if (actionId === "waitMilliseconds") {
        const milliseconds = parameters.milliseconds || 1000;
        await new Promise(resolve => setTimeout(resolve, milliseconds));
    }
}

module.exports = {onEnable, onDisable, onAction, onGetActions}