import {Procedure} from "../procedure";
import {writeFileSync} from "fs";

export abstract class Exporter {
    constructor(protected procedure: Procedure) {
    }

    public abstract export(): string

    public exportToDisk(path: string) {
        const data = this.export();
        writeFileSync(path, data);
    }
}

