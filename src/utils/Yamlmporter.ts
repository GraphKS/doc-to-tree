import {Step} from "../Step";
import Ajv from "ajv";
import {safeLoad} from "js-yaml";
import {readFileSync} from "fs";
import {dirname, resolve} from "path";
import axios from "axios";

const stepSchema = {
    type: "object",
    properties: {
        title: {type: "string"},
        description: {type: "string"},
        note: {type: "string"},
        authors: {
            type: "array",
            items: {
                type: "string"
            }
        },
        externalLinks: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    title: {type: "string"},
                    url: {type: "string"}
                }
            }
        },
        creationTimestamp: {type: "number"},
        steps: {
            type: "array",
            items: {
                type: "string"
            }
        }
    },
    required: ["title", "type", "description"]
};

const ajv = new Ajv();

function loadYaml(yaml: string) {
    const data = safeLoad(yaml);
    if (!ajv.validate(stepSchema, data)) {
        throw new Error(`Import Error. Can't validate schema \n${ajv.errorsText()}`);
    }
    return data;
}

export async function importYamlDistantFile(url: string) {
    const resp = await axios.get(url);
    const data = loadYaml(resp.data);
    const step = new Step(data);

    // add child
    if (step && data.steps && Array.isArray(data.steps)) {
        for (const child of data.steps) {
            if ((child as string).startsWith("http")) {
                const children = await importYamlDistantFile(child);
                step.addNextSteps(children);
            } else {
                throw new Error("Import Error. Distant step can only import distant step.");
            }
        }
    }
    return step;
}

export async function importYamlLocalFile(path: string): Promise<Step> {
    const absPath = resolve(path);
    const yamlString = readFileSync(absPath).toString();
    const data = loadYaml(yamlString);
    const step = new Step(data);

    // add child
    if (step && data.steps && Array.isArray(data.steps)) {
        for (const child of data.steps) {
            if ((child as string).startsWith("http")) {
                const children = await importYamlDistantFile(child);
                step.addNextSteps(children);
            } else {
                const yamlPath = resolve(dirname(path), child);
                step.addNextSteps(await importYamlStep(yamlPath));
            }
        }
    }
    return step;

}


export async function importYamlStep(path: string): Promise<Step> {
    if (path.startsWith("http")) return importYamlDistantFile(path);
    else return importYamlLocalFile(path);
}