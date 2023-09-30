<script>
    import {onMount} from "svelte";
    import {getPrimaryThemeColor} from "../utilities";
    import IconBolt from "@tabler/icons-svelte/dist/svelte/icons/IconBolt.svelte";

    export let device;
    export let page;
    const supportsAutoFlash = ["Arduino Uno"];
    electronAPI.onPortFlashResult((e, result)=>{
        if (result){
            page = "AutoDetect";
        }
        else{
            page = "FlashError";
        }
    });
    onMount(async ()=>{
        await electronAPI.flashPort(device.path, device.mimacroType);
    })
</script>
{#if supportsAutoFlash.includes(device.mimacroType)}
    <IconBolt color={getPrimaryThemeColor()} size="65"></IconBolt>
    <h2>Flashing to your {device.mimacroType}...</h2>
{:else}
    <h2>Looks like your device doesn't support automatic flashing. Please flash manually.</h2>
{/if}