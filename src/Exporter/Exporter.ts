import {Procedure} from "../procedure";
import {Action} from "../Actions/Action";
import {alg} from "graphlib";

export abstract class Exporter {
    constructor(protected procedure: Procedure) {
    }

    protected getActionOrder(): Array<Action> {
        // Return a list or actions to export
        const ids = alg.preorder(this.procedure.graph, [this.procedure.start.id]);
        return ids.map(id => this.procedure.graph.node(id));
    }

    public abstract export(): string
}