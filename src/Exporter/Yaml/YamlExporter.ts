import * as Handlebars from "handlebars";
import {Exporter} from "../Exporter";
import {isStep, Step} from "../../Step";
import sanitize = require("sanitize-filename");

const templateDefinition = `
type: {{type}}
title: {{title}}
description:|
{{description}}
steps:
{{#each childrens}}
  - {{../stepPathPrefix}}/{{this}}.yaml
{{/each}}
`;

const template = Handlebars.compile(templateDefinition, {preventIndent: true});

export class YamlExporter extends Exporter<Step> {
    public stepPathPrefix: string;

    constructor(procedure: Step, stepPathPrefix: string = ".") {
        super(procedure);
        this.stepPathPrefix = stepPathPrefix;
    }

    public export(): string {
        const data = {
            title: this.procedure.title,
            type: this.procedure.type,
            stepPathPrefix: this.stepPathPrefix,
            description: this.procedure.description,
            childrens: this.procedure.childrens.filter(isStep).map(child => sanitize(child.title))
        };
        return template(data).trim();
    }

    public static export(procedure: Step): string {
        const exporter = new this(procedure);
        return exporter.export();
    }
}

/*
TODO: Export a procedure
Write a method to parse the procedure tree and export each step.
Each step should be saved with a filename corresponding to the nextSteps' name of its parent
*/
