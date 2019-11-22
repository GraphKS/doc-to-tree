import {writeFileSync} from "fs";

export abstract class Exporter<T> {
        constructor(protected step: T) {
    }

    public abstract export(): string

    public exportToDisk(path: string) {
        const data = this.export();
        writeFileSync(path, data);
    }
}

