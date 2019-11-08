import {Procedure} from "../procedure";
import {alg} from "graphlib";
import {Step} from "../Actions/Step";

export abstract class Exporter {
    constructor(protected procedure: Procedure) {
    }

    public abstract export(): string
}

