<script>
    export let page;
    export let device;

    import { onMount } from "svelte";
    import Selectable from "../Components/Selectable.svelte";

    let detected = null;
    electronAPI.onAutoDetect((event, detect) => {detected = detect; console.log(detect)});
    onMount(() => {
        electronAPI.autoDetectDevices();
    });

    function getSelection(name){
        let group = document.getElementsByName(name);
        for (let i = 0; i < group.length; i++){
            if (group[i].checked){
                return group[i].value;
            }
        }
        return false;
    }

    function nextStep(){
        if (getSelection("autoDeviceSelect")){
            page = "NameDevice";
        }
    }
</script>

<main>
    {#if !detected}
        <h2>Loading devices...</h2>
    {:else}
        <div>
            <h2>mimacro Devices</h2>
            {#each detected["mimacro"] as {friendlyName}, i}
                <Selectable id={"mimacro-" + i} name="autoDeviceSelect" label={friendlyName}></Selectable>
            {/each}
            <h2>Arduino Uno Devices</h2>
            {#each detected["uno"] as {friendlyName}, i}
                <Selectable id={"uno-" + i} name="autoDeviceSelect" label={friendlyName}></Selectable>
            {/each}
            <h2>Other Devices</h2>
            {#each detected["other"] as {friendlyName}, i}
                <Selectable id={"other-" + i} name="autoDeviceSelect" label={friendlyName}></Selectable>
            {/each}
        </div>
        <button on:click={nextStep}>Next</button>
    {/if}
</main>