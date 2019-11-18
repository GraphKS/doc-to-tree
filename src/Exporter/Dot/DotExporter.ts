import {Exporter} from "../Exporter";
import {Step} from "../../Step";
import * as Handlebars from "handlebars";
import {Procedure} from "../../procedure";


const templateDefinition = `
digraph "{{title}}" {
{{#each edges}}
    "{{source}}"->"{{target}}"
{{/each}}
}
`;

const template = Handlebars.compile(templateDefinition.trim(), {preventIndent: true});

export class DotExporter extends Exporter<Procedure> {
    public export(): string {
        const data = {
            title: this.procedure.title,
            edges: this.procedure.preOrder().flatMap(step => {
                if (step instanceof Step) {
                    return step.childrens.map(child => {
                        if (child instanceof Step) return {source: step.title, target: child.title};
                    });
                }
            })
        };
        return template(data);
    }

    public static export(procedure: Procedure): string {
        const exporter = new this(procedure);
        return exporter.export();
    }
}