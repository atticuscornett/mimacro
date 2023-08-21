<script>
    import {afterUpdate, onDestroy, onMount} from "svelte";
    import {get_current_component} from "svelte/internal";

    export let x;
    export let y;
    export let show;

    let clickListener = (event) => {
        if (show){
            // Check if the popup has been clicked out of
            let popup = document.getElementById("floatPopup");
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
        let popup = document.getElementById("floatPopup");
        if (popup == null){
            return;
        }
        if ((Number(x) + popup.offsetWidth) > window.innerWidth){
            modX -= popup.offsetWidth;
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
    <div class="floatPopup" id="floatPopup">
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