import {importYamlStep} from "../src/Importer/yamlmporter";
import {Procedure} from "../src/procedure";
import {resolve} from "path";
import {Step} from "../src/Step";
import {DotExporter} from "../src/Exporter/Dot/DotExporter";
import {MarkdowExporter} from "../src/Exporter/Markdown/MarkdowExporter";

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
        await expect(importYamlStep(yamlPath)).rejects.toBeDefined()
    });
    test("it doesn't import missing description", async () => {
        const yamlPath = resolve(__dirname, "resources", "import", "missingDesc.yaml");
        await expect(importYamlStep(yamlPath)).rejects.toBeDefined()
    });

    test("it doesn't import invalid step", async () => {
        const yamlPath = resolve(__dirname, "resources", "import", "invalidStep.yaml");
        await expect(importYamlStep(yamlPath)).rejects.toBeDefined()
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

        console.log(MarkdowExporter.export(step))
    });

});
