<script lang="ts">
    import {MacroData} from "./macro";

    export let macro: MacroData;

    export let macros: MacroData[] = [];

    const close = () => {
        console.log(macro.uuid);
        macros = macros.filter((m) => m.uuid !== macro.uuid)
        electronAPI.removeMacro(macro.uuid);
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

        {macro.part.name + " " + macro.trigger.name} at {macro.trigger.pin.type} pin {macro.trigger.pin.pinNumber}
    </p>
</main>

<style>
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