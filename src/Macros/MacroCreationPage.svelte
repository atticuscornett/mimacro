<script lang="ts">
    import type {MacroData} from "./Data/macro";
    import {type ArduinoDevice, devices} from "./Data/device";
    import {getPart, Part, TriggerData} from "./Data/triggerData";
    import {getPopulatedPins, parts, Pin, pinFromString, pinToString} from "./Data/pin";
    import {capitalize} from "../utilities";
    import {Action, getRegistry} from "./Data/action";
    import {v4 as uuidv4} from 'uuid'
    import {getContext} from "svelte";
    import {writable} from "svelte/store";

    export let canRegress: boolean;
    canRegress = true;

    let macros: writable<MacroData[]> = getContext("macros");
    export let showingCreator: boolean;

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
    $: console.log(canProgress);

    export let onProgress: () => void
    onProgress = () => {
        console.log("submitted")

        let result: MacroData = {
            name: macroName,
            device: device,
            part: part,
            trigger: trigger,
            uuid: uuidv4()
        }

        $macros = $macros.concat([result]);
    }
</script>

<main>
    <h1>Create a Macro</h1>

    <h2>Macro Data</h2>
    <hr>
    <div class="content-pane">
        <div>
            <label for="name-field">Macro Name</label>
            <input bind:value={macroName} id="name-field" type="text" placeholder="Macro name...">
        </div>

        <p>
            When
            <select class="dropdown" bind:value={selectedDeviceSerial} id="device">
                <option disabled selected hidden></option>
                {#each devices as device, i}
                    {#if getPopulatedPins(device).length > 0}
                        <option value={device.serialNumber}>{device.nickname}</option>
                    {/if}
                {/each}
            </select>

            receives a signal

            <br>

            from
            <select class="dropdown" bind:value={stringPin} id="pin">
                {#each populatedPins as pin}
                    <option value={pinToString(pin)}>
                        {parts.filter(part => part.id === pin.part.toString())[0].name}
                        at {capitalize(pin.type)} Pin {pin.pinNumber}
                    </option>
                {/each}
            </select>

            then

            <br>

            when trigger

            <select class="dropdown" bind:value={trigger.name} id="trigger">
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

            's condition is met then

            <br>

            run

            <select class="dropdown" bind:value={selectedActionIndex} id="action">
                {#each getRegistry() as action, i}
                    <option value={i}>{action.name}</option>
                {/each}
            </select>
        </p>
    </div>
</main>

<style>
    h1 {
        margin-top: 6px;
    }

    .content-pane {
        display: flex;
    }

    .dropdown {
        position: relative;
        display: inline-block;
        background-color: var(--background-gray);
        border-radius: 15px;
        min-width: 200px;
        border: var(--primary-blue) 2px solid;
        color: white;
        padding: 9px;
    }

    button {
        border: none;
    }
</style>