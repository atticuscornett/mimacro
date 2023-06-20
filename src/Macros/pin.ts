import type {ArduinoDevice} from "./device";

export interface Pin {
    type: PinType,
    pinNumber: number,
    part: number,
}

export type PinType = "analog" | "digital";

export function getNonEmptyPins(device: ArduinoDevice): Pin[] {
    if (!device) return [];

    let digitalPins = device.pinOut.digital;
    let analogPins = device.pinOut.analog;

    let results: Pin[] = []

    digitalPins.forEach((value, index) => {
        if (value !== 0) {
            results.push({
                type: "digital",
                pinNumber: index,
                part: value,
            })
        }
    })

    analogPins.forEach((value, index) => {
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

export function getPin(device: ArduinoDevice, index: number): Pin {
    let pins = getNonEmptyPins(device);

    return pins.filter(pin => pin.pinNumber == index)[0];
}