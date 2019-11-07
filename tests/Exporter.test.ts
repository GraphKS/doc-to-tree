import {PassiveAction} from "../src/Actions/PassiveAction";
import {Procedure} from "../src/procedure";
import {MarkdowExporter} from "../src/Exporter/Markdown/MarkdowExporter";

function createSimpleProcedure(): Procedure {
    const start = new PassiveAction({
        id: "start",
        title: "foo",
        description: "Do nothing to start",
        includeInExport: true
    });
    const mid = new PassiveAction({
        id: "mid",
        title: "mid",
        description: "Do nothing to mid",
        includeInExport: true
    });
    const end = new PassiveAction({
        id: "end",
        title: "bar",
        description: "Do nothing to end",
        includeInExport: true
    });
    start.addEdge(mid);
    mid.addEdge(end, "You should end.");
    return new Procedure({
        name: "myProcedure",
        description: "simple test",
        start: start,
        ends: [end],
        authors: ["Logtopus"]
    });
}

describe("MarkdownExporter", () => {
    test("it give correct order", () => {
        const procedure = createSimpleProcedure();
        const exporter = new MarkdowExporter(procedure);
        const actions = exporter["getActionInOrder"]();  // This is a private method
        expect(actions).toStrictEqual([procedure.start, procedure.start.edges[0].target, procedure.ends[0]]);
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
        expect(documentation).toMatch("You should end.");
        expect(documentation).toMatch("## bar");
        console.log(documentation);
    });
});