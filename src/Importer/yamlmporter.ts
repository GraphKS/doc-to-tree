import {Step} from "../Step";
import Ajv from "ajv";
import {Procedure} from "../procedure";
import {safeLoad} from "js-yaml";
import {readFileSync} from "fs";
import {dirname, resolve} from "path";


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


export function importYamlStep(path: string): Step {
    const absPath = resolve(path);
    const yamlString = readFileSync(absPath).toString();
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
        (data.steps as Array<string>)
            .map(childPath => resolve(dirname(path), childPath))
            .map(path => importYamlStep(path))
            .forEach(s => step.addChildren(s));
    }

    return step;

}