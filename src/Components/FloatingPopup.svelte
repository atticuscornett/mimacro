<script>
    import {afterUpdate, onDestroy, onMount} from "svelte";
    import {get_current_component} from "svelte/internal";

    export let x;
    export let y;
    export let show;
    export let clickOut = true;
    export let maxWidth;

    // Allows for multiple floating popups at the same time
    let popupID = Math.floor(Math.random() * 10000);

    let clickListener = (event) => {
        if (show && clickOut){
            // Check if the popup has been clicked out of
            let popup = document.getElementById("floatPopup" + popupID);
            if (popup == null){
                return;
            }
            let clickedObj = event.target;
            if (clickedObj !== popup && !popup.contains(clickedObj)){
                show = false;
            }
        }
    };

    let placePopup = () => {
        let modX = x;
        let modY = y;
        let popup = document.getElementById("floatPopup" + popupID);
        if (popup == null){
            return;
        }
        if (maxWidth){
            popup.style.maxWidth = maxWidth;
        }
        if ((Number(x) + popup.offsetWidth) > window.innerWidth){
            modX -= popup.offsetWidth;
        }
        if (Number(modX) + popup.offsetWidth > window.innerWidth){
            modX = window.innerWidth - 10 - popup.offsetWidth;
        }
        if ((Number(y) + popup.offsetHeight) > (window.innerHeight + window.scrollY)){
            modY -= popup.offsetHeight;
        }
        popup.style.left = modX + "px";
        popup.style.top = modY + "px";
    };

    onDestroy(() => {document.removeEventListener("click", clickListener)});
    onresize = placePopup;

    $: {
        if (show){
            placePopup();
            setTimeout(() => {document.addEventListener("click", clickListener);}, 10);
        }
        else{
            document.removeEventListener("click", clickListener);
        }
    }
</script>
{#if show}
    <div class="floatPopup" id={"floatPopup"+popupID} use:placePopup>
        <slot></slot>
    </div>
{/if}
<style>
    .floatPopup {
        background-color: var(--background-gray);
        position: absolute;
        width: max-content;
        z-index: 9999;

        border-radius: 15px;
        padding: 15px;
    }

    @media (prefers-color-scheme: light) {
        .floatPopup {
            background-color: white;
        }
    }
</style>