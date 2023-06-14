<script>
    import { onMount } from "svelte";

    let deviceList = [];

    onMount(async () => {
        deviceList = await electronAPI.getDevices();
    })

</script>

<main>
    <h1>Devices</h1>
    
    {#each deviceList as {nickname, mimacroVersion}}
        <h2>{nickname}</h2>
        <h5>{mimacroVersion}</h5>
    {/each}
</main>