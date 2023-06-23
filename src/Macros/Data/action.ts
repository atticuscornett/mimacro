import {SvelteComponent} from "svelte";

const actionRegistry: Action[] = []

export abstract class Action {
    public ui: typeof SvelteComponent;
    public name: string;

    protected constructor() {
    }

    abstract onRun(): void;
}

export class KeypressAction extends Action {
    ui: typeof SvelteComponent

    constructor() {
        super();

        this.ui = null;
        this.name = "Keypress"
    }

    onRun() {
        console.log("running keypressaction")
    }
}
registerAction(new KeypressAction())

export function registerAction(action: Action) {
    actionRegistry.push(action);
}

export function getRegistry(): Action[] {
    return actionRegistry;
}

export function placeholderAction(): Action {
    return new KeypressAction();
}