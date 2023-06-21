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
</script>

<h1>Configure {devices[device].nickname}</h1>
{#if partsList.length}
    <h3>Digital Pins</h3>
    {#each devices[device].pinOut.digital as d, i}
        <label>Pin {deviceLayouts[devices[device].mimacroType]["digital"][i]}</label>
        <select value={String(d)}>
            {#each partsList as part}
            {#if part.type != "analog"}
                <option value={String(part.id)}>{part.name}</option>
            {/if}
            {/each}
        </select>
    {/each}
    <h3>Analog Pins</h3>
    {#each devices[device].pinOut.analog as d, i}
        <label>Pin {deviceLayouts[devices[device].mimacroType]["analog"][i]}</label>
        <select value={String(d)}>
            {#each partsList as part}
                <option value={String(part.id)}>{part.name}</option>
            {/each}
        </select>
    {/each}
{/if}