<script lang="ts">
    import {writable} from "svelte/store";
    import {MacroData} from "../Data/macro";
    import {getContext} from "svelte";
    import {Action as ActionData, getRegistry} from "../Data/action";
    import Action from "./Action.svelte";
    import FloatingPopup from "../../Components/FloatingPopup.svelte";

    let macro: writable<MacroData> = getContext("wipMacro");

    $macro.actions = [];

    let actions: ActionData[] = $macro.actions;
    $: $macro.actions = actions;

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

        actions = [...actions, actionData]
    }

    function deleteAction(index: number): void {
        actions = actions.filter((a, i) => i !== index);
    }

    function insertAction(idIndex: number, index: number): void {
        let action = actions[idIndex];

        actions = [
            ...actions.slice(0, index),
            action,
            ...actions.slice(index),
        ]
    }

    function shiftActionUp(index: number): void {
        if (index === 0 || index >= actions.length) return;

        insertAction(index, index - 1);

        deleteAction(index + 1)
    }
</script>

<main>
    <ul>
        {#if $macro.actions}
            {#each $macro.actions as actionData, i}
                <li>
                    <Action bind:action={actionData} ordinal={i}
                            on:delete={() => deleteAction(i)}
                            on:shiftup={() => shiftActionUp(i)}
                            on:shiftdown={() => shiftActionUp(i + 1)}
                    />
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