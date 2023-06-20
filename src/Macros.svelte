<script lang="ts">
    import Macro from "./Macros/Macro.svelte";
    import MacroCreator from "./Macros/MacroCreator.svelte";
    import type {MacroData} from "./Macros/macro";
    import {EXAMPLE_DEVICE} from "./Macros/device";
    import {EXAMPLE_PART, EXAMPLE_TRIGGER} from "./Macros/triggerData";

    let showingCreator = false;

    let macros: MacroData[] = [
        {
            name: "Macro 1",
            device: EXAMPLE_DEVICE,
            trigger: EXAMPLE_TRIGGER,
            part: EXAMPLE_PART
        },

        {
            name: "Macro 2",
            device: EXAMPLE_DEVICE,
            trigger: EXAMPLE_TRIGGER,
            part: EXAMPLE_PART
        },

        {
            name: "Macro 3",
            device: EXAMPLE_DEVICE,
            trigger: EXAMPLE_TRIGGER,
            part: EXAMPLE_PART
        },
    ]

    const createMacro = () => {
        showingCreator = true;
    }
</script>

<main>
    <div class="header">
        <h1>Macros</h1>
        <button class="macro-button" on:click={createMacro}><img src="../src/Images/Icons/New.svg"></button>
    </div>

    {#if showingCreator}
        <MacroCreator bind:macros={macros} bind:showingCreator={showingCreator} />
    {/if}

    <ul>
        {#if macros.length === 0}
            <h3>There are no macros... Try creating one!</h3>
        {:else}
            {#each macros as macro, i}
                <li><Macro bind:macros={macros} index={i} macro={macro}/></li>
            {/each}
        {/if}
    </ul>

</main>

<style>
    ul {
        list-style-type: none;
        margin: 0;
        padding-left: 0;

        display: flex;
        flex-direction: column;
    }

    main {
        margin: 5px;
    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }


    .macro-button {
        background: none;
        border: none;
    }

    .macro-button:active {
        transform: scale(95%);
        background: none;
        border: none;
    }

    @media (prefers-color-scheme: light) {
        .macro-button {
            background-color: var(--primary-blue);
            width: 50px;
            height: 50px;

            padding: 10px;

            border-radius: 50%;
        }

        .macro-button > img {
            width: 100%;
        }

        .macro-button:active {
            background-color: var(--primary-blue);
        }
    }
</style>