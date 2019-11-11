import {Step} from "../Step";
import Ajv from "ajv";
import {Procedure} from "../procedure";
import {safeLoad} from "js-yaml";

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
        creationTimestamp: {type: "number"}
    },
    required: ["title", "type", "description"]
};

const ajv = new Ajv();

export function importSingleYaml(yamlString: string): Step {
    const data = safeLoad(yamlString);
    const valid = ajv.validate(stepSchema, data);
    if (!valid) {
        throw new Error(`Import Error. Can't validate schema \n${ajv.errorsText()}`);
    }
    switch (data.type) {
        case "step":
            return new Step(data);
        case "procedure":
            return new Procedure(data);
        default:
            throw new Error(`Import Error. Unsupported type ${data.type}`);
    }

}