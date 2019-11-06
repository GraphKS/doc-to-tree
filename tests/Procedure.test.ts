import {Procedure} from "../src/procedure";
import {PassiveAction} from "../src/Actions/PassiveAction";

describe("Procedure", () => {
    test("it allow trivial procedure", async () => {
        const start = new PassiveAction({id: "start", title: "foo"});
        const end = new PassiveAction({id: "end", title: "bar"});
        start.addDirectEdge(end);
        const procedure = new Procedure({
            name: "myTestProcedure",
            start: start,
            ends: [end]
        });
        expect(procedure.name).toBe("myTestProcedure");
        expect(start.edges[0].target).toBe(end);
    });

    test("it doesn't allow cyclic", async () => {
        const start = new PassiveAction({id: "start", title: "foo"});
        const end = new PassiveAction({id: "end", title: "bar"});

        start.addDirectEdge(end);
        end.addDirectEdge(start);

        expect(() => {
            new Procedure({
                name: "myTestProcedure",
                start: start,
                ends: [end]
            });
        }).toThrow("This graph is cyclic");
    });

    test("it doesn't allow multiple Id", async () => {
        const start = new PassiveAction({id: "foo", title: "foo"});
        const end = new PassiveAction({id: "foo", title: "foo"});

        start.addDirectEdge(end);

        expect(() => {
            new Procedure({
                name: "myTestProcedure",
                start: start,
                ends: [end]
            });
        }).toThrow("appear in multiple nodes");
    });

    test("it run trivial procedure", async () => {
        const start = new PassiveAction({id: "start", title: "foo"});
        const end = new PassiveAction({id: "end", title: "bar"});
        start.addDirectEdge(end);
        const procedure = new Procedure({
            name: "myTestProcedure",
            start: start,
            ends: [end]
        });
        let ctx = await procedure.execute();
        expect(ctx).toHaveProperty("start");
        expect(ctx).toHaveProperty("end");
    });
});