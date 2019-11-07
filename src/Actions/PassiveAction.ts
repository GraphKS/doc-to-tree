import {Action, Context} from "./Action";
import {ExportBlock} from "../Exporter/Exporter";

export class PassiveAction extends Action {
    protected async execute(ctx: Context): Promise<any> {
        return {};
    }

    public export(): Array<ExportBlock> {
        const blocks: Array<ExportBlock> = [
            {
                type: "markdown-title",
                content: this.title
            },
            {
                type: "markdown-paragraph",
                content: this.description
            },
            {
                type: "markdown-title",
                content: this.comments
            },
            {
                type: "markdown-paragraph",
                content: "Next steps:"
            }
        ];

        for (const edge of this.edges) {
            blocks.push({
                    type: "markdown-paragraph",
                    content: edge.comment
                },
                {
                    type: "markdown-link",
                    target: edge.target.title,
                    label: edge.target.title
                });
        }

        return blocks;
    }

}