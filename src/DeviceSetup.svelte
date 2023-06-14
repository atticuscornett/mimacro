<script>
    import { onMount } from "svelte";
    import AutoDetectResults from "./DeviceSetup/AutoDetectResults.svelte";
    import { fade } from "svelte/transition";
    import Delay from "./Components/Delay.svelte";
    import NameDevice from "./DeviceSetup/NameDevice.svelte";
    import FlashDevice from "./DeviceSetup/FlashDevice.svelte";
    import CompatibilityWarn from "./DeviceSetup/CompatibilityWarn.svelte";
    import SetupDone from "./DeviceSetup/SetupDone.svelte";
    
    let step = "AutoDetect";
    let device = null;
</script>

<main>
    <h1>Let's set up your device.</h1>

    {#if step == "AutoDetect"}
        <div transition:fade>
            <h4>Select a device.</h4>
            <AutoDetectResults bind:page={step} bind:device={device}></AutoDetectResults>
        </div>
    {/if}
    {#if step == "FlashDevice"}
        <Delay>
            <div transition:fade>
                <h4>Flash mimacro to your device.</h4>
                <FlashDevice></FlashDevice>
            </div>
        </Delay>
    {/if}
    {#if step == "CompatibilityWarn"}
        <Delay>
            <div transition:fade>
                <h4>Your device might not be compatible.</h4>
                <CompatibilityWarn></CompatibilityWarn>
            </div>
        </Delay>
    {/if}
    {#if step == "NameDevice"}
        <Delay>
            <div transition:fade>
                <h4>Name your device.</h4>
                <NameDevice bind:page={step} bind:device={device}></NameDevice>
            </div>
        </Delay>
    {/if}
    {#if step == "SetupDone"}
        <Delay>
            <div transition:fade>
                <h4>Setup complete.</h4>
                <SetupDone device={device}></SetupDone>
            </div>
        </Delay>
    {/if}
</main>