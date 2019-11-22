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
import {Signale} from "signale";
import {getLogger, getScopedLogger, setLogger} from "../Logger";
import sanitize = require("sanitize-filename");

const program = new Command("Logtopus")
    .option("-v, --verbose", "Increase verbosity");


program
    .command("generate <type> <step>")
    .description("Generate an output of a specific type of the step.")
    .option("-o, --output <output>", "output in a file. Like: './output/doc.md'")
    .action(async (type: string, procedure: string, options: any) => {
        await generate(type, procedure, options).catch((e)=>getLogger().error(e));
    });

program
    .command("import-markdown <doc>")
    .description("Generate the Yaml file structure from a markdown documentation")
    .option("-o, --output <output>", "output in a directory. Like: './output'")
    .action(async (doc: string, options: any) => {
        if (options.verbose) setLogger(new Signale((<any>{logLevel: "debug"})));
        await importMarkdown(doc, options).catch((e)=>getLogger().error(e));
    });

program.parse(process.argv);
if (!program.args.length) program.help();
if (program.verbose) setLogger(new Signale((<any>{logLevel: "debug"})));

async function generate(type: string, path: string, {output}: any) {
    const logger = getScopedLogger("cli");
    logger.info(`Generating documentation for "${path}"`);
    logger.start("Importing Yaml files...");
    const procedure = await importYamlStep(path);
    logger.success("Documentation successfully imported!");
    let exporter: Exporter<Step>;
    logger.info(`Selected output type: ${type}`);
    switch (type) {
        case "markdown":
            exporter = new MarkdowExporter(procedure);
            break;
        case "dot":
            exporter = new DotExporter(procedure);
            break;
        default:
            logger.error("Invalid types");
            logger.error("Available types are: markdown, dot");
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
    logger.start("Exporting Documentation...");
    exporter.exportToDisk(output);
    logger.success("Documentation successfully exported!");
    logger.complete(`Documentation is now available in "${resolve(output)}".`);
}

async function importMarkdown(path: string, {output = "./"}: any) {
    const logger = getScopedLogger("cli");
    logger.info(`Importing existing documention from "${path}"`);
    logger.start("Import markdown...");
    const docs = await importMarkdownStep(path);
    logger.success("Documentation successfully imported!");
    logger.start("Generating Yaml files...");
    const separator = "subSteps";
    for (const doc of docs) {
        for (const step of doc.preOrder()) {
            const outputPath = resolve(output, ...new Array(step.depth()).fill(separator), sanitize(step.title) + '.yaml');
            const exporter = new YamlExporter(step, separator);
            mkdirSync(dirname(outputPath), {recursive: true});
            exporter.exportToDisk(outputPath);
        }
    }
    logger.success("Documentation successfully imported!");
    logger.complete(`Yaml files are now available in folder "${resolve(output)}".`);

}