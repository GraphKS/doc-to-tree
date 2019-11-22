import {Step} from "../Step";
import axios from "axios";
import {readFileSync} from "fs";
import {lexer} from "marked";
import fm from "front-matter";
import {getScopedLogger} from "../Logger";

interface Token {
    type: string,
    depth?: number,
    text?: string,
    lang?: string
    codeBlockStyle?: string
}

function isStep(object: any): object is Step {
    return (object instanceof Step);
}

function TokenToContent(tokens: Array<Token>): string {
    let content = "";
    let listState = -1;
    tokens.forEach(token => {
        switch (token.type) {
            case "paragraph":
                content += `${token.text}\n\n`;
                break;
            case "code":
                content +=
                    `
\`\`\`${token.lang || ""}
${token.text}
\`\`\`

`;
                break;
            case "list_start":
                listState += 1;
                break;
            case "list_item_start":
                content += "\n" + " ".repeat(2 * listState) + "* ";
                break;
            // case "list_item_end":
            //     content += "\n";
            //     break;
            case "list_end":
                listState -= 1;
                // content += "\n";
                break;
            case "text":
                content += token.text;
                break;
            case "space":
                break;
            default:
                break;
        }
    });
    return content.trim();
}

function tokenToSteps(depth: number, tokens: Array<Token>): Array<Step> {
    return tokens
        .map((token, index, array) => {
            if (token.type == "heading" && token.depth == depth) {
                const start = index;
                const subArray = array.slice(start + 1);
                const end = subArray.findIndex(element => element.type == "heading" && element.depth == depth);
                return end == -1 ? array.slice(start) : array.slice(start, start + 1 + end);
            }
        })
        .map(section => {
            if (section != undefined && section.length > 0) {
                const childrens = tokenToSteps(depth + 1, section);
                const nextHeading = section.slice(1).findIndex(element => element.type == "heading");
                const content = section.slice(1, nextHeading != -1 ? nextHeading : undefined);
                const contentString = TokenToContent(content);
                if (section[0].text == undefined) return;
                const step = new Step({title: section[0].text, description: contentString});
                step.addNextSteps(...childrens);
                return step;
            }
        })
        .filter<Step>(isStep);
}

function importMarkdownString(markdown: string): Array<Step> {
    // The file might contain yaml front matter, we only want to parse the body
    let tokens = lexer(markdown);
    let steps = tokenToSteps(1, tokens);
    if (steps.length == 0) {
        // Some documentation don't start with a real title
        // Let's try with yaml front matter
        const frontMatter = fm<{ [attr: string]: string }>(markdown);
        const attributes = frontMatter.attributes;
        const frontMatterTitle = attributes.title ?? attributes.subject ?? attributes.mainTitle;
        if (frontMatterTitle) {
            tokens = lexer(frontMatter.body);
            const withTitle = [{type: "heading", "depth": 1, text: frontMatterTitle}, ...tokens];
            steps = tokenToSteps(1, withTitle);
        } else {
            // Even front matter is empty,
            tokens = lexer(frontMatter.body);
            const withTitle = [{type: "heading", "depth": 1, text: "Documentation"}, ...tokens];
            steps = tokenToSteps(1, withTitle);
        }
    }
    return steps;
}

export async function importMarkdownStep(path: string): Promise<Array<Step>> {
    const logger = getScopedLogger("Import", "Markdown");
    let markdownString: string;
    if (path.startsWith("http")) {
        logger.info(`Importing distant file ${path}.`);
        const resp = await axios.get(path);
        markdownString = resp.data;
    } else {
        logger.info(`Importing file ${path}.`);
        markdownString = readFileSync(path).toString();
    }
    return importMarkdownString(markdownString);

}