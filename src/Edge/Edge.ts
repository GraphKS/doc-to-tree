import {Action} from "../Actions/Action";

export class Edge {
    constructor(public target: Action, public test: (ctx: any) => boolean, public comment: string) {
    }
}

export class DirectEdge extends Edge {
    constructor(public target: Action) {
        super(target, ctx => true, "");
    }
}