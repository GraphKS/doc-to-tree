import {Step} from "../src/Actions/Step";

describe("Actions", () => {
    test("it allows connection", () => {
        const start = new Step({id: "start", title: "foo"});
        const end = new Step({id: "end", title: "bar"});
        start.addEdge(end);
    });

    test("it doesn't allow replacing connection", () => {
        const start = new Step({id: "start", title: "foo"});
        const end = new Step({id: "end", title: "bar"});
        start.addEdge(end);
        expect(() => {
            start.addEdge(end);
        }).toThrow();

    });
});