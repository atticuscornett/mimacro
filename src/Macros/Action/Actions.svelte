<script lang="ts">
    import type {Action as ActionData} from "../Data/action"
    import {getRegistry} from "../Data/action";
    import Action from "./Action.svelte";
    import FloatingPopup from "../../Components/FloatingPopup.svelte";

    export let actions: ActionData[] = [];

    $: {
        console.log(actions);
    }

    let popupIsShowing = false;

    let mouseX = 0;
    let mouseY = 0;

    let showPopup = (event) => {
        popupIsShowing = true;

        mouseX = event.clientX;
        mouseY = event.clientY + scrollY;
    }

    let selectAction = (actionData: ActionData) => {
        popupIsShowing = false;

        // actions.push(actionData);
        // actions = actions;

        actions = [...actions, actionData];
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

    let availableActions: ActionData[] = [];
    getRegistry().then((p) => availableActions = p);
</script>

<main>
    <ul class="actions">
        {#if actions.length > 0}
            {#each actions as actionData, i}
                <li>
                    <Action bind:action={actionData} ordinal={i}
                            on:delete={() => deleteAction(i)}
                            on:shiftup={() => shiftActionUp(i)}
                            on:shiftdown={() => shiftActionUp(i + 1)}
                    />
                </li>
            {/each}
        {:else}
            You have not selected any actions for this Macro! You must define at least one action.
        {/if}
    </ul>

    <button on:click={showPopup}>Add New Action</button>

    <FloatingPopup bind:show={popupIsShowing} x={mouseX} y={mouseY}>
        <h2 style="margin-top: 5px;">Pick an Action To Add</h2>

        <ul class="available-actions">
            {#each availableActions as actionData}
                <li>
                    <button class="available-action"
                            on:click={() => {selectAction(actionData)}}>{actionData.displayName}</button>
                </li>
            {/each}
        </ul>
    </FloatingPopup>
</main>

<style>
    .available-actions {
        display: flex;
        flex-direction: column;
        max-height: 250px;
        overflow: auto;
    }

    .available-action {
        left: 110px;
        top: 453px;
        display: flex;
        flex-direction: column;
        padding: 15px;
        background-color: var(--background-gray);
        color: white;
        border: none;
        font-size: large;
        max-height: 500px;
    }

    .actions {
        list-style-type: none;
        padding-left: 0;
    }

    li:has(> .available-action) {
        font-size: x-large;
    }
</style>