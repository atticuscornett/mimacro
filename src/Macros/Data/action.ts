export interface Action {
    displayName: string,
    id: string,
    pluginId: string,

    ui: UIComponent[],
}

export interface UIComponent {
    type: Type,
    id: string,

    [x: string | number | symbol]: unknown;
}

type Type = "string" | "number" | "options" | "checkbox"

export async function getRegistry() {
    let results: Action[] = await electronAPI.getAllActions();

    return results;
}