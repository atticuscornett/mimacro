import {EXAMPLE_DEVICE} from "./device";
import type {Pin, PinType} from "./pin";
import type {Action} from "./action";
import {getPin} from "./pin";
import {EXAMPLE_ACTION} from "./action";

export interface TriggerData {
    pin: Pin,
    name: string,
    action: Action
}

export interface Part {
    id: string,
    name: string,
    type: PinType,
    triggers: JSONTriggerData[]
}

interface JSONTriggerData {
    name: string,
    type: TriggerType,

    [x: string]: unknown
}

type TriggerType = "static" | "variable";

export const EXAMPLE_TRIGGER: TriggerData = {
    pin: getPin(EXAMPLE_DEVICE, 0),
    name: "Down",
    action: EXAMPLE_ACTION
}

export const EXAMPLE_PART: Part = {
    "id": "1",
    "name": "Button",
    "type": "digital",
    "triggers": [
        {
            "name": "Down",
            "type": "static"
        },

        {
            "name": "Up",
            "type": "static"
        },

        {
            "name": "Hold",
            "type": "static",
            "parameters": [
                {
                    "name": "Duration",
                    "type": "int"
                }
            ]
        }
    ]
}

export function getTriggerNames(): string[] {
    let results: string[] = [];

    let parts: Part[] = getParts();

    parts.forEach((p) => {
        results.concat(p.triggers.map(t => t.name))
    });

    return results;
}

export function getParts(): Part[] {
    let results: Part[];

    const setResult = async ()=> { results = await electronAPI.getParts() };
    setResult()

    return results;
}