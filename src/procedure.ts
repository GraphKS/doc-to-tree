import {Action, Context} from "./Actions/Action";
import {alg, Graph} from "graphlib";
import {MultiOutputAction} from "./Actions/MultiOutputAction";

interface ProcedureOptions {
    name: string,
    description?: string,
    authors?: Array<string>,
    creationTimestamp?: number,
    start: Action,
    ends: Array<Action>
}

export class Procedure {

    public name: string;
    public description: string;
    public authors: Array<string>;
    public creationTimestamp: number;

    public readonly start: Action;
    public readonly ends: Array<Action>;
    public readonly graph: Graph;

    constructor({name, description = "", authors = [], creationTimestamp = Date.now(), start, ends}: ProcedureOptions) {
        this.name = name;
        this.description = description;
        this.authors = authors;
        this.creationTimestamp = creationTimestamp;
        this.start = start;
        this.ends = ends;
        this.graph = this.createGraph();
        this.checkGraph();
    }

    private createGraph(): Graph {
        const graph = new Graph();
        let nodeToExplore = [this.start];
        let i = 0;
        while (true) {
            if (nodeToExplore.length <= i) {
                break;
            }
            let node: Action = nodeToExplore[i];
            let childrens: Array<Action> = [];
            // Get all childrens if multi output
            if (node instanceof MultiOutputAction) {
                Object.values(node.outputs).forEach(n => childrens.push(n));
            }
            // Get children
            else if (node.nextAction) {
                childrens.push(node.nextAction);
            }
            // Add self and children into graph
            if (!graph.hasNode(node.id)) {
                graph.setNode(node.id, node);
            }
            childrens.forEach(c => {
                    if (!graph.hasNode(c.id)) {
                        graph.setNode(c.id, c);
                    }
                }
            );
            // Add edge
            childrens.forEach(c => graph.setEdge(node.id, c.id));
            // Explore children
            childrens.forEach(c => {
                if (nodeToExplore.indexOf(c) == -1)
                    nodeToExplore.push(c);
            });
            // increment counter
            i++;
        }
        return graph;
    }

    protected checkGraph() {
        if (!alg.isAcyclic(this.graph)) {
            throw new Error("Graph Error. This graph is cyclic");
        }
        this.ends.forEach(e => {
            if (!this.graph.hasNode(e.id)) {
                throw new Error(`Graph Error. This graph doesn't end with ${e.id}`);
            }
        });
    }

    public async execute(): Promise<Context> {
        return await this.start.next({});
    }
}