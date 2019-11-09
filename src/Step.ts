import {Tree} from "./Tree";

export interface StepOption {
    description?: string
    note?: string
    title: string
}

export class Step extends Tree {
    public readonly description?: string;
    public readonly note?: string;
    public readonly title: string;

    constructor({title, description, note}: StepOption) {
        super();
        this.description = description;
        this.note = note;
        this.title = title;
    }

    public export(): StepExport {
        return {
            title: this.title,
            description: this.description,
            note: this.note,
            depth: this.depth(),
            nextSteps: this.childrens.filter(child => child instanceof Step)
                .map(child => ({
                    title: (child as Step).title,
                    note: (child as Step).note
                }))
        };
    }
}

export interface StepExport {
    title: string
    description?: string
    note?: string
    depth: number
    nextSteps: Array<{ title: string, note?: string }>
    snippet?: {
        content: string
        language: string
    }
}