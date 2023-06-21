<script lang="ts">
    import type {MacroData} from "./macro";
    import {type ArduinoDevice, devices} from "./device";
    import {getPart, Part, TriggerData} from "./triggerData";
    import {parts, getPopulatedPins, Pin, pinToString, pinFromString} from "./pin";
    import {capitalize} from "../utilities";
    import {Action, getRegistry} from "./action";
    import {v4 as uuidv4} from 'uuid'

    export let macros: MacroData[];
    export let showingCreator: boolean;

    const close = () => { showingCreator = false };

    let macroName: string;
    let device: ArduinoDevice;

    let trigger: TriggerData = {
        action: undefined,
        name: "",
        pin: undefined

    };
    let action: Action;
    let pin: Pin;

    $: {
            trigger.pin = pin
    }
    $: {
            trigger.action = action;
    }

    let part: Part;

    $: device = devices.filter(device => device.serialNumber == selectedDeviceSerial)[0];
    let selectedDeviceSerial: string;

    let populatedPins: Pin[];
    $: populatedPins = getPopulatedPins(device);

    $: {
        if (pin)
            part = getPart(pin.part);
    }

    // digital pin 0 part Nothing
    let stringPin: string = "d0p0";
    $: pin = pinFromString(stringPin);

    let selectedActionIndex;
    $: action = getRegistry()[selectedActionIndex];

    function checkCanLeave(trigger: TriggerData, action: Action, pin: Pin, macroName: string, device: ArduinoDevice, part: Part): boolean {
        if (!trigger) return false;
        if (!trigger.name) return false;
        if (!action) return false;
        if (!pin) return false;

        if (!macroName) return false;

        if (!device) return false;

        if (!part) return false;

        return true;
    }

    let canLeave: boolean;
    $: canLeave = checkCanLeave(trigger, action, pin, macroName, device, part);
    $: console.log(canLeave);

    function submit(): void {
        console.log("submitted")

        let result: MacroData = {
            name: macroName,
            device: device,
            part: part,
            trigger: trigger,
            uuid: uuidv4()
        }

        macros = [...macros, result]

        console.log(result);

        electronAPI.saveMacro(result);

        close()
    }
</script>

<main>
    <div class="window">
        <h1>Create a Macro</h1>
        <button class="close-button unselectable" on:click={close}><img src="../src/Images/Icons/Close.svg"></button>

        <div class="content-pane">
            <div>
                <div>
                    <label for="name-field">Macro Name</label>
                    <input bind:value={macroName} id="name-field" type="text" placeholder="Macro name...">
                </div>

                <div>
                    <label for="device">Device</label>
                    <select bind:value={selectedDeviceSerial} id="device">
                        <option disabled selected hidden></option>
                        {#each devices as device, i}
                            <option value={device.serialNumber}>{device.nickname}</option>
                        {/each}
                    </select>
                </div>

                <div>
                    <label for="pin">Pin</label>
                    <select bind:value={stringPin} id="pin">
                        {#each populatedPins as pin}
                            <option value={pinToString(pin)}>
                                {parts.filter(part => part.id === pin.part.toString())[0].name}
                                at {capitalize(pin.type)} Pin {pin.pinNumber}
                            </option>
                        {/each}
                    </select>
                </div>

                <div>
                    <label for="trigger">Trigger</label>
                    <select bind:value={trigger.name} id="trigger">
                        {#if pin}
                            {@const part = getPart(pin.part)}
                            {#if part}
                                {#each part.triggers as trigger}
                                    <option value={trigger.name}>
                                        {trigger.name}
                                    </option>
                                {/each}
                            {/if}
                        {/if}
                    </select>
                </div>

                <div>
                    <label for="action">Action</label>
                    <select bind:value={selectedActionIndex} id="action">
                        {#each getRegistry() as action, i}
                            <option value={i}>{action.name}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <div>
                {#if action}
                    <svelte:component bind:canLeave={canLeave} bind:action={action} this={action.ui}></svelte:component>
                {/if}
            </div>

            <button on:click={submit} disabled={canLeave ? "" : "disabled"} class="submit-button unselectable">Create Macro</button>
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
        display: grid;
        flex-direction: column;
        height: 100%;
        grid-template-columns: 1fr;
        grid-template-rows: 2fr 2fr 1fr;
        justify-items: start;
    }

    .submit-button {
        position: absolute;
        bottom: -24px;
        background-color: var(--primary-blue);
        color: white;
        width: 40%;
        align-self: center;
        border-radius: 30px;
        font-size: larger;
        font-weight: 600;
        margin: 5px;
        justify-self: center;
    }

    .submit-button[disabled="disabled"] {
        background-color: #23CE6B;
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
</style>