import {StepExport} from "../Exporter/StepExport";

export interface ActionOptions {
    description?: string
    note?: string
    title: string
    parent?: Step
}

export class Step {
    public readonly description: string;
    public readonly note?: string;
    public readonly title: string;
    public steps: Array<Step> = [];
    public parent?: Step;

    constructor({description = "", title, note, parent}: ActionOptions) {
        this.description = description;
        this.note = note;
        this.title = title;
        this.parent = parent;
    }

    public export(): StepExport {
        return {
            type: Step.name,
            title: this.title,
            description: this.description,
            note: this.note,
            nextSteps: this.steps.map(step => ({
                title: step.title,
                note: step.note
            }))
        };
    }

    public addStep(...steps: Step[]) {
        steps.forEach(step => {
            step.parent = this;
            this.steps.push(step);
        });
    }

    public preOrder(): Array<Step> {
        return [
            this,
            ...this.steps.flatMap(step => step.preOrder())
        ];
    }
}