import {importYamlStep} from "../src/Importer/yamlmporter";
import {Procedure} from "../src/procedure";
import {resolve} from "path";
import {Step} from "../src/Step";
import {DotExporter} from "../src/Exporter/Dot/DotExporter";
import {MarkdowExporter} from "../src/Exporter/Markdown/MarkdowExporter";

describe("YamlImport", () => {
    test("it import step", () => {
        const yamlPath = resolve(__dirname, "resources", "import", "step.yaml");
        const step = importYamlStep(yamlPath);
        expect(step.title).toBe("foo");
        expect(step.description).toBe("bar");
    });

    test("it import procedure", () => {
        const yamlPath = resolve(__dirname, "resources", "import", "procedure.yaml");
        const step = importYamlStep(yamlPath) as Procedure;
        expect(step.title).toBe("foo");
        expect(step.description).toBe("bar");
        expect(step.authors[0]).toBe("pierre");
    });

    test("it doesn't import missing title", () => {
        const yamlPath = resolve(__dirname, "resources", "import", "missingTitle.yaml");
        expect(() => importYamlStep(yamlPath)).toThrow("Import Error");
    });
    test("it doesn't import missing description", () => {
        const yamlPath = resolve(__dirname, "resources", "import", "missingDesc.yaml");
        expect(() => importYamlStep(yamlPath)).toThrow("Import Error");
    });

    test("it doesn't import invalid step", () => {
        const yamlPath = resolve(__dirname, "resources", "import", "invalidStep.yaml");
        expect(() => importYamlStep(yamlPath)).toThrow("Import Error");
    });

    test("it import tree structure", () => {
        const yamlPath = resolve(__dirname, "resources", "import", "tree", "procedure.yaml");
        const step = importYamlStep(yamlPath) as Procedure;
        expect(step.title).toBe("foo");
        expect(step.description).toBe("bar");
        expect((step.childrens[0] as Step).title).toBe("step1");
        expect((step.childrens[1] as Step).title).toBe("step2");

        // for reference and demo
        console.log(DotExporter.export(step));

        console.log(MarkdowExporter.export(step))
    });

});
