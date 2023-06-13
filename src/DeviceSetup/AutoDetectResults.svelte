<script>
    export let page;
    export let device;

    import { onMount } from "svelte";

    let detected = null;
    electronAPI.onAutoDetect((event, detect) => {detected = detect; console.log(detect)});
    onMount(() => {
        electronAPI.autoDetectDevices();
    });

    function nextStep(){
        page = "NameDevice";
    }
</script>

<main>
    {#if !detected}
        <h2>Loading devices...</h2>
    {:else}
        <div>
            <h2>mimacro Devices</h2>
            {#each detected["mimacro"] as {friendlyName}, i}
                <input type="radio" value={"mimacro-" + i} id={"mimacro-" + i} name="autoDeviceSelect">
                <label for={"mimacro-" + i}>{friendlyName}</label>
                <br>
            {/each}
            <h2>Arduino Uno Devices</h2>
            {#each detected["uno"] as {friendlyName}, i}
                <input type="radio" value={"uno-" + i} id={"uno-" + i} name="autoDeviceSelect">
                <label for={"uno-" + i}>{friendlyName}</label>
                <br>
            {/each}
            <h2>Other Devices</h2>
            {#each detected["other"] as {friendlyName}, i}
                <input type="radio" value={"other-" + i} id={"other-" + i} name="autoDeviceSelect">
                <label for={"other-" + i}>{friendlyName}</label>
                <br>
            {/each}
        </div>
        <button on:click={nextStep}>Next</button>
    {/if}
</main>

<style>
    input:checked + label {
        color:red;
    }
</style>