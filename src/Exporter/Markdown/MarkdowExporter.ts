import * as Handlebars from "handlebars";
import {Exporter} from "../Exporter";
import {readFileSync} from "fs";
import {join} from "path";
import {Step} from "../../Step";
import {Procedure} from "../../procedure";


Handlebars.registerHelper("nestedTitle", (title: string, depth: number) => {
    return [...Array(depth).fill(null).map(() => "#"), " ", title].join("");
});

Handlebars.registerHelper("anchorLink", (target: string) => {
    return `#${target.toLowerCase().replace(/ /g, "-")}`;
});

const templateDefinition = readFileSync(join(__dirname, "template.handlebars")).toString();

const template = Handlebars.compile(templateDefinition, {preventIndent: true});

export class MarkdowExporter extends Exporter {
    public export(): string {
        const data = {
            procedure: this.procedure.export(),
            steps: this.procedure.preOrder().filter(step => !step.isRoot()).map(step => {
                if (step instanceof Step) {
                    return step.export();
                } else return {};
            })
        };
        return template(data);
    }

    public static export(procedure: Procedure): string {
        const exporter = new this(procedure);
        return exporter.export();
    }
}