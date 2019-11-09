import {Step} from "../src/Step";

describe("Actions", () => {
    test("it allows connection", () => {
        const start = new Step({title: "foo"});
        const end = new Step({title: "bar"});
        start.addChildren(end);
        expect(start.preOrder()[0].title).toBe("foo")
    });
});