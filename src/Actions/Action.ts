import {Edge} from "../Edge/Edge";
import {ExportBlock} from "../Exporter/Exporter";

export interface Context {
    [key: string]: any
}

export interface ActionOptions {
    id: string
    description?: string
    comments?: string
    title?: string
    includeInExport?: boolean
}

export abstract class Action {
    public readonly id: string;
    public readonly description: string;
    public readonly comments: string;
    public readonly title: string;
    private _edges: Array<Edge> = [];
    private targets: Array<Action> = [];
    public readonly includeInExport: boolean;

    constructor({id, description = "", title = id, comments = "", includeInExport = true}: ActionOptions) {
        this.id = id;
        this.description = description;
        this.comments = comments;
        this.title = title;
        this.includeInExport = includeInExport;
    }

    public abstract export(): Array<ExportBlock>

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