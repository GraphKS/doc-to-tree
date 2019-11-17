#!/usr/bin/env node
import {Command} from "commander";
import {Procedure} from "../procedure";
import {Exporter} from "../Exporter/Exporter";
import {MarkdowExporter} from "../Exporter/Markdown/MarkdowExporter";
import {DotExporter} from "../Exporter/Dot/DotExporter";
import {resolve} from "path";

const program = new Command("Logtopus");

program
    .command("generate <type> <procedure>")
    .description("Generate an output of a specific type of the procedure.")
    .option("-o, --output <output>", "output in a file. Like: './output/doc.md'")
    .action(async (type: string, procedure: string, options: any) => {
        await generate(type, procedure, options).catch(console.log);
    });

program.parse(process.argv);

if (!program.args.length) program.help();

async function generate(type: string, path: string, {output}: any) {
    console.log(`Generating documentation for ${path}`);
    const procedure = await Procedure.fromYaml(path);
    let exporter: Exporter;
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