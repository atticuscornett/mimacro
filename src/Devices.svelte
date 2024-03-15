<script>
    import { onMount } from "svelte";
    import DeviceTile from "./Components/DeviceTile.svelte";
    import Popup from "./Components/Popup.svelte";
    import DeviceConfig from "./Devices/DeviceConfig.svelte";
    import DeviceSetup from "./Devices/DeviceSetup.svelte";
    import IconBolt from "@tabler/icons-svelte/dist/svelte/icons/IconBolt.svelte";
    import {getPrimaryThemeColor} from "./utilities";
    import Tutorial from "./Components/Tutorial.svelte";

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
        if (deviceList[index.i].status === "connected"){
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
    <h1 class="inline">Devices</h1>
    {#if !viewingDevice}
        <Tutorial name="Devices" x={window.innerWidth-10} y="100">
            The devices page lists and manages your microcontrollers.
            After you add a device, click on the tile to manage the pin layout.
        </Tutorial>
        <button id="newDeviceButton" on:click={()=>{action = "newDevice";}}>Add Device +</button>
    {/if}
    <br>
    
    {#if viewingDevice}
        <Tutorial name="Configuring Devices" x="300" y="100">
            The device configuration page lets you set what parts are plugged into which pins on your device.
            If a part is misbehaving (such as a button firing multiple times per press), you may need tweak the advanced
            options.
        </Tutorial>
        <DeviceConfig bind:viewingDevice={viewingDevice} device={currentDevice} devices={deviceList}></DeviceConfig>
    {:else}
        <div class="deviceList">
            {#if deviceList.length === 0}
                <h2>You haven't added any devices yet.</h2>
            {/if}
            {#each deviceList as {nickname, mimacroVersion, mimacroType, status}, i}
                <DeviceTile mimacroType={mimacroType} nickname={nickname} mimacroVersion={mimacroVersion} status={status} bind:action={action} index={i} viewDevice={viewDevice} on:click={() => {viewDevice({i})}}></DeviceTile>
            {/each}
        </div>

        {#if action !== ""}
            <Popup bind:show={action}>
                {#if action.includes("flash")}
                    <div class="centered">
                        <IconBolt color={getPrimaryThemeColor()} size="65"></IconBolt>
                        <h1>Flashing "{deviceList[Number(action.split("-")[1])].nickname}"...</h1>
                        <h2>This will take a few moments.</h2>
                        <h3>Device Type: {deviceList[Number(action.split("-")[1])].mimacroType}</h3>
                        <h3>Serial Number: {deviceList[Number(action.split("-")[1])].serialNumber}</h3>
                        <h3>Device Port: {deviceList[Number(action.split("-")[1])].port}</h3>
                    </div>
                {/if}
                {#if action.includes("rename")}
                    <div class="centered">
                        <h1 class="noTopMargin">Rename "{deviceList[Number(action.split("-")[1])].nickname}"...</h1>
                        <input id="deviceName" class="rounded" value={deviceList[Number(action.split("-")[1])].nickname}>
                        <button class="saveRename rounded" on:click={renameDevice}>Save</button>
                    </div>
                {/if}
                {#if action === "newDevice"}
                    <DeviceSetup bind:action={action}></DeviceSetup>
                {/if}
                {#if action === "successFsh"}
                    <div class="centered">
                        <IconBolt color={getPrimaryThemeColor()} size="65"></IconBolt>
                        <h1>Device flashed successfully.</h1>
                    </div>
                {/if}
                {#if action === "failFsh"}
                    <div class="centered">
                        <IconBolt color={getPrimaryThemeColor()} size="65"></IconBolt>
                        <h1>Device flash failed.</h1>
                        <h3>The device could not be flashed.</h3>
                        <h3>Check that no other software is using the device.</h3>
                    </div>
                {/if}
            </Popup>
        {/if}
    {/if}
</main>

<style>
    .deviceList {
        display: flex;
        flex-wrap: wrap;
        margin-top: 15px;
    }

    .inline {
        display: inline;
    }

    .centered {
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    #newDeviceButton {
        padding-left: 25px;
        padding-right: 25px;
        display: inline;
        float: right;
        margin-left: 10px;
        border-radius: 15px;
        font-weight: bold;
        background-color: var(--primary-blue);
        color: white;
        border: none;
        user-select: none;
    }

    #newDeviceButton:focus-visible {
        outline: white 2px solid;
    }

    .saveRename {
        background-color: var(--primary-blue);
        color: white;
        border: 2px var(--primary-blue) solid;
    }

    .rounded {
        border-radius: 7px;
    }

    .noTopMargin {
        margin-top: 0;
    }
</style>