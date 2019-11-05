import {Action} from "../Actions/Action";

export class Edge {
    constructor(public target: Action, public test: (ctx: any) => boolean) {
    }
}

export class DirectEdge extends Edge {
    constructor(public target: Action) {
        super(target, ctx => true);
    }
}

export class BooleanEdge extends Edge {
    constructor(public target: Action, val: boolean) {
        super(target, ctx => val);
    }
}