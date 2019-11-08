import {Step} from "../Actions/Step";

export class Edge {
    constructor(public target: Step, public comment: string = "") {
    }
}