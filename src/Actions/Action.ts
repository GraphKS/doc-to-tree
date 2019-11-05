import {DirectEdge, Edge} from "../Edge/Edge";

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

    get edges(): Array<Edge> {
        return [...this._edges];
    }

    public addEdge(edge: Edge) {
        this._edges.push(edge);
        if (this.targets.indexOf(edge.target) != -1) throw new Error(`Action Error. Node ${this.id} is already connected to ${edge.target.id}`);
        this.targets.push(edge.target);
    }

    public addDirectEdge(target: Action) {
        this.addEdge(new DirectEdge(target));
    }

    protected abstract async execute(ctx: Context): Promise<any>

    public async next(ctx: Context): Promise<Context> {
        if (ctx.hasOwnProperty(this.id)) {
            throw new Error(`ContextError. ${this.id} is already in context.`);
        }
        ctx[this.id] = await this.execute(ctx);
        if (!this._edges) {
            // End of the graph
            return ctx;
        } else {
            // continue to execute the graph
            for (const edge of this._edges) {
                if (edge.test(ctx)) {
                    await edge.target.next(ctx);
                }
            }
            return ctx;
        }
    }
}