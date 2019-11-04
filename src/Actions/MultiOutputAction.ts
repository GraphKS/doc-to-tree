import {Action, ActionOptions} from "./Action";
import {PassiveAction} from "./PassiveAction";

export interface ConditionOptions extends ActionOptions {
    outputs: Array<string>
}

export abstract class MultiOutputAction extends Action {
    public outputs: { [id: string]: Action };

    constructor({outputs, ...opts}: ConditionOptions) {
        super(opts);
        this.outputs = this.createOutputs(outputs);
    }

    protected createOutputs(ids: Array<string>): { [id: string]: Action } {
        const outputs = ids.map(id => ({
            id, action: new PassiveAction({
                id: `${this.id}-${id}`,
                description: `${this.title} ${id} output`,
                title: `${this.title} ${id}`,
                includeInExport: true
            })
        }));
        return outputs.reduce((obj: { [id: string]: Action }, output) => ({
            ...obj,
            [output.id]: output.action
        }), {});
    }
}