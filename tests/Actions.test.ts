import {Step} from "../src/Actions/Step";

describe("Actions", () => {
    test("it allows connection", () => {
        const start = new Step({title: "foo"});
        const end = new Step({title: "bar"});
        start.addStep(end);
        expect(start.preOrder()[0].title).toBe("foo")
    });
});