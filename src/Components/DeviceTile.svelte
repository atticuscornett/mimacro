<script>
    export let nickname;
    export let mimacroVersion;
    export let mimacroType;
    export let status = "disconnected";
    export let hoverOptions = true;
    export let action;
    export let index;

    async function flashDevice(){
        action = "flash-"+index;
        await electronAPI.flashDevice(index);
    }

    electronAPI.onFlashResult((event, result) => {
        console.log(result);
        action="";
    });
</script>

<div class="DevTileWrap">
    <!-- svelte-ignore a11y-missing-attribute -->
    <div class={(status == "connected") ? "DeviceTile":"DeviceTile disabled"}>
        <div on:click>
            <img src={"../src/Images/MimacroTypes/" + mimacroType + ".webp"}>
            <hr>
            <h2>{nickname}</h2>
            <h5 style="{(status == "outdated") ? "color: yellow;" : ""}">{mimacroVersion}{(status == "outdated") ? " (outdated)":""}</h5>
        </div>
        {#if hoverOptions}
            <div class="HoverOpt">
                <svg xmlns="http://www.w3.org/2000/svg" class="HoverOptIcon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                    <path d="M8 12l0 .01"></path>
                    <path d="M12 12l0 .01"></path>
                    <path d="M16 12l0 .01"></path>
                </svg>
                <div>
                    <button>Rename</button>
                    <br>
                    {#if status != "disconnected"}
                        <button on:click={flashDevice}>{(status == "connected") ? "Reflash":""}{(status == "outdated") ? "Flash Update":""}</button>
                        <br>
                    {/if}
                    <button>Remove</button>
                </div>
            </div>
        {/if}
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

    .HoverOpt {
        position: absolute;
        top: 3px;
        right: 33px;
        display: none;
    }

    .HoverOptIcon {
        float: right;
    }

    .DevTileWrap:hover .HoverOpt{
        display: block;
    }

    .HoverOpt > div {
        display: none;
        font-size: 10px;
    }

    .HoverOpt:hover > div {
        display: block;
        margin-top: 30px;
    }

    .HoverOpt > div > button {
        width: 100%;
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