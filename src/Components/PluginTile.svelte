<script>
    import Popup from "./Popup.svelte";

    export let plugin;
    let moreDetails = false;

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

    function toggleDetails(){
        moreDetails = !moreDetails;
    }
</script>
<div class="PluginTile">
    <img class="iconImage" src={"../" + plugin.icon} alt={plugin.pluginName}>
    <div>
        <h2>{plugin.pluginName}</h2>
        <h4>{plugin.version}</h4>
        <h4>{plugin.author}</h4>
        <button on:click={toggleDetails}>More Details</button>
        <button on:click={togglePlugin} class={plugin.enabled ? "enabled" : "disabled"}>{plugin.enabled ? "Disable" : "Enable"}</button>
    </div>
</div>
{#if moreDetails}
    <Popup>
        <h1>{plugin.pluginName}</h1>
        <h4>Package Name: {plugin.packageName}</h4>
        <h4>Package Author: {plugin.author}</h4>
        <h4>Version: {plugin.version}</h4>
        <br>
        <h2>Plugin Description:</h2>
        <hr>
        <h3>{plugin.description}</h3>
        <button class="close" on:click={toggleDetails}><img class="closeImg" src="../src/Images/Icons/Close.svg" alt="Close"></button>
    </Popup>
{/if}
<style>
    .PluginTile {
        width: fit-content;
        border: 3px solid gray;
        border-radius: 7px;
        padding: 10px;
        margin-right: 30px;
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

    h1 {
        margin-top: 0;
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

    .close {
        position: absolute;
        top: 10px;
        right: 10px;
        border: none;
        background: none;
    }

    .closeImg {
        width: 30px;
    }

    @media (prefers-color-scheme: dark) {
        button {
            color: white;
            background-color: black;
            border: white 2px solid;
        }
    }
</style>