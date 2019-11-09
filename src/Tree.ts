export class Tree {
    public childrens: Array<Tree> = [];
    public parent?: Tree;

    public isRoot(): boolean {
        return this.parent == undefined;
    }

    public addChildren(...targets: Tree[]) {
        targets.forEach(target => {
            target.parent = this;
            this.childrens.push(target);
        });
    }

    public getNextSibling(): Tree | null {
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

    public preOrder(): Array<Tree> {
        return [
            this,
            ...this.childrens.flatMap(child => child.preOrder())
        ];
    }

    public postOrder(): Array<Tree> {
        return [
            ...this.childrens.flatMap(child => child.preOrder()),
            this
        ];
    }
}