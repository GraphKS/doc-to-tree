import {PassiveAction} from "../src/Actions/PassiveAction";

describe("Actions", () => {
    test("it allows connection", () => {
        const start = new PassiveAction({id: "start", title: "foo", includeInExport: true, description: ""});
        const end = new PassiveAction({id: "end", title: "bar", includeInExport: true, description: ""});
        start.addDirectEdge(end);
    });

    test("it doesn't allow replacing connection", () => {
        const start = new PassiveAction({id: "start", title: "foo", includeInExport: true, description: ""});
        const end = new PassiveAction({id: "end", title: "bar", includeInExport: true, description: ""});
        start.addDirectEdge(end);
        expect(() => {
            start.addDirectEdge(end);
        }).toThrow();

    });
});