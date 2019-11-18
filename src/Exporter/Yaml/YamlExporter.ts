import * as Handlebars from "handlebars";
import {Exporter} from "../Exporter";
import {Step} from "../../Step";

const templateDefinition = `
type: {{type}}
title: {{title}}
description:|
{{description}}
`;

const template = Handlebars.compile(templateDefinition.trim(), {preventIndent: true});

export class YamlExporter extends Exporter<Step> {
    public export(): string {
        const data = {
            title: this.procedure.title,
            type: this.procedure.type,
            description: this.procedure.description
        };
        return template(data);
    }

    public static export(procedure: Step): string {
        const exporter = new this(procedure);
        return exporter.export();
    }
}