import {Action} from "./Actions/Action";

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

    private _actions: Array<Action> = [];
    private _connections: { [from: string]: Array<Action> } = {};

    constructor({name, description, authors, creationTimestamp, start, ends}: ProcedureOptions) {
        this.name = name;
        this.description = description;
        this.authors = authors;
        this.creationTimestamp = creationTimestamp;
        this.createGraph(start, ends)
    }

    get connections(): { [p: string]: Array<Action> } {
        return this._connections;
    }

    public getConnectionFor(action: Action): Array<Action> {
        throw new Error("Not implemented");
    }

    get actions(): Array<Action> {
        return this._actions;
    }

    private createGraph(start: Action, ends: Array<Action>) {
        throw new Error("Not implemented");
    }
}