import {importYamlStep} from "../src/utils/yamlmporter";
import {Procedure} from "../src/procedure";
import {resolve} from "path";
import {Step} from "../src/Step";
import {DotExporter} from "../src/Exporter/Dot/DotExporter";
import {MarkdowExporter} from "../src/Exporter/Markdown/MarkdowExporter";
import {importMarkdownStep} from "../src/utils/MarkdownImporter";

describe("YamlImport", () => {
    test("it import step", async () => {
        const yamlPath = resolve(__dirname, "resources", "import", "step.yaml");
        const step = await importYamlStep(yamlPath);
        expect(step.title).toBe("foo");
        expect(step.description).toBe("bar");
    });

    test("it import procedure", async () => {
        const yamlPath = resolve(__dirname, "resources", "import", "procedure.yaml");
        const step = await importYamlStep(yamlPath) as Procedure;
        expect(step.title).toBe("foo");
        expect(step.description).toBe("bar");
        expect(step.authors[0]).toBe("pierre");
    });

    test("it doesn't import missing title", async () => {
        const yamlPath = resolve(__dirname, "resources", "import", "missingTitle.yaml");
        await expect(importYamlStep(yamlPath)).rejects.toBeDefined();
    });
    test("it doesn't import missing description", async () => {
        const yamlPath = resolve(__dirname, "resources", "import", "missingDesc.yaml");
        await expect(importYamlStep(yamlPath)).rejects.toBeDefined();
    });

    test("it doesn't import invalid step", async () => {
        const yamlPath = resolve(__dirname, "resources", "import", "invalidStep.yaml");
        await expect(importYamlStep(yamlPath)).rejects.toBeDefined();
    });

    test("it import tree structure", async () => {
        const yamlPath = resolve(__dirname, "resources", "import", "tree", "procedure.yaml");
        const step = await importYamlStep(yamlPath) as Procedure;
        expect(step.title).toBe("foo");
        expect(step.description).toBe("bar");
        expect((step.childrens[0] as Step).title).toBe("step1");
        expect((step.childrens[1] as Step).title).toBe("step2");

        // for reference and demo
        console.log(DotExporter.export(step));

        console.log(MarkdowExporter.export(step));
    });
});

describe("MarkdownImport", () => {
    test("it import markdown procedure", async () => {
        const mdPath = resolve(__dirname, "resources", "import", "procedure.md");
        const steps = await importMarkdownStep(mdPath);
        expect(steps).toHaveLength(1);
        const step = steps[0];
        expect(step.title).toBe("Title");
        expect(step.description).toBe("This is the procedure description.");

        expect(step.childrens).toHaveLength(3);

        expect(step.childrens[0]).toHaveProperty("title", "Intro");
        expect((<Step>step.childrens[0]).description).toMatch("This is the **introduction**.");
        expect((<Step>step.childrens[0]).description).toMatch("URL");
        expect((<Step>step.childrens[0]).description).toMatch("* list1");
        expect(step.childrens[1]).toHaveProperty("title", "Code");
        expect((<Step>step.childrens[1]).description).toMatch("Hello world");
        expect((<Step>step.childrens[1]).description).toMatch("```shell");
        expect(step.childrens[2]).toHaveProperty("title", "Step");
        expect(step.childrens[2].childrens).toHaveLength(1);
        expect(step.childrens[2].childrens[0]).toHaveProperty("title", "Substep");


    });
    test("it import remote doc", async ()=>{
        const steps = await importMarkdownStep("https://raw.githubusercontent.com/markedjs/marked/master/README.md");
        expect(steps).toHaveLength(1)
    })
});