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
            actions: this.getActionInOrder().map(action => {
                if (!action.includeInExport) return null;
                const blocks = action.export()[MARKDOWN_EXPORT_TYPE].map(block => {
                    if (block instanceof MarkdownTitle) return {isTitle: true, content: block.block.title};
                    else if (block instanceof MarkdownParagraph) return {
                        isParagraph: true,
                        content: block.block.content
                    };
                    else if (block instanceof MarkdownCode) return {
                        isCode: true,
                        content: block.block.content,
                        language: block.block.language
                    };
                    else if (block instanceof MarkdownNextStep) return {
                        isNextStep: true,
                        target: block.block.target,
                        label: block.block.label,
                        comment: block.block.comment
                    };
                    else return null;
                });
                return {
                    blocks: blocks
                };
            }).filter(action => action !== null)
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