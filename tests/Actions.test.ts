import {PassiveAction} from "../src/Actions/PassiveAction";

describe("Actions", () => {
    test("it allows connection", () => {
        const start = new PassiveAction({id: "start", title: "foo"});
        const end = new PassiveAction({id: "end", title: "bar"});
        start.addEdge(end);
    });

    test("it doesn't allow replacing connection", () => {
        const start = new PassiveAction({id: "start", title: "foo"});
        const end = new PassiveAction({id: "end", title: "bar"});
        start.addEdge(end);
        expect(() => {
            start.addEdge(end);
        }).toThrow();

    });
});