import {Procedure} from "../src/procedure";
import {Step} from "../src/Step";

describe("Procedure", () => {
    test("it allow trivial procedure", async () => {
        const procedure = new Procedure({
            title: "myTestProcedure",
        });
        const start = new Step({title: "foo"});
        const end = new Step({title: "bar"});
        procedure.addChildren(start, end);
        expect(procedure.name).toBe("myTestProcedure");
        expect(procedure.childrens[0]).toBe(start);
        expect(procedure.childrens[1]).toBe(end);
    });
});