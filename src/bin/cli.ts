#!/usr/bin/env node
import {Command} from "commander";
import {Step} from "../step";
import {Exporter} from "../Exporter/Exporter";
import {MarkdowExporter} from "../Exporter/Markdown/MarkdowExporter";
import {DotExporter} from "../Exporter/Dot/DotExporter";
import {dirname, resolve} from "path";
import {importYamlStep} from "../utils/Yamlmporter";
import {importMarkdownStep} from "../utils/MarkdownImporter";
import {YamlExporter} from "../Exporter/Yaml/YamlExporter";
import {mkdirSync} from "fs";
import sanitize = require("sanitize-filename");

const program = new Command("Logtopus");

program
    .command("generate <type> <step>")
    .description("Generate an output of a specific type of the step.")
    .option("-o, --output <output>", "output in a file. Like: './output/doc.md'")
    .action(async (type: string, procedure: string, options: any) => {
        await generate(type, procedure, options).catch(console.log);
    });

program
    .command("import-markdown <doc>")
    .description("Generate the Yaml file structure from a markdown documentation")
    .option("-o, --output <output>", "output in a directory. Like: './output'")
    .action(async (doc: string, options: any) => {
        await importMarkdown(doc, options).catch(console.log);
    });

program.parse(process.argv);

if (!program.args.length) program.help();

async function generate(type: string, path: string, {output}: any) {
    console.log(`Generating documentation for ${path}`);
    const procedure = await importYamlStep(path);
    let exporter: Exporter<Step>;
    console.log(`Selected output type: ${type}`);
    switch (type) {
        case "markdown":
            exporter = new MarkdowExporter(procedure);
            break;
        case "dot":
            exporter = new DotExporter(procedure);
            break;
        default:
            console.log("Invalid types");
            console.log("Available types are: markdown, dot");
            return;
    }
    if (!output) {
        switch (type) {
            case "markdown":
                output = "doc.md";
                break;
            case "dot":
                output = "doc.dot";
                break;
        }
    }
    exporter.exportToDisk(output);
    console.log(`Documentation is now available in ${resolve(output)}`);
}

async function importMarkdown(path: string, {output = "./"}: any) {
    const docs = await importMarkdownStep(path);
    const separator = "subSteps";
    for (const doc of docs) {
        for (const step of doc.preOrder()) {
            const path = resolve(output, ...new Array(step.depth()).fill(separator), sanitize(step.title)+'.yaml');
            const exporter = new YamlExporter(step, separator);
            mkdirSync(dirname(path), {recursive: true});
            exporter.exportToDisk(path);
        }
    }
}