<script lang="ts">
    import {MacroData} from "../Data/macro";
    import {writable} from "svelte/store";
    import {getContext} from "svelte";

    export let macro: MacroData;

    let macros: writable<MacroData[]> = getContext("macros");

    const close = () => {
        $macros = $macros.filter(m => m.uuid !== macro.uuid);
    }
</script>

<main>
    <div class="header">
        <h3>{macro.name}</h3>
        <button class="unselectable" on:click={close}><img src="../src/Images/Icons/Close.svg"></button>
    </div>

    <hr>
    <p>
        Device: {macro.device.nickname}

        <br>

        {macro.part.name + " " + macro.trigger.name} at {macro.trigger.pin.type} Pin {macro.trigger.pin.pinNumber}
    </p>
</main>

<style>
    main {
        text-transform: capitalize;
    }

    main {
        background-color: var(--primary-blue);
        color: white;
        padding: 10px;
        border-radius: 5px;
        width: 75%;

        margin: 5px 5px 5px 0;
    }

    h3 {
        margin-top: 0;
    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    button {
        border: none;
        background: none;
    }

    button:active {
        background: none;
        border: none;
    }
</style>