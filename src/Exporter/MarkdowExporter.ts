import {Exporter} from "./Exporter";
import * as Handlebars from "handlebars";

const templateDefinition = `# {{ procedure.name }}
Generated on {{ procedure.creationDate }}

{{#if procedure.authors}}
Written by
{{#each procedure.authors}}
* {{name}}
{{/each}}
{{/if}}

{{ procedure.description}}

{{#each actions}}
## {{title}}
{{#if description}}

{{description}}
{{/if}}
{{#if comments}}

{{comments}}
{{/if}}
{{#if edges}}
Next step:
{{#each edges}}

* [{{target.title}}](#{{target.title}})
{{#if comment}}
  * {{comment}}
{{/if}}
{{/each}}
{{/if}}

{{/each}}
`;

const template = Handlebars.compile(templateDefinition);

export class MarkdowExporter extends Exporter {
    public export(): string {
        const data = {
            procedure: {
                name: this.procedure.name,
                description: this.procedure.description,
                authors: this.procedure.authors.map(author => ({name: author})),
                creationDate: new Date(this.procedure.creationTimestamp).toUTCString()
            },
            actions: this.getActionOrder().map(action => {
                if (!action.includeInExport) return null;
                return {
                    title: action.title,
                    description: action.description,
                    comments: action.comments,
                    edges: action.edges
                };
            }).filter(action => action !== null)
        };
        return template(data);
    }
}