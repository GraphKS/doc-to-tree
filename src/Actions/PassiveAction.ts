import {Action, Context} from "./Action";
import {MarkdownBlockType, MarkdownLink, MarkdownParagraph, MarkdownTitle} from "../Exporter/Markdown/MarkdowExporter";

export class PassiveAction extends Action {
    protected async execute(ctx: Context): Promise<any> {
        return {};
    }

    export(): Array<MarkdownBlockType> {
        const blocks: Array<MarkdownBlockType> = [
            new MarkdownTitle({title: this.title}),
            new MarkdownParagraph({content: this.description}),
            new MarkdownParagraph({content: this.comments}),
            new MarkdownParagraph({content: "Next steps:"})
        ];
        this.edges.forEach(edge => {
            blocks.push(new MarkdownParagraph({content: edge.comment}),
                new MarkdownLink({label: edge.target.title, target: edge.target.title}));
        });
        return blocks;
    }

}