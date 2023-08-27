const actionRegistry: Action[] = []

export interface Action {
    displayName: string,
    id: string,
    pluginId: string,

    meta?: object[],
    ui?: { [Name: string]: UIComponent },
}

export interface UIComponent {
    type: Type,
    options?: string[]
}

type Type = "string" | "number" | "options-select" | "checkbox"

actionRegistry.push({
    displayName: "Keypress",
    id: "keypress",
    pluginId: "default",

    ui: {
        keycode: {
            type: "options-select",
            options: [
                "opt1",
                "opt2",
            ]
        }
    }
} as Action)

actionRegistry.push({
    displayName: "2 Keypress",
    id: "diff-keypress",
    pluginId: "default",

    ui: {
        keycode: {
            type: "string"
        }
    }
} as Action)

actionRegistry.push({
    displayName: "3 Keypress",
    id: "diff-keypress",
    pluginId: "default",

    ui: {
        keycode: {
            type: "checkbox"
        }
    }
} as Action)

actionRegistry.push({
    displayName: "4 Keypress",
    id: "diff-keypress",
    pluginId: "default",

    ui: {
        keycode: {
            type: "number"
        }
    }
} as Action)

export function getRegistry(): Action[] {
    return actionRegistry;
}