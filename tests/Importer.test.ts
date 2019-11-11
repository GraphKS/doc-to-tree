import {importSingleYaml} from "../src/Importer/yamlmporter";
import {Procedure} from "../src/procedure";

describe("YamlImport", () => {
    test("it import step", () => {
        const stepYaml = `
type: "step"
title: "foo"
description: "bar"
        `;
        const step = importSingleYaml(stepYaml);
        expect(step.title).toBe("foo");
        expect(step.description).toBe("bar");
    });

    test("it import procedure", () => {
        const stepYaml = `
type: "procedure"
title: "foo"
description: "bar"
authors:
  - pierre
        `;
        const step = importSingleYaml(stepYaml) as Procedure;
        expect(step.title).toBe("foo");
        expect(step.description).toBe("bar");
        expect(step.authors[0]).toBe("pierre");
    });

    test("it doesn't import missing title", () => {
        const stepYaml = `
type: "procedure"
description: "foo"
        `;
        expect(() => importSingleYaml(stepYaml)).toThrow("Import Error");
    });
    test("it doesn't import missing description", () => {
        const stepYaml = `
type: "procedure"
title: "foo"
        `;
        expect(() => importSingleYaml(stepYaml)).toThrow("Import Error");
    });

    test("it doesn't import invalid step", () => {
        const stepYaml = `
type: "INVALID"
title: "foo"
description: "bar"
        `;
        expect(() => importSingleYaml(stepYaml)).toThrow("Import Error");
    });

});
