import {PassiveAction} from "../src/Actions/PassiveAction";

describe("Actions", () => {
    test("it allows connection", () => {
        const start = new PassiveAction({id: "start", title: "foo", includeInExport: true, description: ""});
        const end = new PassiveAction({id: "end", title: "bar", includeInExport: true, description: ""});
        end.connectAfter(start);
    });

    test("it doesn't allow replacing connection", () => {
        const start = new PassiveAction({id: "start", title: "foo", includeInExport: true, description: ""});
        const mid = new PassiveAction({id: "mid", title: "foo", includeInExport: true, description: ""});
        const end = new PassiveAction({id: "end", title: "bar", includeInExport: true, description: ""});
        mid.connectAfter(start);
        expect(() => {
            end.connectAfter(start);
        }).toThrow();

    });
});