<script>
    import { onMount } from "svelte";
    import PluginTile from "./Components/PluginTile.svelte";

    let plugins = [];
    
    onMount(async () => {
        plugins = await electronAPI.getInstalledPlugins();
    });

    async function addPlugin() {
        console.log(await electronAPI.addPluginDialog());
    }
</script>

<h1>Plugins</h1>
<button on:click={addPlugin}>Add Plugin +</button>
<br>
<br>
{#each plugins as plugin}
    <PluginTile plugin={plugin}></PluginTile>
{/each}
{#if plugins.length === 0}
    <h2>You have no plugins installed.</h2>
{/if}
<style>
    h1 {
        display: inline;
    }

    button {
        display: inline;
        float: right;
    }
</style>