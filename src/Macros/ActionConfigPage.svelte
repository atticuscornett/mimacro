<script lang="ts">
    import {getContext, onMount} from "svelte";
    import type {MacroData} from "./Data/macro";
    import {writable} from "svelte/store";
    import type {Action} from "./Data/action";
    import SubmitButton from "../Components/SubmitButton.svelte";

    const macroStore: writable<MacroData> = getContext("wipMacro");

    let action: Action = $macroStore.action;

    export let canProgress: boolean;
    canProgress = false;

    export let canRegress: boolean;
    export let canLeave: boolean;

    export let onProgress: () => void;
    onProgress = () => {
        if (action.ui) {
            $macroStore.action = action;
        }
    }

    export let next: () => void;

    // If there is no ui for this action just go to the next page
    onMount(() => {
        if (!action.ui) {
            canProgress = true;
            next();
            console.log("Tried to leave");
        }
    })
</script>

{#if action.ui}
    <h1>Configure Your Macro's Action</h1>

    <svelte:component this={action.ui}
                      bind:canProgress={canProgress}
                      bind:canRegress={canRegress}
                      bind:canLeave={canLeave}

                      bind:action={action}
    />
{/if}

<SubmitButton disabled={!canProgress || !canLeave} on:submit={next}/>