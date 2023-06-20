<script>
    export let nickname;
    export let mimacroVersion;
    export let mimacroType;
    export let status = "disconnected";
    export let hoverOptions = "";
</script>

<div class="DevTileWrap">
    <!-- svelte-ignore a11y-missing-attribute -->
    <div class={(status == "connected") ? "DeviceTile":"DeviceTile disabled"}>
        <img src={"../src/Images/MimacroTypes/" + mimacroType + ".webp"}>
        <hr>
        <h2>{nickname}</h2>
        <h5 style="{(status == "outdated") ? "color: yellow;" : ""}">{mimacroVersion}{(status == "outdated") ? " (outdated)":""}</h5>
    </div>
    {#if status == "disconnected"}
        <img id="disconnectIcon" src={"../src/Images/Icons/Error.svg"} alt="Device disconnected." title="Device disconnected.">
    {/if}
    {#if status == "outdated"}
        <img id="disconnectIcon" src={"../src/Images/Icons/Warning.svg"} alt="Device outdated." title="Device software outdated.">
    {/if}
</div>

<style>
    .DevTileWrap {
        position: relative;
        display: inline-block;
    }

    .DeviceTile {
        width: 150px;
        border: 3px solid gray;
        border-radius: 7px;
        padding: 10px;
        margin-right: 30px;
        cursor: pointer;
        margin-bottom: 15px;
    }
    
    img {
        width: 100%;
    }
    
    h2 {
        font-size: 1.3em;
        padding: 0px;
        margin-top: 5px;
        margin-bottom: 2px;
    }

    h5 {
        margin-top: 0px;
        margin-bottom: 1px;
        font-size: 0.65em;
    }

    #disconnectIcon {
        position: absolute;
        left: 3px;
        top: 3px;
        width: 25px;
    }

    .disabled {
        opacity: 0.7;
    }
</style>