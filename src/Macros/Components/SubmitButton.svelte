<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let disabled: boolean;
</script>

<button disabled={disabled} on:click={() => dispatch("submit")}>Submit</button>

<style>
    button {
        width: 300px;
        border-radius: 15px;
        background-color: var(--secondary-blue);
        color: white;
        border: none;
        -moz-user-select: none;
        -webkit-user-select: none;

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