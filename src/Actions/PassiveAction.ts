import {Action, ActionExport} from "./Action";
import {
    MARKDOWN_EXPORT_TYPE,
    MarkdownBlockType,
    MarkdownNextStep,
    MarkdownParagraph,
    MarkdownTitle
} from "../Exporter/Markdown/MarkdowExporter";

export class PassiveAction extends Action {
    export(): ActionExport {
        const blocks: Array<MarkdownBlockType> = [
            new MarkdownTitle({title: this.title}),
            new MarkdownParagraph({content: this.description}),
            new MarkdownParagraph({content: this.comments}),
        ];
        if (this.edges.length > 0) blocks.push(new MarkdownParagraph({content: "Next steps:"}));
        this.edges.forEach(edge => {
            blocks.push(new MarkdownNextStep({
                label: edge.target.title,
                target: edge.target.title,
                comment: edge.comment
            }));
        });
        return {
            [MARKDOWN_EXPORT_TYPE]: blocks
        };
    }

}