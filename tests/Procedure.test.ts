import {Procedure} from "../src/procedure";
import {PassiveAction} from "../src/Actions/PassiveAction";

describe("Procedure", () => {
    test("it allow trivial procedure", async () => {
        const start = new PassiveAction({id: "start", title: "foo", includeInExport: true, description: ""});
        const end = new PassiveAction({id: "end", title: "bar", includeInExport: true, description: ""});
        end.connectAfter(start);
        const procedure = new Procedure({
            name: "myTestProcedure",
            description: "",
            authors: ["Pierre"],
            creationTimestamp: Date.now(),
            start: start,
            ends: [end]
        });
        expect(procedure.name).toBe("myTestProcedure");
        expect(start.nextAction).toBe(end);
    });

    test("it doesn't allow cyclic", async () => {
        const start = new PassiveAction({id: "start", title: "foo", includeInExport: true, description: ""});
        const end = new PassiveAction({id: "end", title: "bar", includeInExport: true, description: ""});

        start.connectAfter(end);
        end.connectAfter(start);

        expect(() => {
            new Procedure({
                name: "myTestProcedure",
                description: "",
                authors: ["Pierre"],
                creationTimestamp: Date.now(),
                start: start,
                ends: [end]
            });
        }).toThrow();
    });

    test("it run trivial procedure", async () => {
        const start = new PassiveAction({id: "start", title: "foo", includeInExport: true, description: ""});
        const end = new PassiveAction({id: "end", title: "bar", includeInExport: true, description: ""});
        end.connectAfter(start);
        const procedure = new Procedure({
            name: "myTestProcedure",
            description: "",
            authors: ["Pierre"],
            creationTimestamp: Date.now(),
            start: start,
            ends: [end]
        });
        let ctx = await procedure.execute();
        expect(ctx).toHaveProperty("start");
        expect(ctx).toHaveProperty("end");
    });
});