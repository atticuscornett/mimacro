<script lang="ts">
    import type {MacroData} from "./Data/macro";
    import {type ArduinoDevice, devices} from "./Data/device";
    import type {Part, TriggerData} from "./Data/triggerData";
    import {getPart} from "./Data/triggerData";
    import type {Pin} from "./Data/pin"
    import {getPopulatedPins, parts, pinFromString, pinToString} from "./Data/pin";
    import {Action} from "./Data/action";
    import {v4 as uuidv4} from 'uuid'
    import {getContext} from "svelte";
    import type {Writable} from "svelte/store";
    import SubmitButton from "../Components/SubmitButton.svelte";
    import Actions from "./Action/Actions.svelte";

    export let next: () => void;

    export let canRegress: boolean;
    canRegress = true;

    let macro: Writable<MacroData> = getContext("wipMacro");

    let macroName: string;
    let device: ArduinoDevice;

    let triggerIndex: number;
    let trigger: TriggerData;

    let actions: Action[];

    trigger = {
        name: "",
        pin: undefined,
        description: "",

        parameters: []
    };

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

    $: {
        if (part) {
            if (triggerIndexDefined()) {
                trigger.parameters = part.triggers[triggerIndex].parameters;
            }
        }
    }

    $: {
        if (part && triggerIndexDefined()) {
            trigger.description = part.triggers[triggerIndex].description;
        }
    }

    $: {
        if (part && triggerIndexDefined())
            trigger.name = part.triggers[triggerIndex].name;
    }

    function triggerIndexDefined(): boolean {
        return triggerIndex != null && triggerIndex != -1;
    }

    // digital pin 0 part Nothing
    let stringPin: string = "d0p0";
    $: pin = pinFromString(stringPin);

    export let canProgress: boolean;
    $: {
        canProgress =
            trigger != null &&
            trigger.name != null &&
            actions != null &&
            actions.length > 0 &&
            pin != null &&
            macroName != null &&
            device != null &&
            part != null;
    }

    export let onProgress: () => void
    onProgress = () => {
        let result: MacroData = {
            name: macroName,
            device: device,
            part: part,
            trigger: trigger,
            actions: actions,
            uuid: uuidv4()
        }

        // console.log($macro.actions);

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

            <select bind:value={triggerIndex} class="dropdown" disabled={!part || part.triggers.length < 1}
                    id="trigger-dropdown">
                <!-- Empty option that you can't reselect -->
                <option disabled hidden selected value={-1}></option>

                {#if part != null}
                    {#each part.triggers as trigger, i}
                        <option value={i}>
                            {trigger.name}
                        </option>
                    {/each}
                {/if}
            </select>

            fires,

            {#if trigger.parameters && trigger.parameters.length > 0}
                {@const splitDescription = trigger.description.split("%p")}

                {splitDescription[0]}

                {#each trigger.description.match(/%p/g) as locale, i}
                    {@const parameter = trigger.parameters[i]}

                    {#if parameter.type === "int"}
                        <input type="number">
                    {:else if parameter.type === "analogInt"}
                        <input type="number">
                    {:else if parameter.type === "boolean"}
                        <input type="checkbox">
                    {/if}

                    {splitDescription[i + 1]}
                {/each}
            {/if}

            run these actions in order:

            <Actions bind:actions={actions}/>
        </p>
    </div>

    <div class="submit-button">

        <SubmitButton bottom={0}
                      disabled={!canProgress}
                      fixed={true}
                      left={undefined}
                      on:submit={next}
                      right={0}
                      top={undefined}
        />
    </div>
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

    input[type="number"] {
        border-radius: 13px;
        background: var(--background);
        color: var(--text-color);
        border: var(--highlight) 2px solid;
        padding: 9px;
        min-width: 50px;
        max-width: 75px;
        text-align: center;
    }

    input[type="number"]::-webkit-inner-spin-button {
        opacity: 0;
        -webkit-appearance: none;
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

        input[type="number"] {
            border-width: 3px;
        }
    }

    button {
        border: none;
    }
</style>