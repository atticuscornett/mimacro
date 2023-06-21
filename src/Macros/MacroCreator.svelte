<script lang="ts">
    import type {MacroData} from "./macro";
    import {type ArduinoDevice, devices, placeholderDevice} from "./device";
    import {getPart, placeholderPart, placeholderTrigger} from "./triggerData";
    import {parts, getPopulatedPins, Pin, pinToString, pinFromString} from "./pin";
    import {capitalize} from "../utilities";

    export let macros: MacroData[];
    export let showingCreator: boolean;

    const close = () => { showingCreator = false };

    let macro: MacroData = {
        name: "Default Macro Name",
        device: placeholderDevice(),
        trigger: placeholderTrigger(),
        part: placeholderPart(),
    };


    let selectedDevice: ArduinoDevice;
    $: selectedDevice = devices.filter(device => device.serialNumber == selectedDeviceSerial)[0];
    let selectedDeviceSerial: string;

    let populatedPins: Pin[];
    $: populatedPins = getPopulatedPins(selectedDevice);

    let stringPin: string;
    $: macro.trigger.pin = pinFromString(stringPin);
</script>

<main>
    <div class="window">
        <h1>Create a Macro</h1>
        <button class="close-button" on:click={close}><img src="../src/Images/Icons/Close.svg"></button>

        <div class="content-pane">
            <div>
                <label for="name-field">Macro Name</label>
                <input bind:value={macro.name} id="name-field" type="text" placeholder="Macro name...">

                <br>

                <label for="device">Device</label>
                <select bind:value={selectedDeviceSerial} id="device">
                    <option disabled selected hidden></option>
                    {#each devices as device, i}
                        <option value={device.serialNumber}>{device.nickname}</option>
                    {/each}
                </select>

                <br>

                <label for="pin">Pin</label>
                <select bind:value={stringPin} id="pin">
                    {#each populatedPins as pin}
                        <option value={pinToString(pin)}>
                            {parts.filter(part => part.id === pin.part.toString())[0].name}
                            at {capitalize(pin.type)} Pin {pin.pinNumber}
                        </option>
                    {/each}
                </select>

                <label for="trigger">Trigger</label>
                <select id="trigger">
                    {#if macro.trigger.pin}
                        {@const part = getPart(macro.trigger.pin.part)}
                        {#each part.triggers as trigger}
                            <option>
                                {trigger.name}
                            </option>
                        {/each}
                    {/if}
                </select>
            </div>

            <button class="submit-button">Create Macro</button>
        </div>
    </div>
</main>

<style>
    main {
        top: 0;
        left: 0;

        position: fixed;

        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, .75);
    }

    h1 {
        margin-top: 6px;
    }

    .window {
        width: 75%;
        height: 75%;

        max-height: 600px;
        min-height: 500px;

        max-width: 700px;
        min-width: 600px;

        top: 50%;
        left: 50%;

        translate: -50% -50%;

        position: absolute;

        background-color: var(--background-gray);

        border-radius: 10px;

        padding: 10px;
    }

    @media (prefers-color-scheme: light) {
        .window {
            background-color: white;
        }
    }

    .content-pane {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .submit-button {
        background-color: var(--primary-blue);
        color: white;
        width: 40%;
        align-self: center;
        border-radius: 30px;
        font-size: larger;
        font-weight: 600;
        margin: 5px;
    }

    .close-button {
        position: absolute;
        top: 0;
        right: 0;
        background: none;
        border: none;

        margin: 10px;
    }

    .close-button > img {
        width: 50px;
    }

    @media(prefers-color-scheme: light) {
        .close-button {
            background-color: var(--primary-blue);
            width: 50px;
            height: 50px;

            padding: 10px;

            border-radius: 50%;
        }

        .close-button > img {
            width: 100%;
        }
    }


    .close-button:active {
        background: none;
    }

    @media(prefers-color-scheme: light) {
        .close-button {
            background-color: var(--primary-blue);
            width: 50px;
            height: 50px;

            padding: 10px;

            border-radius: 50%;
        }

        .close-button > img {
            width: 100%;
        }

        .close-button:active {
            background-color: var(--primary-blue);
        }
    }


    button {
        border: none;
    }

    button:active {
        transform: scale(95%);
    }
</style>