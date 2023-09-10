<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let disabled: boolean;

    export let top: number | undefined = undefined;
    export let bottom: number | undefined = undefined;
    export let left: number | undefined = undefined;
    export let right: number | undefined = undefined;

    export let fixed: boolean;

    let absolute = false;
    $: absolute = (top != null || bottom != null || left != null || right != null);
</script>

<button
        disabled={disabled}
        on:click={() => dispatch("submit")}
        style="position: {
        fixed ? 'fixed' :
        absolute ? 'absolute' : 'static'
        }; top: {top}px; bottom: {bottom}px; left: {left}px; right: {right}px; margin: 10px;"
>Submit
</button>

<style>
    button {
        width: 300px;

        border-radius: 15px;
        border: none;

        background-color: var(--primary-blue);
        color: white;

        font-weight: bold;
    }

    button[disabled] {
        background-color: var(--background-gray);
        opacity: 0.6;
        pointer-events: none;
    }

    @media (prefers-color-scheme: light) {
        button[disabled] {
            background-color: dimgray;
            color: white;
            opacity: 0.6;
        }
    }
</style>