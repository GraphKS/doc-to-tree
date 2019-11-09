import {Procedure} from "../procedure";
import {alg} from "graphlib";
import {Step} from "../Step";

export abstract class Exporter {
    constructor(protected procedure: Procedure) {
    }

    public abstract export(): string
}

