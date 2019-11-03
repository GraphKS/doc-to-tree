import {Context} from "../Runner/Runner";

interface ActionOptions {
    id: string
    description: string
    title: string
}

// Should action have a method to execute themselves or should they be agnostic and execution information all contained
// in the runner ?
// Maybe create Subtype like InteractiveActions to be runned by InteractiveRunner ?
export class Action {

    public id: string;
    public description: string;
    public title: string;
    private _connections: Array<Action> = [];

    constructor({id, description, title}: ActionOptions) {
        this.id = id;
        this.description = description;
        this.title = title;
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
}