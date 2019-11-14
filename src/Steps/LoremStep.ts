import {externalLink, Step} from "../Step";
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
    constructor({title, note, externalLinks}: { title: string, note?: string, externalLinks?: Array<externalLink> }) {
        super({
            title,
            note,
            description: lorem.generateParagraphs(2),
            externalLinks
        });
    }
}