import {Procedure} from "../src/procedure";
import {PassiveAction} from "../src/Actions/PassiveAction";

describe("Procedure", () => {
    test("it create", async () => {
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
});