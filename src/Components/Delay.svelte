<script>
    import { onMount } from "svelte";


    export let time = 1000;
    let show = false;
    onMount(() => {
        setTimeout(()=>{show = true;}, time);
    })
</script>

{#if show}
    <slot></slot>
{/if}