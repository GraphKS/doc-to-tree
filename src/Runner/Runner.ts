import {Procedure} from "../procedure";

export interface Context {
    [key: string]: any
}

export abstract class Runner {
    public abstract execute(procedure: Procedure): Context
}