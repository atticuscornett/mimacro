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

actionRegistry.push({
    displayName: "2 Keypress",
    id: "diff-keypress",
    pluginId: "default",

    ui: {
        keycode: "string"
    }
} as Action)

actionRegistry.push({
    displayName: "3 Keypress",
    id: "diff-keypress",
    pluginId: "default",

    ui: {
        keycode: "string"
    }
} as Action)

actionRegistry.push({
    displayName: "4 Keypress",
    id: "diff-keypress",
    pluginId: "default",

    ui: {
        keycode: "string"
    }
} as Action)

export function getRegistry(): Action[] {
    return actionRegistry;
}