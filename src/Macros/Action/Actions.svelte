<script lang="ts">
    import {writable} from "svelte/store";
    import {MacroData} from "../Data/macro";
    import {getContext} from "svelte";
    import {getRegistry} from "../Data/action";
    import Action from "./Action.svelte";
    import FloatingPopup from "../../Components/FloatingPopup.svelte";

    let macro: writable<MacroData> = getContext("wipMacro");

    $macro.actions = [];

    $: console.log($macro.actions);

    let popupIsShowing = false;

    let mouseX = 0;
    let mouseY = 0;

    let showPopup = (event) => {
        popupIsShowing = true;

        mouseX = event.clientX;
        mouseY = event.clientY + scrollY;
    }

    let selectAction = (actionData) => {
        popupIsShowing = false;

        $macro.actions = [...$macro.actions, actionData]
    }
</script>

<main>
    <ul>
        {#if $macro.actions}
            {#each $macro.actions as actionData, i}
                <li>
                    <Action bind:action={actionData} ordinal={i}/>
                </li>
            {/each}
        {:else}
            Nothing
        {/if}
    </ul>

    <button on:click={showPopup}>Add New Action</button>

    {#if popupIsShowing}
        <FloatingPopup x={mouseX} y={mouseY}>
            Pick an Action To Add
            {#each getRegistry() as actionData}
                <button on:click={() => {selectAction(actionData)}}>{actionData.displayName}</button>
            {/each}
        </FloatingPopup>
    {/if}
</main>

<style>
    li {
        list-style: none;
    }
</style>