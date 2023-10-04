<script>
    import { onMount } from "svelte";
    import PluginTile from "./Components/PluginTile.svelte";
    import Popup from "./Components/Popup.svelte";
    import Tutorial from "./Components/Tutorial.svelte";

    let plugins = [];
    let pluginDetails;
    let showPluginDetails = false;
    let iconSrc = "";
    
    onMount(async () => {
        plugins = await electronAPI.getInstalledPlugins();
    });

    async function addPlugin() {
        pluginDetails = await electronAPI.addPluginDialog();
        iconSrc = "../temp/" + pluginDetails.icon;
        if (await electronAPI.isAppBundled()){
            iconSrc = "../../" + iconSrc;
        }
        showPluginDetails = true;
        document.getElementById("installButton").innerText = "Install";
        document.getElementById("installButton").disabled = false;
        document.getElementById("cancelButton").style.display = "inline";
    }

    function cancelInstall(){
        pluginDetails = null;
        showPluginDetails = false;
    }

    async function confirmInstall(){
        document.getElementById("installButton").innerText = "Installing...";
        document.getElementById("installButton").disabled = true;
        document.getElementById("cancelButton").style.display = "none";
        await electronAPI.addPluginFromFile(pluginDetails.path);
        plugins = await electronAPI.getInstalledPlugins();
        pluginDetails = null;
        showPluginDetails = false;
    }
</script>

<h1>Plugins</h1>
<button on:click={addPlugin}>Add Plugin +</button>
<Tutorial name="Plugins" x={window.innerWidth-10} y="100">
    The plugins page allows you to manage your installed plugins.
    Plugins can add additional features to mimacro.
    Before installing a plugin, make sure you trust the plugin source.
</Tutorial>
<br>
<br>
{#each plugins as plugin}
    <PluginTile plugin={plugin} bind:pluginList={plugins}></PluginTile>
{/each}
{#if plugins.length === 0}
    <h2>You have no plugins installed.</h2>
{/if}
<Popup bind:show={showPluginDetails}>
    <div>
        <h1>Install Plugin?</h1>
        <button on:click={confirmInstall} id="installButton">Install</button>
        <button on:click={cancelInstall} id="cancelButton">Cancel</button>
    </div>
    <hr>
    <img class="iconImage" src={iconSrc} alt={pluginDetails.displayName}>
    <h1 class="inline">{pluginDetails.displayName}</h1>
    <h4>Package Name: {pluginDetails.name}</h4>
    <h4>Package Author: {pluginDetails.author}</h4>
    <h5 class="dangerous">Warning: Anyone can enter any author name. Make sure you downloaded this from a trusted source.</h5>
    <h4>Package Version: {pluginDetails.version}</h4>
    <h4>Package Description: {pluginDetails.description}</h4>
    <br>
    <h2>Permissions</h2>
    <hr>
    <h3>This plugin has permission to do the following:</h3>
    <ul>
        <!-- TODO - make more robust -->
        <div class="dangerous">
            <li>Run Javascript</li>
            <li>Use modules to control your mouse and keyboard</li>
            {#if pluginDetails.dependencies && Object.keys(pluginDetails.dependencies).length > 0}
                <li>Use the following node packages:</li>
                <ul>
                    {#each Object.keys(pluginDetails.dependencies) as moduleName}
                        <li>{moduleName}</li>
                    {/each}
                </ul>
            {/if}
        </div>
        <li>Register events to run when a mimacro device triggers it</li>
    </ul>
</Popup>
<style>
    h1 {
        display: inline;
    }

    button {
        display: inline;
        padding-left: 25px;
        padding-right: 25px;
        float: right;
        margin-left: 10px;
        border-radius: 15px;
        font-weight: bold;
        background-color: var(--primary-blue);
        color: white;
        border: none;
        user-select: none;
    }

    .inline {
        display: inline-block;
    }

    h1.inline {
        font-size: 35px;
        margin-top: 25px;
        margin-left: 15px;
    }

    .iconImage {
        width: 64px;
        height: 64px;
        display: inline-block;
        vertical-align: top;
        margin-top: 20px;
    }

    h4, h5 {
        margin-top: 2px;
        margin-bottom: 4px;
    }

    .dangerous {
        color: red;
    }
</style>