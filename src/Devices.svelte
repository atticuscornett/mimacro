<script>
    import { onMount } from "svelte";
    import DeviceTile from "./Components/DeviceTile.svelte";
    import Popup from "./Components/Popup.svelte";
    import DeviceConfig from "./Devices/DeviceConfig.svelte";

    let deviceList = [];

    let action = "";
    let viewingDevice = false;
    let currentDevice = null;

    onMount(async () => {
        deviceList = await electronAPI.getDevices();
    })

    electronAPI.onDeviceRefresh(async () => {
        deviceList = await electronAPI.getDevices();
    });

    function viewDevice(index){
        if (deviceList[index.i].status == "connected"){
            currentDevice = index.i;
            viewingDevice = true;
        }
    }

    function renameDevice(){
        electronAPI.renameDevice(Number(action.split("-")[1]), document.getElementById("deviceName").value);
        action = "";
    }
</script>

<main>
    <h1>Devices</h1>
    
    {#if viewingDevice}
        <DeviceConfig bind:viewingDevice={viewingDevice} device={currentDevice} devices={deviceList}></DeviceConfig>
    {:else}
    <div class="deviceList">
        {#each deviceList as {nickname, mimacroVersion, mimacroType, status}, i}
            <DeviceTile mimacroType={mimacroType} nickname={nickname} mimacroVersion={mimacroVersion} status={status} bind:action={action} index={i} on:click={() => {viewDevice({i})}}></DeviceTile>
        {/each}
    </div>

    {#if action != ""}
        <Popup>
            {#if action.includes("flash")}
                <h1>Flashing "{deviceList[Number(action.split("-")[1])].nickname}"...</h1>
                <h2>Device Type: {deviceList[Number(action.split("-")[1])].mimacroType}</h2>
                <h2>Serial Number: {deviceList[Number(action.split("-")[1])].serialNumber}</h2>
                <h2>Device Port: {deviceList[Number(action.split("-")[1])].port}</h2>
            {/if}
            {#if action.includes("rename")}
                <h1>Rename "{deviceList[Number(action.split("-")[1])].nickname}"...</h1>
                <input id="deviceName">
                <button on:click={renameDevice}>Save</button>
            {/if}
        </Popup>
    {/if}
    {/if}
</main>

<style>
    .deviceList {
        display: flex;
        flex-wrap: wrap;
    }
</style>