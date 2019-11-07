import {Procedure} from "../src/procedure";
import {Action} from "../src/Actions/Action";

describe("Procedure", () => {
    test("it allow trivial procedure", async () => {
        const start = new Action({id: "start", title: "foo"});
        const end = new Action({id: "end", title: "bar"});
        start.addEdge(end);
        const procedure = new Procedure({
            name: "myTestProcedure",
            start: start,
            ends: [end]
        });
        expect(procedure.name).toBe("myTestProcedure");
        expect(start.edges[0].target).toBe(end);
    });

    test("it doesn't allow cyclic", async () => {
        const start = new Action({id: "start", title: "foo"});
        const end = new Action({id: "end", title: "bar"});

        start.addEdge(end);
        end.addEdge(start);

        expect(() => {
            new Procedure({
                name: "myTestProcedure",
                start: start,
                ends: [end]
            });
        }).toThrow("This graph is cyclic");
    });

    test("it doesn't allow multiple Id", async () => {
        const start = new Action({id: "foo", title: "foo"});
        const end = new Action({id: "foo", title: "foo"});

        start.addEdge(end);

        expect(() => {
            new Procedure({
                name: "myTestProcedure",
                start: start,
                ends: [end]
            });
        }).toThrow("appear in multiple nodes");
    });
});