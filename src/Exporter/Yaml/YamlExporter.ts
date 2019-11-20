import * as Handlebars from "handlebars";
import {Exporter} from "../Exporter";
import {isStep, Step} from "../../Step";
import sanitize = require("sanitize-filename");

const templateDefinition = `
title: {{{title}}}
description: |
  {{{description}}}
{{#if childrens}}
steps:
{{#each childrens}}
  - {{../stepPathPrefix}}/{{{this}}}.yaml
{{/each}}
{{/if}}
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
            title: this.step.title,
            stepPathPrefix: this.stepPathPrefix,
            description: this.step.description,
            childrens: this.step.nextSteps.filter(isStep).map(step => sanitize(step.title))
        };
        return template(data).trim();
    }

    public static export(procedure: Step): string {
        const exporter = new this(procedure);
        return exporter.export();
    }
}

/*
TODO: Export a step
Write a method to parse the step tree and export each step.
Each step should be saved with a filename corresponding to the nextSteps' name of its parent
*/
