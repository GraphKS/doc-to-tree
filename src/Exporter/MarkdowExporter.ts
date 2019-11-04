import {Exporter} from "./Exporter";
import {Action} from "../Actions/Action";

export class MarkdowExporter extends Exporter {
    public static exportAction(action: Action): string {
        throw new Error("Not defined");
    }

    public export(): string {
        const actionsToExport = this.getActionOrder();
        return actionsToExport
            .reduce((doc: string, action: Action) => doc.concat("\n", MarkdowExporter.exportAction(action)), "");
    }

}