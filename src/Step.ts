import {Tree} from "./Tree";

export interface externalLink {
    title: string
    url: string
}

export interface StepOption {
    description?: string
    note?: string
    title: string
    externalLinks?: Array<externalLink>
}

export class Step extends Tree {
    public readonly description?: string;
    public readonly note?: string;
    public readonly title: string;
    public readonly externalLinks: Array<externalLink>;

    constructor({title, description, note, externalLinks = []}: StepOption) {
        super();
        this.description = description;
        this.note = note;
        this.title = title;
        this.externalLinks = externalLinks;
        this.type = "step";
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
                })),
            externalLinks: this.externalLinks
        };
    }
}

export function isStep(object: any): object is Step {
    return object instanceof Step;
}

export interface StepExport {
    title: string
    description?: string
    note?: string
    depth: number
    nextSteps: Array<{ title: string, note?: string }>
    externalLinks?: Array<externalLink>
}

export function isStepExport(object: any): object is StepExport {
    return (object instanceof Object && "title" in object && "description" in object && "depth" in object && "nextSteps" in object);
}