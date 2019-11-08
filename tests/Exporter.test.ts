import {Procedure} from "../src/procedure";
import {MarkdowExporter} from "../src/Exporter/Markdown/MarkdowExporter";
import {Step} from "../src/Actions/Step";

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
        name: "myProcedure",
        description: "simple test",
        authors: ["Logtopus"]
    });
    procedure.addStep(start, mid, end);
    return procedure;
}

describe("MarkdownExporter", () => {
    test("it give correct order", () => {
        const procedure = createSimpleProcedure();
        const exporter = new MarkdowExporter(procedure);
        const actions = procedure.preOrder();  // This is a private method
        expect(actions).toStrictEqual([procedure.steps[0], procedure.steps[1], procedure.steps[2]]);
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
});