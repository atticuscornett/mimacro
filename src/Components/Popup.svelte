<script>
    import {onDestroy, onMount} from "svelte";

    onMount(() => {if(show){document.body.style.overflowY = "hidden";}});
    onDestroy(() => {document.body.style.overflowY = "auto";});

    $: {
        if (show){
            document.body.style.overflowY = "hidden";
        }
        else{
            document.body.style.overflowY = "auto";
        }
    }

    export let show = true;
    export let style = "";

    function hide(){
        if (show instanceof String){
            show="";
        }
        else{
            show=false;
        }
    }
</script>

{#if show}
    <div class="container" on:click={hide}>
        <div class="popup" on:click={(event) => {event.stopPropagation();}} style="{style}">
            <slot></slot>
        </div>
    </div>
{/if}

<style>
    .container {
        top: 0;
        left: 0;

        position: fixed;

        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, .75);

        backdrop-filter: blur(5px);

        z-index: 9999;
    }

    .popup {
        width: 75%;
        height: 75%;

        top: 50%;
        left: 50%;

        translate: -50% -50%;

        position: absolute;

        background-color: var(--background-gray);

        border-radius: 10px;

        padding: 20px;

        overflow-y: auto;
    }

    @media (prefers-color-scheme: light) {
        .popup {
            background-color: rgba(255, 255, 255, 0.75);
        }
    }

    @media (prefers-color-scheme: dark) {
        .popup {
            background-color: rgba(255, 255, 255, 0.1);
        }
        .container{
            background-color: rgba(0, 0, 0, 0.9);
        }
    }
</style>