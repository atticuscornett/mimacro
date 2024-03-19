<script lang="ts">
    import type {Action, UIComponent} from "../Data/action";
    import {isActionFullyDefined} from "../Data/action";
    import IconMinus from "@tabler/icons-svelte/dist/svelte/icons/IconMinus.svelte"
    import IconArrowBarToUp from "@tabler/icons-svelte/dist/svelte/icons/IconArrowBarToUp.svelte"
    import IconArrowBarToDown from "@tabler/icons-svelte/dist/svelte/icons/IconArrowBarToDown.svelte"
    import {getPrimaryThemeColor} from "../../utilities";
    import {createEventDispatcher} from "svelte";
    import Popup from "../../Components/Popup.svelte";
    import {v4} from "uuid";

    export let action: Action;

    let iconColor = getPrimaryThemeColor();
    let iconSize = 15;
    let iconStroke = 4;

    const dispatch = createEventDispatcher();

    export let ordinal: number;

    action.metaData = {};
    let actionUUID = v4();
    action.id += actionUUID;

    action.ui.forEach((uiComponent: UIComponent) => {
        uiComponent.id = uiComponent.id + actionUUID;

        if (uiComponent.required == null) {
            uiComponent.required = true;
        }

        if (uiComponent.type === "checkbox") {
            // If a checkbox is set to required things get WACKY, so we just make sure that never ever happens
            uiComponent.required = false;

            // Checkboxes must default to not being checked
            action.metaData[uiComponent.id] = false;
        }
    })

    export let fullyDefined = false;
    $: {
        if (!fullyDefined) {
            fullyDefined = isActionFullyDefined(action);
        }
    }

    $: {
        let values = Object.values(action.metaData);
        for (let i = 0; i < values.length; i++) {
            let value = JSON.stringify(values[i]);

            let required = action.ui[i].required;

            if (!required) continue;
            if (value.length > 0) continue;

            fullyDefined = false;
        }
    }

    let showPopup = false;
</script>

<div>
    <div class="action" on:click={() => showPopup = true}
         on:keydown={() => {}}>
        <div style="display: inline-flex; align-items: inherit;">
            {ordinal + 1}. {action.displayName}

            {#if !fullyDefined}
                <img style="width: 30px; padding-left: 15px;" src="../src/Images/Icons/Error.svg"
                     alt="Action Not Fully Defined">
            {/if}
        </div>

        <div class="buttons">
            <button on:click={(e) => {
                e.stopPropagation();
                dispatch('delete');
            }}>
                <IconMinus color={iconColor} size={iconSize} stroke={iconStroke}/>
            </button>

            <button on:click={(e) => {
                e.stopPropagation();
                dispatch('shiftup');
            }}>
                <IconArrowBarToUp color={iconColor} size={iconSize} stroke={iconStroke}/>
            </button>

            <button on:click={(e) => {
                e.stopPropagation();
                dispatch('shiftdown');
            }}>
                <IconArrowBarToDown color={iconColor} size={iconSize} stroke={iconStroke}/>
            </button>
        </div>
    </div>

    {#if action.ui.length > 0}
        <Popup bind:show={showPopup}>
            <div class="popup">
                {#each action.ui as {type, id, label, options}}
                    <h3>{label}</h3>

                    {#if type === "string"}
                        <input id={id} bind:value={action.metaData[id]} type="text">
                    {:else if type === "number"}
                        <input id={id} bind:value={action.metaData[id]} type="number">
                    {:else if type === "options-select"}
                        <select id={id} bind:value={action.metaData[id]}>
                            <option hidden disabled selected></option>

                            {#each options as option}
                                <option value={option}>{option}</option>
                            {/each}
                        </select>
                    {:else if type === "checkbox"}
                        <input id={id} bind:checked={action.metaData[id]} type="checkbox">
                    {:else}
                        The type property for this UIComponent is not one of the acceptable types. Please try again and
                        see the documentation.
                    {/if}
                {/each}

                <button class="popup-close" on:click={() => showPopup = false}>
                    <img src="../src/Images/Icons/Close.svg" alt="Close">
                </button>
            </div>
        </Popup>
    {/if}
</div>

<style>
    .popup-close {
        position: absolute;
        top: 0;
        right: 0;
        margin: 10px;
        background: none;
        border: none;
    }

    .popup-close > img {
        width: 40px;
    }

    .buttons {
        display: inline-flex;
        opacity: 0;
    }

    .buttons > button {
        margin: 5px;
        width: 35px;
        height: 35px;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        background: var(--background-gray);
        border: none;
    }

    .buttons > button:hover {
        filter: brightness(150%);
    }

    @media (prefers-color-scheme: light) {
        .buttons > button {
            background: white;
        }
    }

    .action {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding-left: 15px;
        border-radius: 5px;
    }

    .action:hover .buttons {
        opacity: 1;
    }

    .buttons:focus-within {
        opacity: 1;
    }

    .action:hover {
        background: var(--background-gray);
    }

    button:focus-visible {
        outline: dashed orange 2px;
    }
</style>