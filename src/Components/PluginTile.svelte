<script>
    import Popup from "./Popup.svelte";
    import {onMount} from "svelte";

    export let plugin;
    export let pluginList;

    let pluginSettings = {};
    let moreDetails = false;
    let showSettings = false;
    let readME = "";
    onMount(async () => {
        readME = await getPluginREADME();
        if (readME === "")[
            readME = "No README provided."
        ]
        pluginSettings = await electronAPI.getPluginSettings(plugin.packageName);
    })

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

    function getPluginSettings(){
        let keys = Object.keys(pluginSettings);
        for (let i = 0; i < keys.length; i++){
            if (pluginSettings[keys[i]].type === "boolean"){
                pluginSettings[keys[i]].value = document.getElementById("setting-"+plugin.packageName+"-"+keys[i]).checked;
            }
            else if (pluginSettings[keys[i]].type === "number"){
                pluginSettings[keys[i]].value = Number(document.getElementById("setting-"+plugin.packageName+"-"+keys[i]).value);
            }
            else {
                pluginSettings[keys[i]].value = document.getElementById("setting-"+plugin.packageName+"-"+keys[i]).value;
            }
        }
        electronAPI.setPluginSettings(plugin.packageName, pluginSettings);
    }

    function toggleSettings(){
        showSettings = !showSettings;
    }

    async function getPluginREADME() {
        let text = await electronAPI.getPluginREADME(plugin.packageName);
        text = marked.parse(text);
        text = DOMPurify.sanitize(text);
        return text;
    }

    async function uninstall() {
        document.getElementById("uninstallButton").disabled = true;
        document.getElementById("uninstallButton").innerText = "Uninstalling...";
        await electronAPI.uninstallPlugin(plugin.packageName);
        pluginList = await electronAPI.getInstalledPlugins();
    }
</script>
<div class="PluginTileWrapper">
    <div class="PluginTile">
        <img class="iconImage" src={plugin.icon} alt={plugin.pluginName}>
        <div>
            <h2>{plugin.pluginName}</h2>
            <h4>{plugin.version}</h4>
            <h4>{plugin.author}</h4>
            <button on:click={toggleDetails}>More Details</button>
            {#if Object.keys(pluginSettings).length !== 0}
                <button on:click={toggleSettings}>Settings</button>
            {/if}
            <button on:click={togglePlugin} class={plugin.enabled ? "enabled" : "disabled"}>{plugin.enabled ? "Disable" : "Enable"}</button>
        </div>
        {#if plugin.error}
            <img class="errorIcon" src={"../src/Images/Icons/Error.svg"} alt="Plugin error." title="Errors occurred on plugin load.">
        {/if}
    </div>
</div>
    <Popup bind:show={moreDetails}>
        <h1>{plugin.pluginName}</h1>
        <h4>Package Name: {plugin.packageName}</h4>
        <h4>Package Author: {plugin.author}</h4>
        <h4>Version: {plugin.version}</h4>
        <h4>Description: {plugin.description}</h4>
        <button id="uninstallButton" on:click={uninstall}>Uninstall</button>
        <br><br>
        <h2>Plugin README</h2>
        <hr>
        <h3>{@html readME}</h3>
        <button class="close" on:click={toggleDetails}><img class="closeImg" src="../src/Images/Icons/Close.svg" alt="Close"></button>
    </Popup>
    <Popup bind:show={showSettings}>
        <h1>{plugin.pluginName} Settings</h1>
        <div on:change={getPluginSettings}>
            {#each Object.entries(pluginSettings) as [key, setting]}
                <label for="setting-{plugin.packageName}-{key}" style="display:inline;">
                    <span class="underline">{setting.label}</span>:
                    <span class="hoverTip">Type: {setting.type}<br>Description: {setting.description}</span>
                </label>
                {#if setting.type === "string"}
                    <input id="setting-{plugin.packageName}-{key}" value={setting.value}>
                {/if}
                {#if setting.type === "boolean"}
                    <input id="setting-{plugin.packageName}-{key}" type="checkbox" checked={setting.value}>
                {/if}
                {#if setting.type === "number"}
                    <input id="setting-{plugin.packageName}-{key}" type="number" value={setting.value}>
                {/if}
                {#if setting.type === "choice"}
                    <select id="setting-{plugin.packageName}-{key}">
                        {#each setting.options as choice}
                            <option value={choice}>{choice}</option>
                        {/each}
                    </select>
                {/if}
                <br><br>
            {/each}
        </div>
        <button class="close" on:click={toggleSettings}><img class="closeImg" src="../src/Images/Icons/Close.svg" alt="Close"></button>
    </Popup>
<style>
    .PluginTile {
        width: fit-content;
        border: 3px solid grey;
        border-radius: 7px;
        padding: 10px;
        margin-right: 30px;
        margin-bottom: 15px;
    }

    .PluginTileWrapper {
        position: relative;
        display: inline-block;
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
        color: grey;
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

    label {
        font-size: 25px;
        margin-right: 10px;
        margin-bottom: 0;
    }

    .underline {
        text-decoration-style: dotted;
        text-decoration-line: underline;
    }

    input {
        font-size: 12px;
        font-weight: 900;
        vertical-align: bottom;
        margin-bottom: 0;
    }

    input[type="checkbox"] {
        width: 20px;
        height: 20px;
        vertical-align: sub;
    }

    select {
        font-size: 12px;
        font-weight: 900;
        vertical-align: top;
    }

    .hoverTip {
        position: absolute;
        background-color: white;
        color: black;
        padding: 5px;
        border-radius: 3px;
        max-width: 55%;
        visibility: hidden;
        z-index: 99;
        font-size: 15px;
        text-decoration-line: none;
    }

    label:hover > .hoverTip {
        visibility: visible;
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

        .errorIcon {
            position: absolute;
            right: 33px;
            top: 3px;
            width: 25px;
        }

        @media (prefers-color-scheme: dark) {
            button {
                color: white;
                background-color: black;
                border: white 2px solid;
            }
        }
</style>