<script lang="ts">
    import Macro from "./Components/Macro.svelte";
    import type {MacroData} from "./Data/macro";
    import {getContext} from "svelte";
    import{ writable} from "svelte/store";

    export let next: () => void;

    let macros: writable<MacroData[]> = getContext("macros");
</script>

<main>
    <div class="header">
        <h1>Macros</h1>
        <button class="macro-button unselectable" on:click={next}><img src="../src/Images/Icons/New.svg"></button>
    </div>

    <ul>
        {#if $macros.length === 0}
            <h3>There are no macros... Try creating one!</h3>
        {:else}
            {#each $macros as macro}
                <li><Macro macro={macro}/></li>
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