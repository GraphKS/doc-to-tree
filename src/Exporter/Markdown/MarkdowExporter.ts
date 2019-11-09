import * as Handlebars from "handlebars";
import {Exporter} from "../Exporter";
import {readFileSync} from "fs";
import {join} from "path";
import {Step} from "../../Step";
import {Procedure} from "../../procedure";
import dedent = require("dedent");

const templateDefinition = readFileSync(join(__dirname, "template.handlebars")).toString();

const template = Handlebars.compile(templateDefinition, {preventIndent: true});

export const MARKDOWN_EXPORT_TYPE = "Markdown";

export class MarkdowExporter extends Exporter {
    public export(): string {
        const data = {
            procedure: this.procedure.export(),
            steps: this.procedure.preOrder().filter(step => !step.isRoot()).map(step => {
                if (step instanceof Procedure && step.isRoot()) {
                    return {
                        isRootProcedure: true,
                        title: step.title,
                        description: step.description,
                        authors: step.authors.map(author => ({name: author})),
                        creationDate: new Date(step.creationTimestamp).toUTCString(),
                        nextSteps: step.childrens.filter(child => child instanceof Step)
                            .map(child => ({
                                title: (child as Step).title,
                                note: (child as Step).note
                            }))
                    };
                } else if (step instanceof Step) return step.export();
                else return {};
            }).filter(action => action != null)
        };
        return dedent(template(data));
    }
}

export type MarkdownBlockType = MarkdownTitle | MarkdownParagraph | MarkdownCode | MarkdownNextStep

export class MarkdownTitle {
    constructor(public block: { title: string }) {
    }
}

export class MarkdownParagraph {
    constructor(public block: { content: string }) {
    }
}

export class MarkdownCode {
    constructor(public block: { content: string, language: string }) {
    }
}

export class MarkdownNextStep {
    constructor(public block: { label: string, target: string, comment: string }) {
    }
}