const actionRegistry: Action[] = []

export interface Action {
    displayName: string,
    id: string,
    pluginId: string,

    meta?: object[],
    ui?: object,
}

actionRegistry.push({
    displayName: "Keypress",
    id: "keypress",
    pluginId: "default",

    ui: {
        keycode: "string"
    }
} as Action)

export function getRegistry(): Action[] {
    return actionRegistry;
}