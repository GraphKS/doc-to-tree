import {Step} from "../Step";
import {LoremIpsum} from "lorem-ipsum";

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 4,
        min: 2
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

export class LoremStep extends Step {
    constructor({title, note}: { title: string, note?: string }) {
        super({
            title,
            note,
            description: lorem.generateParagraphs(2)
        });
    }
}