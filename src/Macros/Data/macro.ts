import type {ArduinoDevice} from "./device";
import type {Part, TriggerData} from "./triggerData";

export interface MacroData {
    name: string,
    device: ArduinoDevice,
    trigger: TriggerData,
    part: Part,
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