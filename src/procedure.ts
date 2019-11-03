import {Action} from "./Action";

interface ProcedureOptions {
    name: string,
    description: string,
    authors: Array<string>,
    creationTimestamp: number
}

export class Procedure {
    public name: string;
    public description: string;
    public authors: Array<string>;
    public creationTimestamp: number;

    private actions: Array<Action> = [];
    private connections: { [from: string]: Array<Action> } = {};

    constructor({name, description, authors, creationTimestamp}: ProcedureOptions) {
        this.name = name;
        this.description = description;
        this.authors = authors;
        this.creationTimestamp = creationTimestamp;
    }
}