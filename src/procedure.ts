import {Step, StepExport, StepOption} from "./Step";
import {Tree} from "./Tree";

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

    public export(): ProcedureExport {
        return {
            ...super.export(),
            authors: this.authors,
            creationTimestamp: this.creationTimestamp
        };
    }
}

export interface ProcedureExport extends StepExport {
    authors: Array<string>
    creationTimestamp: number
}