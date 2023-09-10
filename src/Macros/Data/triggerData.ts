import type {Pin, PinType} from "./pin";
import {parts} from "./pin";

export interface TriggerData {
    pin: Pin,
    name: string,

    description: string,
    parameters: TriggerParameter[]
}

export interface TriggerParameter {
    name: string,
    type: ParameterType
}

export type ParameterType = "int" | "analogInt" | "boolean"

export interface Part {
    id: string,
    name: string,
    type: PinType,
    triggers: JSONTriggerData[]
}

interface JSONTriggerData {
    name: string,
    type: TriggerType,
    description: string,

    parameters: TriggerParameter[]
}

export function getPart(id: number): Part {
    if (!id) return null;

    let result = parts.filter(part => part.id == id.toString())[0]

    if (!result) return null;

    return result;
}

type TriggerType = "static" | "dynamic";

// export function placeholderTrigger(): TriggerData {
//    return  {
//        pin: getPin(placeholderDevice(), 0),
//        name: "Down",
//    }
// }

// export function placeholderPart(): Part {
//     return  {
//         "id": "1",
//         "name": "Button",
//         "type": "digital",
//         "triggers": [
//             {
//                 "name": "Down",
//                 "type": "static"
//             },
//
//             {
//                 "name": "Up",
//                 "type": "static"
//             },
//
//             {
//                 "name": "Hold",
//                 "type": "static",
//                 "parameters": [
//                     {
//                         "name": "Duration",
//                         "type": "int"
//                     }
//                 ]
//             }
//         ]
//     }
// }