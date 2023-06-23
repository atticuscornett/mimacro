import type {ArduinoDevice} from "./device";
import type {Part} from "./triggerData";

export interface Pin {
    type: PinType,
    pinNumber: number,
    part: number,
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

    let results: Pin[] = []

    digitalPins?.forEach((value, index) => {
        if (value !== 0) {
            results.push({
                type: "digital",
                pinNumber: index,
                part: value,
            })
        }
    })

    analogPins?.forEach((value, index) => {
        if (value !== 0) {
            results.push({
                type: "analog",
                pinNumber: index,
                part: value,
            })
        }
    })

    return results;
}

export let parts: Part[];
const updateParts = async () => {
    parts = await electronAPI.getParts();
}
updateParts();

export function getPin(device: ArduinoDevice, index: number): Pin {
    let pins = getPopulatedPins(device);

    return pins.filter(pin => pin.pinNumber == index)[0];
}