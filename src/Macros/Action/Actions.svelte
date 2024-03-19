<script lang="ts">
    import type {Action as ActionData} from "../Data/action"
    import {getRegistry} from "../Data/action";
    import Action from "./Action.svelte";
    import Popup from "../../Components/Popup.svelte";

    export let actions: ActionData[] = [];

    export let canLeave: boolean = true;
    $: {
        canLeave = actionDefinedList.every(b => b);
    }

    let actionDefinedList: boolean[] = []

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

        actions = [...actions, JSON.parse(JSON.stringify(actionData))];
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

    let availableActions: { [x: string]: ActionData[] } = {}
    getRegistry().then((actions) => {
        actions.forEach(action => {
            let plugin = availableActions[action.pluginId];

            if (plugin == null) {
                plugin = [];
            }

            plugin.push(action);

            availableActions[action.pluginId] = plugin;
        })
    });

    async function getPluginDisplayName(pluginId: string): Promise<string> {
        let plugin = await electronAPI.getPlugin(pluginId);

        return plugin.pluginName;
    }

    console.log(availableActions);
</script>

<main>
    <div class="header">
        <h2>Actions</h2>
        <button on:click={showPopup}><img alt="Add an Action" src="../src/Images/Icons/New.svg"></button>
    </div>

    <hr>

    <ul class="actions" style="margin-bottom: 60px">
        {#if actions.length > 0}
            {#each actions as actionData, i}
                <li>
                    <Action bind:action={actionData} ordinal={i} bind:fullyDefined={actionDefinedList[i]}
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

    <Popup bind:show={popupIsShowing} style="overflow-x: hidden">
        <h2 style="margin-top: 5px;">Pick an Action To Add</h2>

        {#each Object.entries(availableActions) as [pluginId, actions]}
            {#await getPluginDisplayName(pluginId)}
                loading...
            {:then name}
                <details>
                    <summary>{name}</summary>

                    <div class="available-actions">
                        <ul>
                            {#each actions as action}
                                <li style="width: calc(100% - 50px)">
                                    <button
                                            class="available-action"
                                            on:click={() => selectAction(action)}
                                    >
                                        {action.displayName}
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    </div>
                </details>
            {:catch error}
                {error.message}
            {/await}
        {/each}
    </Popup>
</main>

<style>
    .available-actions {
        display: flex;
        flex-direction: column;
    }

    .available-actions > ul {
        width: 100%;
    }

    .available-action {
        border: none;
        background: none;
        color: white;
        text-align: justify;
        font-size: medium;
        margin-bottom: 5px;
    }

    button {
        width: 100%;
    }

    .available-action:hover {
        background: rgba(92, 88, 88, 0.1);
    }

    summary {
        background-color: var(--primary-blue);
        padding: 15px;
        font-size: large;
        cursor: pointer;
        border-radius: 10px;
    }

    details {
        margin-bottom: 20px;
    }

    details[open] {
        background-color: var(--background-gray);
        border-radius: 10px;
    }

    .actions {
        list-style-type: none;
        padding-left: 0;
    }

    .header {
        display: flex;
    }

    .header > button {
        margin-left: 5px;
        background: none;
        border: none;
        margin-bottom: 0;
        padding-bottom: 0;
        width: 45px;
    }

    .header > button > img {
        width: 100%;
    }

    button:focus-visible {
        outline: dashed orange 2px;
    }
</style>