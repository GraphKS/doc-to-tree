import {Step, StepOption} from "./Step";

interface ProcedureOptions extends StepOption {
    authors?: Array<string>,
    creationTimestamp?: number,
}

export class Procedure extends Step {
    public authors: Array<string>;
    public creationTimestamp: number;

    constructor({title, description = "", authors = [], creationTimestamp = Date.now(), note}: ProcedureOptions) {
        super({title, description, note});
        this.authors = authors;
        this.creationTimestamp = creationTimestamp;
    }
}