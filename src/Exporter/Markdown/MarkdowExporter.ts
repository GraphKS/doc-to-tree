import * as Handlebars from "handlebars";
import {Exporter} from "../Exporter";
import {readFileSync} from "fs";
import {join} from "path";
import dedent = require("dedent");

const templateDefinition = readFileSync(join(__dirname, "template.handlebars")).toString();

const template = Handlebars.compile(templateDefinition, {preventIndent: true});

export const MARKDOWN_EXPORT_TYPE = "Markdown";

export class MarkdowExporter extends Exporter {
    public export(): string {
        const data = {
            procedure: {
                name: this.procedure.name,
                description: this.procedure.description,
                authors: this.procedure.authors.map(author => ({name: author})),
                creationDate: new Date(this.procedure.creationTimestamp).toUTCString()
            },
            actions: this.procedure.preOrder().map(step => step.export())
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