import {Signale} from "signale";

const defaultLogger = new Signale();
let currentLogger = defaultLogger;

export function setLogger(logger: Signale){
    currentLogger = logger;
}

export function getLogger(): Signale {
    return currentLogger;
}