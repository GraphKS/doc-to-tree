import {Exporter} from "../Exporter";
import {Step} from "../../Step";
import * as Handlebars from "handlebars";


const templateDefinition = `
digraph "{{title}}" {
{{#each edges}}
    "{{source}}"->"{{target}}"
{{/each}}
}
`;

const template = Handlebars.compile(templateDefinition.trim(), {preventIndent: true});

export class DotExporter extends Exporter<Step> {
    public export(): string {
        const data = {
            title: this.step.title,
            edges: this.step.preOrder().flatMap(step => step.nextSteps.map(nextStep => ({
                source: step.title,
                target: nextStep.title
            })))
        };
        return template(data);
    }

    public static export(step: Step): string {
        const exporter = new this(step);
        return exporter.export();
    }
}