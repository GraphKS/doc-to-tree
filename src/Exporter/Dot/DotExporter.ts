import {Exporter} from "../Exporter";
import {Step} from "../../Step";
import {readFileSync} from "fs";
import {join} from "path";
import * as Handlebars from "handlebars";

const templateDefinition = readFileSync(join(__dirname, "template.handlebars")).toString();

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
}