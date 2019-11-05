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
    protected _nextAction?: Action;
    public readonly includeInExport: boolean;

    constructor({id, description = "", title = id, comments = "", includeInExport = true}: ActionOptions) {
        this.id = id;
        this.description = description;
        this.comments = comments;
        this.title = title;
        this.includeInExport = includeInExport;
    }

    public connectBefore(action: Action) {
        if (this._nextAction !== undefined) {
            throw new Error(`Action Error. This node is already connected to ${this._nextAction.id}`);
        }
        this._nextAction = action;
    }

    get nextAction(): Action | undefined {
        return this._nextAction;
    }

    public connectAfter(node: Action): Action {
        node.connectBefore(this);
        return this;
    }

    protected abstract async execute(ctx: Context): Promise<any>

    public async next(ctx: Context): Promise<Context> {
        if (ctx.hasOwnProperty(this.id)) {
            throw new Error(`ContextError. ${this.id} is already in context.`);
        }
        const newCtx = {...ctx};
        newCtx[this.id] = await this.execute(newCtx);
        if (this.nextAction == undefined) {
            // End of the graph
            return newCtx;
        } else {
            // continue to execute the graph
            return await this.nextAction.next(newCtx);
        }
    }
}