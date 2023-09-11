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
    action.id = v4();

    action.ui.forEach((uiComponent: UIComponent) => {
        uiComponent.id = uiComponent.id + action.id;

        if (uiComponent.required == null) {
            uiComponent.required = true;
        }

        if (uiComponent.type === "checkbox") {
            uiComponent.required = false;
        }
    })

    action.ui.forEach((c) => console.log(c))

    export let fullyDefined = false;
    $: {
        if (!fullyDefined) {
            fullyDefined = isActionFullyDefined(action);
        }
    }

    $: {
        let i = 0;
        for (let metaDataKey in action.metaData) {
            let val: string = action.metaData[metaDataKey].toString();

            console.log(action.ui);
            console.log(i);

            let required = action.ui[i].required;
            i++;

            console.log(required);

            if (required) {
                if (val.length <= 0) {
                    fullyDefined = false;
                }
            }
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
                <img style="width: 30px; padding-left: 15px;" src="../src/Images/Icons/Error.svg" alt="">
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
                    <input id={id} bind:value={action.metaData[id]} type="checkbox">
                {:else}
                    The type property for this UIComponent is not one of the acceptable types. Please try again and see
                    the documentation.
                {/if}
            {/each}
        </div>
    </Popup>
</div>

<style>
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

    .action > button {
        background: none;
        display: flex;
        width: 100%;
        text-align: left;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        color: white;
        border: none;
        margin: 0;
    }

    .action > button:active {
        transform: none;
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

    .action:hover {
        background: var(--background-gray);
    }
</style>