import {Action} from "./Action";
import {ActionExport} from "../Exporter/Exporter";

export class PassiveAction extends Action {
    export(): ActionExport {
        return {
            title: this.title,
            description: this.description,
            note: this.note,
            edges: this.edges.map(edge => ({target: edge.target.title, note: edge.comment}))
        };
    }

}