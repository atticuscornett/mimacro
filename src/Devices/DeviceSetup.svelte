<script>
    import { onMount } from "svelte";
    import AutoDetectResults from "../DeviceSetup/AutoDetectResults.svelte";
    import { fade } from "svelte/transition";
    import Delay from "../Components/Delay.svelte";
    import NameDevice from "../DeviceSetup/NameDevice.svelte";
    import FlashDevice from "../DeviceSetup/FlashDevice.svelte";
    import CompatibilityWarn from "../DeviceSetup/CompatibilityWarn.svelte";
    import SetupDone from "../DeviceSetup/SetupDone.svelte";
    
    let step = "AutoDetect";
    let device = null;
    export let action;
</script>

<main>
    <h1>Let's set up your device.</h1>
    <button class="close" on:click={()=>{action="";}}><img class="closeImg" src="../src/Images/Icons/Close.svg" alt="Close"></button>

    {#if step === "AutoDetect"}
        <div transition:fade>
            <h4>Select a device.</h4>
            <AutoDetectResults bind:page={step} bind:device={device}></AutoDetectResults>
        </div>
    {/if}
    {#if step === "FlashDevice"}
        <Delay>
            <div transition:fade>
                <h4>Flash mimacro to your device.</h4>
                <FlashDevice></FlashDevice>
            </div>
        </Delay>
    {/if}
    {#if step === "CompatibilityWarn"}
        <Delay>
            <div transition:fade>
                <h4>Your device might not be compatible.</h4>
                <CompatibilityWarn></CompatibilityWarn>
            </div>
        </Delay>
    {/if}
    {#if step === "NameDevice"}
        <Delay>
            <div transition:fade>
                <h4>Name your device.</h4>
                <NameDevice bind:page={step} bind:device={device}></NameDevice>
            </div>
        </Delay>
    {/if}
    {#if step === "SetupDone"}
        <Delay>
            <div transition:fade>
                <h4>Setup complete.</h4>
                <SetupDone device={device}></SetupDone>
            </div>
        </Delay>
    {/if}
</main>
<style>
    button {
        margin: 5px;
        font-size: 12px;
        border-radius: 7px;
        font-weight: 700;
        position: absolute;
        top: 10px;
        right: 10px;
        border: none;
        background: none;
    }

    .closeImg {
        width: 30px;
    }

    h1 {
        margin-top: 0;
    }
</style>