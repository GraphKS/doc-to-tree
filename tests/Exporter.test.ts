import {PassiveAction} from "../src/Actions/PassiveAction";
import {Procedure} from "../src/procedure";
import {MarkdowExporter} from "../src/Exporter/MarkdowExporter";

describe("MarkdownExporter", () => {
    test("it give correct order", () => {
        const start = new PassiveAction({id: "start", title: "foo", includeInExport: true, description: ""});
        const end = new PassiveAction({id: "end", title: "bar", includeInExport: true, description: ""});
        end.connectAfter(start);
        const procedure = new Procedure({name: "", start: start, ends: [end]});
        const exporter = new MarkdowExporter(procedure);
        const actions = exporter["getActionOrder"]();  // This is a private method
        expect(actions).toStrictEqual([start, end]);
    });
});