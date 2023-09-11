export interface Action {
    displayName: string,
    id: string,
    pluginId: string,

    ui: UIComponent[],

    ordinal?: number,
    metaData?: { [id: string]: object }
}

export interface UIComponent {
    type: Type,
    id: string,
    label: string,

    required?: boolean,
}

type Type = "string" | "number" | "options" | "checkbox"

export async function getRegistry() {
    let results: Action[] = await electronAPI.getAllActions();

    return results;
}

export function isActionFullyDefined(action: Action): boolean {
    console.log("woah -1");

    for (let ui of action.ui) {
        if (ui.required) {
            let component = document.getElementById(ui.id) as HTMLInputElement;

            if (!component) return false;

            console.log("woah");

            if (component.value == null || component.value.length < 1) {
                console.log("woah2");
                return false;
            }
        }
    }

    console.log(`success for ${action.id}`);
    return true;
}