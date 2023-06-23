import type {ArduinoDevice} from "./device";
import type {Part} from "./triggerData";

export interface Pin {
    type: PinType,
    pinNumber: number,
    part: number,
}

export interface Layout {
    name: string,
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

    let digitalPins = device.pinOut.digital;
    let analogPins = device.pinOut.analog;

    let layout = getDeviceLayout(device);

    let results: Pin[] = []

    digitalPins?.forEach((value, index) => {
        if (value !== 0) {
            results.push({
                type: "digital",
                pinNumber: layout.digital[index],
                part: value,
            })
        }
    })

    analogPins?.forEach((value, index) => {
        if (value !== 0) {
            results.push({
                type: "analog",
                pinNumber: layout.analog[index],
                part: value,
            })
        }
    })

    return results;
}

function getDeviceLayout(device: ArduinoDevice): Layout {
    let results = layouts.filter(layout => layout.name === device.mimacroType)[0];

    if (!results) return null;

    return results;
}

export let parts: Part[];
const updateParts = async () => {
    parts = await electronAPI.getParts();
}
updateParts();

export let layouts: Layout[];
const updateLayouts = async () => {
    layouts = await electronAPI.getLayouts();
}
updateLayouts();

export function getPin(device: ArduinoDevice, index: number): Pin {
    let pins = getPopulatedPins(device);

    return pins.filter(pin => pin.pinNumber == index)[0];
}