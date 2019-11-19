export interface externalLink {
    title: string
    url: string
}

export interface StepOption {
    description?: string
    note?: string
    title: string
    externalLinks?: Array<externalLink>
}

export class Step {
    public readonly description?: string;
    public readonly note?: string;
    public readonly title: string;
    public readonly externalLinks: Array<externalLink>;
    public steps: Array<Step> = [];
    public parent?: Step;

    constructor({title, description, note, externalLinks = []}: StepOption) {
        this.description = description;
        this.note = note;
        this.title = title;
        this.externalLinks = externalLinks;
    }

    public isRoot(): boolean {
        return this.parent == undefined;
    }

    public addChildren(...targets: Step[]) {
        targets.forEach(target => {
            target.parent = this;
            this.steps.push(target);
        });
    }

    public export(): StepExport {
        return {
            title: this.title,
            description: this.description,
            note: this.note,
            depth: this.depth(),
            nextSteps: this.steps
                .map(step => ({
                    title: step.title,
                    note: step.note
                })),
            externalLinks: this.externalLinks
        };
    }

    public getNextSibling(): Step | null {
        if (this.parent == undefined) return null;
        else {
            const index = this.parent.steps.indexOf(this);
            if (index == -1) {
                throw new Error("Step Error. Can't find this node in parent children");
            }
            if (this.parent.steps.length > index + 1) {
                return this.parent.steps[index + 1];
            } else return null;
        }
    }

    public depth(): number {
        if (!this.parent) return 1;
        else return this.parent.depth() + 1;
    }

    public preOrder(): Array<Step> {
        return [
            this,
            ...this.steps.flatMap(child => child.preOrder())
        ];
    }

    public postOrder(): Array<Step> {
        return [
            ...this.steps.flatMap(child => child.preOrder()),
            this
        ];
    }
}

export function isStep(object: any): object is Step {
    return object instanceof Step;
}

export interface StepExport {
    title: string
    description?: string
    note?: string
    depth: number
    nextSteps: Array<{ title: string, note?: string }>
    externalLinks?: Array<externalLink>
}

export function isStepExport(object: any): object is StepExport {
    return (object instanceof Object && "title" in object && "description" in object && "depth" in object && "nextSteps" in object);
}