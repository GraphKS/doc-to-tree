import {Action} from "../Actions/Action";

export class Edge {
    constructor(public target: Action, public comment: string) {
    }
}