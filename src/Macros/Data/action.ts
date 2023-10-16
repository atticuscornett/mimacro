export interface Action {
    displayName: string,
    id: string,
    pluginId: string,

    ui: UIComponent[],

    metaData?: { [id: string]: object }
}

export interface UIComponent {
    type: Type,
    id: string,
    label: string,

    options?: string[],

    required?: boolean,
}

type Type = "string" | "number" | "options-select" | "checkbox"

export async function getRegistry() {
    let results: Action[] = await electronAPI.getAllActions();

    return results;
}

export function isActionFullyDefined(action: Action): boolean {
    for (let ui of action.ui) {
        if (ui.required || ui.required == null) {
            let component = document.getElementById(ui.id) as HTMLInputElement;

            if (!component) return false;

            if (component.value == null || component.value.length < 1) {
                return false;
            }
        }
    }

    return true;
}