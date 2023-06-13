<script>
    import { onMount } from "svelte";
    import AutoDetectResults from "./DeviceSetup/AutoDetectResults.svelte";
    import { fade } from "svelte/transition";
    
    let step = "AutoDetect";
    let device = null;
</script>

<main>
    <h1>Let's set up your device.</h1>
    <h4>Select a device.</h4>
    {#if step == "AutoDetect"}
        <div transition:fade>
            <AutoDetectResults bind:page={step} bind:device={device}></AutoDetectResults>
        </div>
    {/if}
    {#if step == "NameDevice"}
        <div transition:fade={{delay: 1000}}>
            <input placeholder="Device Name">
        </div>
    {/if}
    
</main>