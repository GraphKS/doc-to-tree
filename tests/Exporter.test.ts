import {MarkdowExporter} from "../src/Exporter/Markdown/MarkdowExporter";
import {DotExporter} from "../src/Exporter/Dot/DotExporter";
import {LoremStep} from "../src/Steps/LoremStep";
import {Step} from "../src/Step";
import {YamlExporter} from "../src/Exporter/Yaml/YamlExporter";

function createSimpleDoc(): Step {
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

    const procedure = new Step({
        title: "myStep",
        description: "simple test",
        authors: ["Logtopus"]
    });
    procedure.addNextSteps(start, mid, end);
    return procedure;
}

function createNestedStep() {
    const procedure = new Step({title: "Create a nodeJS App"});
    const installation = new Step({title: "Install NodeJS"});

    const mac = new Step({title: "Mac"});
    mac.addNextSteps(new LoremStep({
        title: "install brew",
        externalLinks: [{title: "brew website", url: "https://brew.sh/index_fr"}]
    }), new LoremStep({title: "brew install"}));
    const windows = new Step({title: "Windows"});
    windows.addNextSteps(new LoremStep({title: "Download .exe"}), new LoremStep({title: "install from .exe"}));
    const linux = new Step({title: "Linux"});
    linux.addNextSteps(new LoremStep({title: "apt-get install"}));

    installation.addNextSteps(mac, windows, linux);

    const dev = new LoremStep({title: "dev your app"});

    const deploy = new Step({title: "Deployment"});
    const clever = new Step({title: "Clever Cloud"});
    clever.addNextSteps(new Step({title: "Install clever cli"}), new LoremStep({title: "Clever Cloud cli login"}), new LoremStep({title: "Clever deploy"}));

    const aws = new Step({title: "AWS"});
    aws.addNextSteps(new Step({title: "Install AWS cli"}), new LoremStep({title: "AWS cli login"}), new LoremStep({title: "AWS deploy"}));

    const azure = new Step({title: "Azure"});
    azure.addNextSteps(new Step({title: "Install Azure cli"}), new LoremStep({title: "Azure cli login"}), new LoremStep({title: "Azure deploy"}));

    deploy.addNextSteps(clever, aws, azure);

    procedure.addNextSteps(installation, dev, deploy);
    return procedure;
}

describe("MarkdownExporter", () => {
    test("it give correct order", () => {
        const procedure = createSimpleDoc();
        const actions = procedure.preOrder();  // This is a private method
        expect(actions).toStrictEqual([procedure, ...procedure.nextSteps]);
    });
    test("it generate markdown", () => {
        const procedure = createSimpleDoc();
        const exporter = new MarkdowExporter(procedure);
        const documentation = exporter.export();
        expect(documentation.length).toBeGreaterThan(0);
        expect(documentation).toMatch("# myStep");
        expect(documentation).toMatch("* Logtopus");
        expect(documentation).toMatch("simple test");
        expect(documentation).toMatch("## foo");
        expect(documentation).toMatch("## mid");
        expect(documentation).toMatch("You should end");
        expect(documentation).toMatch("## bar");
        console.log(documentation);
    });
    test("it generate markdown for nested structure", () => {
        const procedure = createNestedStep();

        const exporter = new MarkdowExporter(procedure);
        const documentation = exporter.export();

        expect(documentation).toMatch("* [Install NodeJS](#install-nodejs)");
        expect(documentation).toMatch("* [brew website](https://brew.sh/index_fr)");
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
        const procedure = createSimpleDoc();
        const exporter = new DotExporter(procedure);
        const documentation = exporter.export();
        expect(documentation.length).toBeGreaterThan(0);
        expect(documentation).toMatch("\"myStep\"->\"foo\"");
        expect(documentation).toMatch("\"myStep\"->\"mid\"");
        expect(documentation).toMatch("\"myStep\"->\"bar\"");
        console.log(documentation);
    });
    test("it generate dot for nested structure", () => {
        const procedure = createNestedStep();

        const exporter = new DotExporter(procedure);
        const documentation = exporter.export();

        // expect(documentation).toMatch("* [Install NodeJS](#install-nodejs)");


        console.log(documentation);
    });
});

describe("YamlExporter", () => {
    test("it generate yaml", () => {
        const step = new Step({
            title: "foo",
            description: "hello **world**"
        });
        step.addNextSteps(new Step({title: "foo//-bar"}));
        const yaml = YamlExporter.export(step);
        const expected = `
title: foo
description:|
hello **world**
steps:
  - ./foo-bar.yaml    
        `.trim();
        expect(yaml).toBe(expected);
    });
});