<script>
    export let device;
    export let page;
    let deviceName = "";


    function addName(){
        if (deviceName !== ""){
            device.nickname = deviceName;
            electronAPI.addDevice(device);
            page = "SetupDone";
        }
    }
</script>

<input placeholder="Device Nickname" bind:value={deviceName}>
<h5>Device: {device["friendlyName"]}</h5>
<h5>Serial Number: {device["serialNumber"]}</h5>
<h5>mimacro Version: {device["mimacroVersion"]}</h5>
<h5>Compatibility Test: {device["looksCompatible"] ? "Passed" : "Failed"}</h5>
<button on:click={addName}>Next</button>

<style>
    button {
        position: sticky;
        bottom: 10px;
        float: right;
        padding-left: 25px;
        padding-right: 25px;
        border-radius: 15px;
        font-weight: bold;
        background-color: var(--primary-blue);
        color: white;
        border: none;
    }

    button:focus-visible {
        outline: white solid 2px;
    }
</style>