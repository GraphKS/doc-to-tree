import * as Handlebars from "handlebars";
import {ExportBlock, Exporter} from "../Exporter";
import {readFileSync} from "fs";
import {join} from "path";

const templateDefinition = readFileSync(join(__dirname, "template.handlebars")).toString();

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
            actions: this.getActionInOrder().map(action => {
                if (!action.includeInExport) return null;
                const blocks = action.export().map(block => {
                    if (isSupporterBlock(block)) {
                        switch (block.type) {
                            case "markdown-title":
                                return {isTitle: true, content: block.content};
                            case "markdown-paragraph":
                                return {isParagraph: true, content: block.content};
                            case "markdown-code":
                                return {isCode: true, content: block.content, language: block.language};
                            case "markdown-link":
                                return {isLink: true, target: block.target, label: block.label};
                        }
                    }
                });
                return {
                    blocks: blocks
                };
            }).filter(action => action !== null)
        };
        return template(data);
    }
}

export interface MarkdownExportable extends ExportBlock {
    export(): Array<supportedBlock>
}

function isSupporterBlock(exportBlock: ExportBlock): exportBlock is supportedBlock {
    const types = ["markdown-title", "markdown-paragraph", "markdown-code", "markdown-link"];
    return types.includes(exportBlock.type);
}


type supportedBlock = MarkdownTitle | MarkdownParagraph | MarkdownCode | MarkdownLink

// TODO: replace interface with real class

export interface MarkdownTitle {
    type: "markdown-title";
    content: string
}

export interface MarkdownParagraph {
    type: "markdown-paragraph"
    content: string
}

export interface MarkdownCode {
    type: "markdown-code"
    content: string
    language: string
}

export interface MarkdownLink {
    type: "markdown-link"
    target: string
    label: string
}
