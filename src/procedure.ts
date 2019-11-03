import {Action, Context} from "./Actions/Action";

interface ProcedureOptions {
    name: string,
    description: string,
    authors: Array<string>,
    creationTimestamp: number,
    start: Action,
    ends: Array<Action>
}

export class Procedure {

    public name: string;
    public description: string;
    public authors: Array<string>;
    public creationTimestamp: number;

    private start: Action;

    constructor({name, description, authors, creationTimestamp, start, ends}: ProcedureOptions) {
        this.name = name;
        this.description = description;
        this.authors = authors;
        this.creationTimestamp = creationTimestamp;
        this.start = start;
        this.checkGraph(start, ends);
    }

    private checkGraph(start: Action, ends: Array<Action>) {
        // Check that graph is not disconnected, is acyclic, etc...
        throw new Error("Not implemented");
    }

    public async execute(): Promise<Context> {
        return await this.start.next({});
    }

    public async export(): Promise<string> {
        return await this.start.nextExport("");
    }
}