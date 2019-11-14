import {Step} from "../Step";
import Ajv from "ajv";
import {Procedure} from "../procedure";
import {safeLoad} from "js-yaml";
import {readFileSync} from "fs";
import {dirname, resolve} from "path";
import axios from "axios";

const stepSchema = {
    type: "object",
    properties: {
        type: {type: "string"},
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

export async function importYamlStepString(yamlString: string, path: string): Promise<Step> {
    const data = safeLoad(yamlString);
    const valid = ajv.validate(stepSchema, data);
    if (!valid) {
        throw new Error(`Import Error. Can't validate schema \n${ajv.errorsText()}`);
    }

    let step: Step | Procedure;

    switch (data.type) {
        case "step":
            step = new Step(data);
            break;
        case "procedure":
            step = new Procedure(data);
            break;
        default:
            throw new Error(`Import Error. Unsupported type ${data.type}`);
    }

    // add child
    if (step && data.steps && Array.isArray(data.steps)) {
        for (const child of data.steps) {
            try {
                // it might be a remote procedure
                const url = new URL(child);
                const resp = await axios.get(url.href);
                const data = resp.data;
                step.addChildren(await importYamlStepString(data, path));
            } catch (e) {
                const yamlPath = resolve(dirname(path), child);
                step.addChildren(await importYamlStep(yamlPath));
            }
        }
    }
    return step;

}


export async function importYamlStep(path: string): Promise<Step> {
    const absPath = resolve(path);
    const yamlString = readFileSync(absPath).toString();
    return importYamlStepString(yamlString, path);

}