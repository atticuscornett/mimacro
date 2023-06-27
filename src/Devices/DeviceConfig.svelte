<script>
    import { onMount } from "svelte";

    export let device;
    export let devices;
    export let viewingDevice;

    onMount(getAvailablePins);

    let partsList = [];
    let deviceLayouts = [];


    async function getAvailablePins(){
        console.log(device);
        deviceLayouts = await electronAPI.getLayouts();
        partsList = await electronAPI.getParts();
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

<h1>Configure {devices[device].nickname}</h1>
{#if partsList.length}
    <div on:change={getSelections}>
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
        <h3>Analog Pins</h3>
        <div class="grid">
            {#each devices[device].pinOut.analog as d, i}
                <div>
                    <label>Pin {deviceLayouts[devices[device].mimacroType]["analog"][i]}</label>
                    <select value={String(d)} id={"analog-" + i}>
                        {#each partsList as part}
                            <option value={String(part.id)}>{part.name}</option>
                        {/each}
                    </select>
                </div>
            {/each}
        </div>
    </div>
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
</style>