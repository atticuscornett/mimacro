<script>
    import { onMount } from "svelte";
    import DeviceTile from "./Components/DeviceTile.svelte";

    let deviceList = [];

    onMount(async () => {
        deviceList = await electronAPI.getDevices();
    })

    electronAPI.onDeviceRefresh(async () => {
        deviceList = await electronAPI.getDevices();
    });
</script>

<main>
    <h1>Devices</h1>
    
    {#each deviceList as {nickname, mimacroVersion, mimacroType, status}}
        <DeviceTile mimacroType={mimacroType} nickname={nickname} mimacroVersion={mimacroVersion} status={status}></DeviceTile>
    {/each}
</main>