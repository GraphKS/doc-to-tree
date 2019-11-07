import * as Handlebars from "handlebars";
import {Exporter} from "../Exporter";
import {readFileSync} from "fs";
import {join} from "path";

const templateDefinition = readFileSync(join(__filename, "template.handlebars"));

const template = Handlebars.compile(templateDefinition);

export class MarkdowExporter extends Exporter<MarkdownExportable> {
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
                    blocks: action.exportToMarkdown().map(block => {
                        switch (block.type) {
                            case "title":
                                return {isTitle: true, content: block.content};
                            case "paragraph":
                                return {isParagraph: true, content: block.content};
                            case "code":
                                return {isCode: true, content: block.content, language: block.language};
                            case "link":
                                return {isLink: true, target: block.target, label: block.label};
                            default:
                                throw new Error(`Export Error. Unsuported block type ${block}`);
                        }
                    })
                };
            }).filter(action => action !== null)
        };
        return template(data);
    }
}

export interface MarkdownExportable {
    includeInExport: boolean

    exportToMarkdown(): Array<supportedBlock>
}

type supportedBlock = MarkdownTitle | MarkdownParagraph | MarkdownCode | MarkdownLink

export interface MarkdownTitle {
    type: "title";
    content: string
}

export interface MarkdownParagraph {
    type: "paragraph"
    content: string
}

export interface MarkdownCode {
    type: "code"
    content: string
    language: string
}

export interface MarkdownLink {
    type: "link"
    target: string
    label: string
}
