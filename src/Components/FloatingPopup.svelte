<script>
    import {onMount} from "svelte";

    export let x;
    export let y;

    let placePopup = () => {
        let modX = x;
        let modY = y;
        let popup = document.getElementById("floatPopup");
        if ((Number(x) + popup.offsetWidth) > window.innerWidth){
            modX -= popup.offsetWidth;
        }
        if ((Number(y) + popup.offsetHeight) > (window.innerHeight + window.scrollY)){
            modY -= popup.offsetHeight;
        }
        popup.style.left = modX + "px";
        popup.style.top = modY + "px";
    };
    onMount(placePopup);
    onresize = placePopup;
</script>
<div class="floatPopup" id="floatPopup">
    <slot></slot>
</div>
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