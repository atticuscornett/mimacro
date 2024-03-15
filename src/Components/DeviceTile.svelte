<script>
    export let nickname;
    export let mimacroVersion;
    export let mimacroType;
    export let status = "disconnected";
    export let hoverOptions = true;
    export let action;
    export let index;
    export let totalDevices;

    export let viewDevice;

    async function flashDevice(){
        action = "flash-"+index;
        await electronAPI.flashDevice(index);
    }
    
    async function renameDevice(){
        action = "rename-" + index;
    }

    async function removeDevice(){
        await electronAPI.removeDevice(index);
    }

    electronAPI.onFlashResult((event, result) => {
        console.log(result);
        if (result){
            action="successFsh";
        }
        else{
            action="failFsh";
        }

    });

    function handleKeypress(event){
        if (event.key === "Tab"){
            event.preventDefault();
            document.getElementById("device-hover-options-"+index).focus();
        }
        if (event.key === "Enter"){
            viewDevice({"i": index});
        }
    }

    function handleHoverKeypress(event){
        if (event.key === "Tab"){
            event.preventDefault();
            event.stopPropagation();
            document.getElementById("device-hover-options-rename-"+index).focus();
        }
    }

    function handleHoverButtonKeypress(event){
        console.log(action)
        if (event.target.id === "device-hover-options-remove-"+index && (index === totalDevices-1) && (action === "" ||
            action === false)){
            document.getElementById("nav-Devices").focus();
            event.preventDefault();
        }
        event.stopPropagation();
    }
</script>

<div class="DevTileWrap" on:keydown={handleKeypress}>
    <!-- svelte-ignore a11y-missing-attribute -->
    <div class={(status === "connected") ? "DeviceTile":"DeviceTile disabled"} tabindex="0">
        <div on:click>
            <img src={"../src/Images/MimacroTypes/" + mimacroType + ".webp"}>
            <hr>
            <h2>{nickname}</h2>
            <h5 style="{(status == "outdated") ? "color: yellow;" : ""}">{mimacroVersion}{(status == "outdated") ? " (outdated)":""}</h5>
        </div>
        {#if hoverOptions}
            <div class="HoverOpt" id="device-hover-options-{index}" tabindex="1" on:keydown={handleHoverKeypress}>
                <svg xmlns="http://www.w3.org/2000/svg" class="HoverOptIcon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                    <path d="M8 12l0 .01"></path>
                    <path d="M12 12l0 .01"></path>
                    <path d="M16 12l0 .01"></path>
                </svg>
                <div>
                    <button id="device-hover-options-rename-{index}" on:click={renameDevice} on:keydown={handleHoverButtonKeypress}>Rename</button>
                    <br>
                    {#if status !== "disconnected" && status !== "updating"}
                        <button id="device-hover-options-flash-{index}" on:click={flashDevice} on:keydown={handleHoverButtonKeypress}>{(status === "connected") ? "Reflash":""}{(status === "outdated") ? "Flash Update":""}</button>
                        <br>
                    {/if}
                    <button id="device-hover-options-remove-{index}" on:click={removeDevice} on:keydown={handleHoverButtonKeypress}>Remove</button>
                </div>
            </div>
        {/if}
    </div>
    {#if status === "disconnected"}
        <img id="disconnectIcon" src={"../src/Images/Icons/Error.svg"} alt="Device disconnected." title="Device disconnected.">
    {/if}
    {#if status === "updating"}
        <img id="disconnectIcon" src={"../src/Images/Icons/Warning.svg"} alt="Device updating." title="Device is updating firmware.">
    {/if}
    {#if status === "outdated"}
        <img id="disconnectIcon" src={"../src/Images/Icons/Warning.svg"} alt="Device outdated." title="Device software outdated.">
    {/if}
</div>

<style>
    .DevTileWrap {
        position: relative;
        display: inline-flex;
    }

    .HoverOpt {
        position: absolute;
        top: 3px;
        right: 33px;
        opacity: 0;
    }

    .HoverOptIcon {
        float: right;
    }

    .DevTileWrap:hover .HoverOpt{
        opacity: 1;
    }

    .DeviceTile:focus .HoverOpt{
        opacity: 1;
    }

    .HoverOpt:focus {
        opacity: 1;
    }

    .HoverOpt:focus-within {
        opacity: 1;
    }

    .HoverOpt > div {
        display: none;
        font-size: 10px;
    }

    .HoverOpt:focus-within {
        display: block;
    }

    .HoverOpt:hover > div {
        display: block;
        margin-top: 30px;
    }

    .HoverOpt:focus-within > div {
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

    .DeviceTile:focus-visible {
        outline: darkorange solid 3px;
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

    button {
        background-color: var(--background-gray);
        color: white;
        border: none;
        border-radius: 3px;
    }

    button:focus {
        outline: white solid 2px;
    }
</style>