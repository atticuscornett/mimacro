import type {ArduinoDevice} from "./device.mjs";
import type {Part, TriggerData} from "./triggerData.mjs";
import type {Action} from "./action.mjs";

export interface MacroData {
    name: string,
    device: ArduinoDevice,
    trigger: TriggerData,
    part: Part,
    actions: Action[],
    uuid: string,
}

export function getMacros(): MacroData[] {
    let results: MacroData[];
    const getResults = async () => {
        results = await electronAPI.getMacros();
    }
    getResults();

    return results;
}