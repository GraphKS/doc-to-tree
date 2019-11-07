import {Procedure} from "../procedure";
import {alg} from "graphlib";

export abstract class Exporter<T> {
    constructor(protected procedure: Procedure) {
    }

    protected getActionOrder(): Array<T> {
        // Return a list of actions to export
        const ids = alg.preorder(this.procedure.graph, [this.procedure.start.id]);
        return ids.map(id => this.procedure.graph.node(id));
    }

    public abstract export(): string
}