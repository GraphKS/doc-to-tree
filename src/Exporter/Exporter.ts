import {Procedure} from "../procedure";
import {alg} from "graphlib";
import {Action} from "../Actions/Action";

export abstract class Exporter {
    constructor(protected procedure: Procedure) {
    }

    protected getActionInOrder(): Array<Action> {
        // Return a list of actions to export
        const ids = alg.preorder(this.procedure.graph, [this.procedure.start.id]);
        return ids.map(id => this.procedure.graph.node(id));
    }

    public abstract export(): string
}

export interface ActionExport {
    title: string
    description: string
    note?: string
    edges: Array<{ target: string, note?: string }>
    snippet?: {
        content: string
        language: string
    }
}