import {Context} from "../Runner/Runner";

interface ActionOptions {
    id: string
    description: string
    title: string
    includeInExport: boolean
}

export abstract class Action {

    public readonly id: string;
    public readonly description: string;
    public readonly title: string;
    protected readonly _connections: Array<Action> = [];
    public readonly includeInExport: boolean;

    constructor({id, description, title, includeInExport = true}: ActionOptions) {
        this.id = id;
        this.description = description;
        this.title = title;
        this.includeInExport = includeInExport;
    }

    public addConnection(action: Action) {
        this._connections.push(action);
    }

    get connections(): Array<Action> {
        return this._connections;
    }

    public connect(node: Action): Action {
        node.addConnection(this);
        return this
    }

    public run(ctx: Context): Context {
        if (ctx.hasOwnProperty(this.id)) {
            throw new Error(`ContextError. ${this.id} is already in context.`)
        }
        ctx[this.id] = this.executeWithinContext(ctx);
        return ctx;
    }

    protected abstract executeWithinContext(ctx: Context): any
}