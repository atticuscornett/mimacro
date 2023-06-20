import type {ArduinoDevice} from "./device";
import type {Part, TriggerData} from "./triggerData";

export interface MacroData {
    name: string,
    device: ArduinoDevice,
    trigger: TriggerData,
    part: Part,
}