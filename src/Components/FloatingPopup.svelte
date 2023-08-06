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
        if ((Number(y) + popup.offsetHeight) > window.innerHeight){
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
        background-color: white;
        position: absolute;
        width: max-content;
        z-index: 9999;
    }

    @media (prefers-color-scheme: dark){
        .floatPopup {
            background-color: black;
        }
    }
</style>