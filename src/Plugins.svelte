<script>
    import { onMount } from "svelte";
    import PluginTile from "./Components/PluginTile.svelte";

    let plugins = [];
    
    onMount(async () => {
        plugins = await electronAPI.getInstalledPlugins();
    });
</script>

<h1>Plugins</h1>
{#each plugins as plugin}
    <PluginTile plugin={plugin}></PluginTile>
{/each}
{#if plugins.length === 0}
    <h2>You have no plugins installed.</h2>
{/if}