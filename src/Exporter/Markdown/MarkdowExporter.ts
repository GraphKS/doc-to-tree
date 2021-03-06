import * as Handlebars from "handlebars";
import {Exporter} from "../Exporter";
import {readFileSync} from "fs";
import {resolve} from "path";
import {Step} from "../../Step";
import {getScopedLogger} from "../../Logger";


Handlebars.registerHelper("nestedTitle", (title: string, depth: number) => {
    return [...Array(depth + 1).fill(null).map(() => "#"), " ", title].join("");
});

Handlebars.registerHelper("anchorLink", (target: string) => {
    return `#${target.toLowerCase().replace(/ /g, "-")}`;
});

const resources = resolve(__dirname, "../../../", "resources/template/exporter/markdown");
const templateDefinition = readFileSync(resolve(resources, "template.handlebars")).toString();

const template = Handlebars.compile(templateDefinition, {preventIndent: true});

export class MarkdowExporter extends Exporter<Step> {
    protected logger = getScopedLogger("Export", "Markdown");

    public export(): string {
        const data = {
            procedure: this.step.export(),
            steps: this.step.preOrder().filter(step => !step.isRoot()).map(step => {
                return step.export();
            })
        };
        this.logger.info(`About to export a .md documentation with ${data.steps.length} steps in it.`);
        return template(data);
    }

    public static export(step: Step): string {
        const exporter = new this(step);
        return exporter.export();
    }
}