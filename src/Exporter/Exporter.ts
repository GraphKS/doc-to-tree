import {Procedure} from "../procedure";
import {Action} from "../Actions/Action";

export abstract class Exporter {
    constructor(protected procedure: Procedure) {
    }

    protected getActionOrder(): Array<Action> {
        // Return a list or actions to export
        throw new Error("Not implemented");
    }

    public abstract export(): string
}