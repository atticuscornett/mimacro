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

<h2>Configure "{devices[device].nickname}"</h2>
{#if partsList.length}
    <div on:change={getSelections} style="display: inline-flex;margin: 0 20px;width:-webkit-fill-available;justify-content:space-between;">
        <div>
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
</style>