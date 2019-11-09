import {Step} from "../src/Step";

describe("Step", () => {
    test("it allows connection", () => {
        const start = new Step({title: "foo"});
        const end = new Step({title: "bar"});
        start.addChildren(end);
        expect((start.preOrder()[0] as Step).title).toBe("foo");
        expect(start.depth()).toBe(1);
        expect(end.depth()).toBe(2);
    });
});