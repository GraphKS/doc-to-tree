import {Action} from "../src/Actions/Action";

describe("Actions", () => {
    test("it allows connection", () => {
        const start = new Action({id: "start", title: "foo"});
        const end = new Action({id: "end", title: "bar"});
        start.addEdge(end);
    });

    test("it doesn't allow replacing connection", () => {
        const start = new Action({id: "start", title: "foo"});
        const end = new Action({id: "end", title: "bar"});
        start.addEdge(end);
        expect(() => {
            start.addEdge(end);
        }).toThrow();

    });
});