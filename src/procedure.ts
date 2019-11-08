import {Step} from "./Actions/Step";

interface ProcedureOptions {
    name: string,
    description?: string,
    authors?: Array<string>,
    creationTimestamp?: number,
}

export class Procedure {

    public name: string;
    public description: string;
    public authors: Array<string>;
    public creationTimestamp: number;

    public readonly steps: Array<Step> = [];

    constructor({name, description = "", authors = [], creationTimestamp = Date.now()}: ProcedureOptions) {
        this.name = name;
        this.description = description;
        this.authors = authors;
        this.creationTimestamp = creationTimestamp;
    }

    public addStep(...steps: Step[]) {
        steps.forEach(s => this.steps.push(s));
    }

    public preOrder(): Array<Step> {
        return this.steps.flatMap(step => step.preOrder());
    }
}