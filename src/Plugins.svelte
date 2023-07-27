<script>
    import { onMount } from "svelte";

    let plugins = [];
    
    onMount(async () => {
        plugins = await electronAPI.getInstalledPlugins();
    });
</script>

<h1>Plugins</h1>
{#each plugins as plugin}
    <h2>{plugin.pluginName}</h2>
{/each}
{#if plugins.length == 0}
    <h2>You have no plugins installed.</h2>
{/if}