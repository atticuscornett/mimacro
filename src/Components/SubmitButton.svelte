<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let disabled: boolean;

    export let top: number;
    export let bottom: number;
    export let left: number;
    export let right: number;

    let absolute = false;
    $: absolute = (top != null || bottom != null || left != null || right != null);
</script>

<button
        disabled={disabled}
        on:click={() => dispatch("submit")}
        style="position: {absolute ? 'absolute' : 'static'}; top: {top}px; bottom: {bottom}px; left: {left}px; right: {right}px; margin: 10px;"
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

        pointer-events: none;
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