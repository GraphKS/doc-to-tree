export class Tree {
    public childrens: Array<this> = [];
    public parent?: this;

    public isRoot(): boolean {
        return parent == undefined;
    }

    public addChildren(...targets: this[]) {
        targets.forEach(target => {
            target.parent = this;
            this.childrens.push(target);
        });
    }

    public getNextSibling(): this | null {
        if (this.parent == undefined) return null;
        else {
            const index = this.parent.childrens.indexOf(this);
            if (index == -1) {
                throw new Error("Tree Error. Can't find this node in parent children");
            }
            if (this.parent.childrens.length > index + 1) {
                return this.parent.childrens[index + 1];
            } else return null;
        }
    }

    public preOrder(): Array<this> {
        return [
            this,
            ...this.childrens.flatMap(child => child.preOrder())
        ];
    }

    public postOrder(): Array<this> {
        return [
            ...this.childrens.flatMap(child => child.preOrder()),
            this
        ];
    }
}