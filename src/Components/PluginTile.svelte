<script>
    export let plugin;

    function togglePlugin(){
        if (plugin.enabled){
            plugin.enabled = false;
            electronAPI.disablePlugin(plugin.packageName);
        }
        else{
            plugin.enabled = true;
            electronAPI.enablePlugin(plugin.packageName);
        }
    }
</script>
<div class="PluginTile">
    <img class="iconImage" src={"../" + plugin.icon} alt={plugin.pluginName}>
    <div>
        <h2>{plugin.pluginName}</h2>
        <h4>{plugin.version}</h4>
        <h4>{plugin.author}</h4>
        <button>More Details</button>
        <button on:click={togglePlugin} class={plugin.enabled ? "enabled" : "disabled"}>{plugin.enabled ? "Disable" : "Enable"}</button>
    </div>
</div>
<style>
    .PluginTile {
        width: fit-content;
        border: 3px solid gray;
        border-radius: 7px;
        padding: 10px;
        margin-right: 30px;
        cursor: pointer;
        margin-bottom: 15px;
    }

    .iconImage {
        width: 44px;
        height: 44px;
        display: inline-block;
        vertical-align: top;
    }

    div {
        display: inline-block;
    }

    h2, h4 {
        margin: 5px;
    }

    h4 {
        color: gray;
    }

    button {
        margin: 5px;
        border: black 2px solid;
        font-size: 12px;
        border-radius: 7px;
        font-weight: 700;
        background-color: white;
    }

    .enabled {
        border: 0;
        background-color: darkred;
        color: white;
    }

    .disabled {
        border: 0;
        background-color: darkgreen;
        color: white;
    }

    @media (prefers-color-scheme: dark) {
        button {
            color: white;
            background-color: black;
            border: white 2px solid;
        }
    }
</style>