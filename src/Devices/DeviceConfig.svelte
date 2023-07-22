<script>
    import { onMount } from "svelte";
    import Popup from "../Components/Popup.svelte";

    export let device;
    export let devices;
    export let viewingDevice;

    onMount(getAvailablePins);

    let partsList = [];
    let deviceLayouts = [];
    let showAdvanced = false;


    async function getAvailablePins(){
        console.log(device);
        deviceLayouts = await electronAPI.getLayouts();
        partsList = await electronAPI.getParts();
    }

    async function saveAdvanced(){
        showAdvanced = false;
    }

    async function getSelections(){
        let pinOutTemp = {
            "digital": [],
            "analog": []
        }
        let i = 0;
        while (document.getElementById("digital-"+i)){
            pinOutTemp.digital.push(document.getElementById("digital-"+i).value);
            i++;
        }
        i = 0;
        while (document.getElementById("analog-"+i)){
            pinOutTemp.analog.push(document.getElementById("analog-"+i).value);
            i++;
        }
        await electronAPI.setDevicePinOut(device, pinOutTemp);
    }
</script>

<h2>Configure "{devices[device].nickname}"</h2>
{#if partsList.length}
    <div on:change={getSelections} style="display: inline-flex;margin: 0 20px;width:-webkit-fill-available;justify-content:space-between;">
        <div style="margin-bottom: 85px;">
            <h3>Digital Pins</h3>
            <div class="grid">
                {#each devices[device].pinOut.digital as d, i}
                    <div class="config">
                        <label for={"digital-" + i}>Pin {deviceLayouts[devices[device].mimacroType]["digital"][i]}</label>
                        <select value={String(d)} id={"digital-" + i}>
                            {#each partsList as part}
                            {#if part.type != "analog"}
                                <option value={String(part.id)}>{part.name}</option>
                            {/if}
                            {/each}
                        </select>
                    </div>
                {/each}
            </div>
        </div>
        <div style="height: 50vh;">
            <img id="deviceImg" src={"../src/Images/MimacroTypes/" + devices[device].mimacroType + ".webp"} alt="Mimacro Device">
        </div>
        <div>
            <h3>Analog Pins</h3>
            <div class="grid">
                {#each devices[device].pinOut.analog as d, i}
                    <div>
                        <label for={"digital-" + i}>Pin {deviceLayouts[devices[device].mimacroType]["analog"][i]}</label>
                        <select value={String(d)} id={"analog-" + i}>
                            {#each partsList as part}
                                <option value={String(part.id)}>{part.name}</option>
                            {/each}
                        </select>
                    </div>
                {/each}
            </div>
        </div>
    </div>
    <button style="position:fixed; bottom: 10px; left: 20px;" on:click={()=>{showAdvanced=true;}}>Show Advanced Options</button>
    <button style="position:fixed; bottom: 10px; right: 20px;" on:click={()=>{viewingDevice=false;}}>Save Config</button>
    {#if showAdvanced}
        <Popup id="advancedOptions">
            <h2>Advanced Options</h2>
            <h3>Digital Pins</h3>
                {#each devices[device].pinProperties.digital.timeout as t, i}
                    <label for={"digitaltimeout-" + i}>Pin {deviceLayouts[devices[device].mimacroType]["digital"][i]} Timeout</label>
                    <input type="number" value={t} id={"digitaltimeout-" + i} min="1" max="255">
                {/each}
            <button on:click={saveAdvanced}>Close</button>
        </Popup>
    {/if}
{/if}

<style>
    select { 
        font-size: 12px;
        font-weight: 600;
    }

    .grid {
        grid-template-columns: auto auto;
        display: grid;
        justify-content: start;
        grid-gap: 5px;
    }

    #deviceImg {
        width: 100%;
        max-height: 90%;
        transform: rotate(-90deg);
        margin-top: 20%;
    }

    button {
        width: 300px;
        border-radius: 15px;
        background-color: var(--secondary-blue);
        color: white;
        border: none;
        -moz-user-select: none;
        -webkit-user-select: none;
    }
</style>