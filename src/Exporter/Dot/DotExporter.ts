import {Exporter} from "../Exporter";
import {Step} from "../../Step";
import * as Handlebars from "handlebars";
import {getScopedLogger} from "../../Logger";


const templateDefinition = `
digraph "{{title}}" {
{{#each edges}}
    "{{source}}"->"{{target}}"
{{/each}}
}
`;

const template = Handlebars.compile(templateDefinition.trim(), {preventIndent: true});

export class DotExporter extends Exporter<Step> {
    protected logger = getScopedLogger("Export", "Dot");
    public export(): string {
        const data = {
            title: this.step.title,
            edges: this.step.preOrder().flatMap(step => step.nextSteps.map(nextStep => ({
                source: step.title,
                target: nextStep.title
            })))
        };
        this.logger.info(`About to export a .dot graph with ${data.edges.length} edges in it.`);
        return template(data);
    }

    public static export(step: Step): string {
        const exporter = new this(step);
        return exporter.export();
    }
}