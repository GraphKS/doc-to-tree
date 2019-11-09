import {Procedure} from "../src/procedure";
import {MarkdowExporter} from "../src/Exporter/Markdown/MarkdowExporter";
import {DotExporter} from "../src/Exporter/Dot/DotExporter";
import {LoremStep} from "../src/Steps/LoremStep";
import {Step} from "../src/Step";

function createSimpleProcedure(): Procedure {
    const start = new Step({
        title: "foo",
        description: "Do nothing to start"
    });
    const mid = new Step({
        title: "mid",
        description: "Do nothing to mid"
    });
    const end = new Step({
        title: "bar",
        description: "Do nothing to end",
        note: "You should end"
    });

    const procedure = new Procedure({
        title: "myProcedure",
        description: "simple test",
        authors: ["Logtopus"]
    });
    procedure.addChildren(start, mid, end);
    return procedure;
}

function createNestedProcedure() {
    const procedure = new Procedure({title: "Create a nodeJS App"});
    const installation = new Procedure({title: "Install NodeJS"});

    const mac = new Procedure({title: "Mac"});
    mac.addChildren(new LoremStep({title: "install brew"}), new LoremStep({title: "brew install"}));
    const windows = new Procedure({title: "Windows"});
    windows.addChildren(new LoremStep({title: "Download .exe"}), new LoremStep({title: "install from .exe"}));
    const linux = new Procedure({title: "Linux"});
    linux.addChildren(new LoremStep({title: "apt-get install"}));

    installation.addChildren(mac, windows, linux);

    const dev = new LoremStep({title: "dev your app"});

    const deploy = new Procedure({title: "Deployment"});
    const clever = new Procedure({title: "Clever Cloud"});
    clever.addChildren(new Procedure({title: "Install clever cli"}), new LoremStep({title: "Clever Cloud cli login"}), new LoremStep({title: "Clever deploy"}));

    const aws = new Procedure({title: "AWS"});
    aws.addChildren(new Procedure({title: "Install AWS cli"}), new LoremStep({title: "AWS cli login"}), new LoremStep({title: "AWS deploy"}));

    const azure = new Procedure({title: "Azure"});
    azure.addChildren(new Procedure({title: "Install Azure cli"}), new LoremStep({title: "Azure cli login"}), new LoremStep({title: "Azure deploy"}));

    deploy.addChildren(clever, aws, azure);

    procedure.addChildren(installation, dev, deploy);
    return procedure;
}

describe("MarkdownExporter", () => {
    test("it give correct order", () => {
        const procedure = createSimpleProcedure();
        const actions = procedure.preOrder();  // This is a private method
        expect(actions).toStrictEqual([procedure, ...procedure.childrens]);
    });
    test("it generate markdown", () => {
        const procedure = createSimpleProcedure();
        const exporter = new MarkdowExporter(procedure);
        const documentation = exporter.export();
        expect(documentation.length).toBeGreaterThan(0);
        expect(documentation).toMatch("# myProcedure");
        expect(documentation).toMatch("* Logtopus");
        expect(documentation).toMatch("simple test");
        expect(documentation).toMatch("## foo");
        expect(documentation).toMatch("## mid");
        expect(documentation).toMatch("You should end");
        expect(documentation).toMatch("## bar");
        console.log(documentation);
    });
    test("it generate markdown for nested structure", () => {
        const procedure = createNestedProcedure();

        const exporter = new MarkdowExporter(procedure);
        const documentation = exporter.export();

        expect(documentation).toMatch("* [Install NodeJS](#install-nodejs)");
        expect(documentation).toMatch("* [dev your app](#dev-your-app)");
        expect(documentation).toMatch("* [Deployment](#deployment)");
        expect(documentation).toMatch("* [Mac](#mac)");
        expect(documentation).toMatch("* [Windows](#windows)");
        expect(documentation).toMatch("* [Linux](#linux)");
        expect(documentation).toMatch("* [Clever Cloud](#clever-cloud)");
        expect(documentation).toMatch("## Install clever cli");

        console.log(documentation);
    });
});

describe("DotExporter", () => {
    test("it generate dot", () => {
        const procedure = createSimpleProcedure();
        const exporter = new DotExporter(procedure);
        const documentation = exporter.export();
        expect(documentation.length).toBeGreaterThan(0);
        expect(documentation).toMatch("\"myProcedure\"->\"foo\"");
        expect(documentation).toMatch("\"myProcedure\"->\"mid\"");
        expect(documentation).toMatch("\"myProcedure\"->\"bar\"");
        console.log(documentation);
    });
    test("it generate dot for nested structure", () => {
        const procedure = createNestedProcedure();

        const exporter = new DotExporter(procedure);
        const documentation = exporter.export();

        // expect(documentation).toMatch("* [Install NodeJS](#install-nodejs)");


        console.log(documentation);
    });
});