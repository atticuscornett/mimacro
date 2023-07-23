<script lang="ts">
    import type {MacroData} from "./Data/macro";
    import {type ArduinoDevice, devices} from "./Data/device";
    import {getPart, Part, TriggerData} from "./Data/triggerData";
    import {getPopulatedPins, parts, Pin, pinFromString, pinToString} from "./Data/pin";
    import {Action, getRegistry} from "./Data/action";
    import {v4 as uuidv4} from 'uuid'
    import {getContext} from "svelte";
    import {writable} from "svelte/store";
    import SubmitButton from "../Components/SubmitButton.svelte";

    export let next: () => void;

    export let canRegress: boolean;
    canRegress = true;

    let macro: writable<MacroData> = getContext("wipMacro");

    let macroName: string;
    let device: ArduinoDevice;

    let trigger: TriggerData = {
        name: "",
        pin: undefined

    };

    let action: Action;
    let pin: Pin;

    $: {
        trigger.pin = pin
    }

    let part: Part;

    $: {
        device = devices.filter(device => device.serialNumber == selectedDeviceSerial)[0];
    }
    let selectedDeviceSerial: string;

    let populatedPins: Pin[];
    $: {
        populatedPins = getPopulatedPins(device);
        console.log("Recalculated the `populatedPins` variable")
    }

    $: {
        if (pin)
            part = getPart(pin.part);
    }

    // digital pin 0 part Nothing
    let stringPin: string = "d0p0";
    $: pin = pinFromString(stringPin);

    let selectedActionIndex;
    $: action = getRegistry()[selectedActionIndex];

    function checkCanProgress(trigger: TriggerData, action: Action, pin: Pin, macroName: string, device: ArduinoDevice, part: Part): boolean {
        if (!trigger) return false;
        if (!trigger.name) return false;
        if (!action) return false;
        if (!pin) return false;

        if (!macroName) return false;

        if (!device) return false;

        if (!part) return false;

        return true;
    }

    export let canProgress: boolean;
    $: canProgress = checkCanProgress(trigger, action, pin, macroName, device, part);

    export let onProgress: () => void
    onProgress = () => {
        let result: MacroData = {
            name: macroName,
            device: device,
            part: part,
            trigger: trigger,
            action: action,
            uuid: uuidv4()
        }

        console.log("Submitted Macro: " + JSON.stringify(result));

        $macro = result;
    }
</script>

<main>
    <h1>Macro Data</h1>
    <div class="content-pane">
        <div>
            <label for="name-field">Macro Name</label>
            <input bind:value={macroName} id="name-field" type="text" placeholder="Macro name...">
        </div>

        <h2>Create a Macro</h2>
        <hr>
        <p>
            When
            <select bind:value={selectedDeviceSerial} class="dropdown" id="device-dropdown">
                <!-- Empty option that you can't reselect -->
                <option disabled selected hidden></option>

                {#each devices as device}
                    {#if getPopulatedPins(device).length > 0}
                        <option value={device.serialNumber}>{device.nickname}</option>
                    {/if}
                {/each}
            </select>

            receives a signal

            <br>

            from
            <select bind:value={stringPin} class="dropdown" disabled={populatedPins.length < 1} id="pin-dropdown">
                {#each populatedPins as pin}
                    <option value={pinToString(pin)}>
                        {parts.filter(part => part.id === pin.part.toString())[0].name}
                        at {pin.type} pin {pin.pinNumber}
                    </option>
                {/each}
            </select>

            then

            <br>

            when trigger

            <select bind:value={trigger.name} class="dropdown" disabled={!part || part.triggers.length < 1}
                    id="trigger-dropdown">
                {#if part != null}
                    {#each part.triggers as trigger}
                        <option value={trigger.name}>
                            {trigger.name}
                        </option>
                    {/each}
                {/if}
            </select>

            's condition is met then

            <br>

            run

            <select bind:value={selectedActionIndex} class="dropdown" id="action-dropdown">
                {#each getRegistry() as action, i}
                    <option value={i}>{action.name}</option>
                {/each}
            </select>
        </p>
    </div>

    <SubmitButton bottom={0} class="submit-button" disabled={!canProgress} on:submit={next} right={0}/>
</main>

<style>
    :root {
        --highlight: var(--primary-blue);
        --text-color: white;
        --background: var(--background-gray)
    }

    @media (prefers-color-scheme: light) {
        :root {
            --highlight: var(--secondary-blue);
            --text-color: black;
            --background: white;
        }
    }

    h1 {
        margin-top: 6px;
    }

    .submit-button {
        position: absolute;
        bottom: 0;
        right: 0;
        margin: 5px;
    }

    input[type="text"] {
        /* This is the height of the dropdowns */
        height: 44px;

        background-color: var(--background);

        border-radius: 15px;
        border: var(--highlight) 2px solid;

        color: var(--text-color);
    }

    .content-pane {
        display: flex;
        flex-direction: column;
    }

    .content-pane > hr {
        width: 100%;
    }

    .dropdown {
        position: relative;
        display: inline-block;

        cursor: pointer;

        background: var(--background);
        color: var(--text-color);

        border-radius: 15px;
        border: var(--highlight) 2px solid;

        min-width: 200px;
        padding: 9px;

        text-transform: capitalize;
    }

    .dropdown[disabled] {
        border-color: dimgray;
    }

    @media (prefers-color-scheme: light) {
        .dropdown {
            background-color: white;
            color: black;

            border-width: 3px;
            border-color: var(--secondary-blue);
        }

        input[type="text"] {
            background-color: white;
            border-color: var(--secondary-blue);
            color: black;
        }
    }

    button {
        border: none;
    }
</style>