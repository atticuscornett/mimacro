<script lang="ts">
    import type {Action} from "../Data/action";
    import IconMinus from "@tabler/icons-svelte/dist/svelte/icons/IconMinus.svelte"
    import IconArrowBarToUp from "@tabler/icons-svelte/dist/svelte/icons/IconArrowBarToUp.svelte"
    import IconArrowBarToDown from "@tabler/icons-svelte/dist/svelte/icons/IconArrowBarToDown.svelte"
    import {getPrimaryThemeColor} from "../../utilities";
    import {createEventDispatcher} from "svelte";

    export let action: Action;

    let iconColor = getPrimaryThemeColor();
    let iconSize = 15;
    let iconStroke = 4;

    const dispatch = createEventDispatcher();

    export let ordinal: number;
</script>

<div class="action">
    {ordinal + 1}. {action.displayName}

    <div class="buttons">
        <button on:click={() => dispatch('delete')}>
            <IconMinus color={iconColor} size={iconSize} stroke={iconStroke}/>
        </button>
        <button on:click={() => dispatch('shiftup')}>
            <IconArrowBarToUp color={iconColor} size={iconSize} stroke={iconStroke}/>
        </button>
        <button on:click={() => dispatch('shiftdown')}>
            <IconArrowBarToDown color={iconColor} size={iconSize} stroke={iconStroke}/>
        </button>
    </div>
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

    .buttons > button:hover {
        filter: brightness(150%);
    }

    @media (prefers-color-scheme: light) {
        .buttons > button {
            background: white;
        }
    }

    .action {
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