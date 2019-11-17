import {Exporter} from "../Exporter";
import {Step} from "../../Step";
import {readFileSync} from "fs";
import {resolve} from "path";
import * as Handlebars from "handlebars";
import {Procedure} from "../../procedure";


const resources = resolve(__dirname, "../../../", "resources/template/exporter/dot");

const templateDefinition = readFileSync(resolve(resources, "template.handlebars")).toString();

const template = Handlebars.compile(templateDefinition, {preventIndent: true});

export class DotExporter extends Exporter {
    public export(): string {
        const data = {
            title: this.procedure.title,
            edges: this.procedure.preOrder().flatMap(step => {
                if (step instanceof Step) {
                    return step.childrens.map(child => {
                        if (child instanceof Step) return {source: step.title, target: child.title};
                    });
                }
            })
        };
        return template(data);
    }

    public static export(procedure: Procedure): string {
        const exporter = new this(procedure);
        return exporter.export();
    }
}