import type {ArduinoDevice} from "./device.mjs";
import type {Part} from "./triggerData.mjs";

export interface Pin {
    type: PinType,
    pinNumber: number,
    part: number,
}

export interface Layout {
    digital: number[],
    analog: number[],
}

export function pinToString(pin: Pin): string {
    let char = pin.type.charAt(0);

    return char + pin.pinNumber + "p" + pin.part;
}

export function pinFromString(string: string): Pin {
    if (!string) return null;

    let type: PinType = string.charAt(0) == "a" ? "analog" : "digital";

    let split = string.split("p");

    let pinNumber: number = Number(split[0].slice(1));

    let part: number = Number(split[1]);

    return {
        type: type,
        pinNumber: pinNumber,
        part: part
    }
}

export type PinType = "analog" | "digital";

export function getPopulatedPins(device: ArduinoDevice): Pin[] {
    if (!device) return [];

    let digitalPins = device.pinOut.digital.filter(p => p != 0);
    let analogPins = device.pinOut.analog.filter(p => p != 0);

    let layout = getDeviceLayout(device);

    let results: Pin[] = []

    digitalPins?.forEach((value, index) => {
        results.push({
            type: "digital",
            pinNumber: layout.digital[index],
            part: value,
        })
    })

    analogPins?.forEach((value, index) => {
        results.push({
            type: "analog",
            pinNumber: layout.analog[index],
            part: value,
        })
    })

    return results;
}

function getDeviceLayout(device: ArduinoDevice): Layout {
    let results = layouts[device.mimacroType];

    if (!results) return null;

    return results;
}

export let parts: Part[];
const updateParts = async () => {
    parts = await electronAPI.getParts();
}
updateParts();

export let layouts: { [name: string]: Layout }
const updateLayouts = async () => {
    let jsonLayouts = await electronAPI.getLayouts();
    let keys = Object.keys(jsonLayouts);

    layouts = jsonLayouts;
}
updateLayouts();

export function getPin(device: ArduinoDevice, index: number): Pin {
    let pins = getPopulatedPins(device);

    return pins.filter(pin => pin.pinNumber == index)[0];
}