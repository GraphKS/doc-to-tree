import {isStepExport, Step, StepExport, StepOption} from "./Step";
import {importYamlStep} from "./Importer/yamlmporter";

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
            creationTimestamp: this.creationTimestamp,
            creationUtcString: new Date(this.creationTimestamp).toUTCString()
        };
    }

    public static async fromYaml(path: string): Promise<Procedure> {
        const procedure = await importYamlStep(path);
        if (procedure instanceof Procedure) return procedure;
        else throw new Error("Import Error. This file doesn't describe a procedure");
    }
}

export interface ProcedureExport extends StepExport {
    authors: Array<string>
    creationTimestamp: number
    creationUtcString: string
}

function isProcedureExport(object: any): object is ProcedureExport {
    if (isStepExport(object)) {
        return ("authors" in object && "creationTimestamp" in object && "creationUtcString" in object);
    } else return false;
}