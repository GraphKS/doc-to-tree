import {Procedure} from "../src/procedure";
import {Step} from "../src/Actions/Step";

describe("Procedure", () => {
    test("it allow trivial procedure", async () => {
        const procedure = new Procedure({
            name: "myTestProcedure",
        });
        const start = new Step({title: "foo"});
        const end = new Step({title: "bar"});
        procedure.addStep(start, end);
        expect(procedure.name).toBe("myTestProcedure");
        expect(procedure.steps[0]).toBe(start);
        expect(procedure.steps[1]).toBe(end);
    });
});