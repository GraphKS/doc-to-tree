import {Action, Context} from "./Action";

export class PassiveAction extends Action {
    protected async execute(ctx: Context): Promise<any> {
        return {};
    }

}