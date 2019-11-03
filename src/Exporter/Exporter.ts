import {Procedure} from "../procedure";

export abstract class Exporter {
    public abstract export(procedure: Procedure): any
}