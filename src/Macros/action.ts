export abstract class Action {
    abstract onRun(): void;
}

export function placeholderAction(): Action {
    return {
        onRun(): void {
            console.log("that's crazy I'm running")
        }
    };
}