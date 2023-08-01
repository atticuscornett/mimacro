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
        validateAdvancedInputs();
        let i = 0;
        while (document.getElementById("digitaltimeout-" + i)){
            devices[device].pinProperties.digital.timeout[i] = Number(document.getElementById("digitaltimeout-" + i).value);
            i++;
        }
        i = 0;
        while (document.getElementById("analogtimeout-" + i)){
            devices[device].pinProperties.analog.timeout[i] = Number(document.getElementById("analogtimeout-" + i).value);
            i++;
        }
        i = 0;
        while (document.getElementById("analogminchange-" + i)){
            devices[device].pinProperties.analog.minChange[i] = Number(document.getElementById("analogminchange-" + i).value);
            i++;
        }
        electronAPI.setDevicePinProperties(device, devices[device].pinProperties);
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

    function validateAdvancedInputs(){
        let i = 0;
        while (document.getElementById("digitaltimeout-" + i)){
            if (document.getElementById("digitaltimeout-" + i).value > 255){
                document.getElementById("digitaltimeout-" + i).value = "255";
            }
            if (document.getElementById("digitaltimeout-" + i).value < 0){
                document.getElementById("digitaltimeout-" + i).value = "0";
            }
            i++;
        }
        i = 0;
        while (document.getElementById("analogtimeout-" + i)){
            if (document.getElementById("analogtimeout-" + i).value > 255){
                document.getElementById("analogtimeout-" + i).value = "255";
            }
            if (document.getElementById("analogtimeout-" + i).value < 0){
                document.getElementById("analogtimeout-" + i).value = "0";
            }
            i++;
        }
        i = 0;
        while (document.getElementById("analogminchange-" + i)){
            if (document.getElementById("analogminchange-" + i).value > 255){
                document.getElementById("analogminchange-" + i).value = "255";
            }
            if (document.getElementById("analogminchange-" + i).value < 0){
                document.getElementById("analogminchange-" + i).value = "0";
            }
            i++;
        }
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
                                {#if part.type !== "analog"}
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
            <h2 style="margin-top:0;">Advanced Options</h2>
            <h3>Digital Pins</h3>
            <hr>
            <h4>Timeout sets how often the state of the pin is allowed to refresh. A digital timeout helps prevent false double presses from being recorded. Units are in milliseconds.</h4>
            <div class="flexList" on:change={validateAdvancedInputs}>
                {#each devices[device].pinProperties.digital.timeout as t, i}
                    <div>
                        <label for={"digitaltimeout-" + i}>Pin {deviceLayouts[devices[device].mimacroType]["digital"][i]} Timeout</label>
                        <input type="number" value={t} id={"digitaltimeout-" + i} min="1" max="255">
                    </div>
                {/each}
            </div>
            <h3>Analog Pins</h3>
            <hr>
            <h4>Timeout sets how often the state of the pin is allowed to refresh. An analog timeout helps prevent the serial connection from sending messages too often. Units are in milliseconds.</h4>
            <div class="flexList" on:change={validateAdvancedInputs}>
                {#each devices[device].pinProperties.analog.timeout as t, i}
                    <div>
                        <label for={"analogtimeout-" + i}>Pin {deviceLayouts[devices[device].mimacroType]["analog"][i]} Timeout</label>
                        <input type="number" value={t} id={"analogtimeout-" + i} min="1" max="255">
                    </div>
                {/each}
            </div>
            <h4>Minimum change (minchange) sets the minimum change in analog value (0-1023) that will be registered by the device, altering its sensitivity.  A minimum change value helps the device ignore regular variations in voltage readings.</h4>
            <div class="flexList" on:change={validateAdvancedInputs}>
                {#each devices[device].pinProperties.analog.minChange as t, i}
                    <div>
                        <label for={"analogminchange-" + i}>Pin {deviceLayouts[devices[device].mimacroType]["analog"][i]} Minchange</label>
                        <input type="number" value={t} id={"analogminchange-" + i} min="1" max="255">
                    </div>
                {/each}
            </div>
            <button on:click={saveAdvanced} style="width:100%;position:sticky;bottom:0;margin-top:20px;">Save Changes</button>
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
        pointer-events: none;
    }

    .flexList {
        display: grid;
        grid-template-columns: repeat(auto-fill, 150px);
    }

    button {
        width: 300px;
        border-radius: 15px;
        font-weight: bold;
        background-color: var(--primary-blue);
        color: white;
        border: none;
        user-select: none;
    }
</style>