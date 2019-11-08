import {Edge} from "../Edge/Edge";
import {ActionExport} from "../Exporter/ActionExport";

export interface Context {
    [key: string]: any
}

export interface ActionOptions {
    id: string
    description?: string
    note?: string
    title?: string
}

export class Action {
    public readonly id: string;
    public readonly description: string;
    public readonly note?: string;
    public readonly title: string;
    private _edges: Array<Edge> = [];
    private targets: Array<Action> = [];

    constructor({id, description = "", title = id, note}: ActionOptions) {
        this.id = id;
        this.description = description;
        this.note = note;
        this.title = title;
    }

    public export(): ActionExport {
        return {
            id: this.id,
            type: Action.name,
            title: this.title,
            description: this.description,
            note: this.note,
            edges: this.edges.map(edge => ({
                targetId: edge.target.id,
                targetTitle: edge.target.title,
                note: edge.comment
            }))
        };
    }

    get edges(): Array<Edge> {
        return [...this._edges];
    }

    public addEdge(target: Action, comment: string = "") {
        let edge = new Edge(target, comment);
        this._edges.push(edge);
        if (this.targets.includes(edge.target)) throw new Error(`Action Error. Node ${this.id} is already connected to ${edge.target.id}`);
        this.targets.push(edge.target);
    }
}