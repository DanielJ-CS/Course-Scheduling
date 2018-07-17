/**
 * Created by Jason on 2016-11-22.
 * based on http://www.syntaxsuccess.com/viewarticle/recursive-treeview-in-angular-2.0
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';

export class TreeViewNode {
    id: number;
    data: any;
    display: string;

    par: TreeViewNode;
    child: Array<TreeViewNode>;

    constructor() {
        this.par = undefined;
        this.child = [];
    }

    clear(): void {
        this.child = [];
    }

    addChild(v: TreeViewNode): void {
        this.child.push(v);
        v.par = this;
    }

    replaceChild(fromNode: TreeViewNode, toNode: TreeViewNode): boolean {
        for (let i = 0; i < this.child.length; i++) {
            if (this.child[i] == fromNode) {
                this.child[i] = toNode;
                toNode.par = this;
                return true;
            }
        }
        return false;
    }

    removeChild(v: TreeViewNode): boolean {
        for (let i = 0; i < this.child.length; i++) {
            if (this.child[i] == v) {
                this.child.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    contains(v: TreeViewNode): boolean {
        if (this == v) return true;
        for (let i = 0; i < this.child.length; i++) {
            let res = this.child[i].contains(v);
            if (res) return true;
        }
        return false;
    }
}

@Component({
    selector: 'tree-view',
    template: `
    <li [class.active]="active == node">
        <div class="tree-node-select">
            <a (click)="setActive(node)">{{node.display}}</a>
            <button (click)="deleteNode()">X</button>
        </div>
        <ul class="tree-view">
            <tree-view *ngFor="let v of node.child"
                [node]="v" [active]="active"
                (activeChange)="setActive($event)"
                (nodeDelete)="handleNodeDelete($event)">
            </tree-view>
        </ul>
    </li>
    `,
})

export class TreeViewComponent {
    constructor() {}

    @Input() node: TreeViewNode;
    @Input() active: TreeViewNode;
    @Output() activeChange: EventEmitter<TreeViewNode> = new EventEmitter<TreeViewNode>();
    @Output() nodeDelete: EventEmitter<TreeViewNode> = new EventEmitter<TreeViewNode>();

    setActive(v: TreeViewNode) {
        this.activeChange.emit(v);
    }

    handleNodeDelete(v: TreeViewNode) {
        this.nodeDelete.emit(v);
    }

    deleteNode() {
        if (this.node.par) {
            this.node.par.removeChild(this.node);
        }
        if (this.active && this.node.contains(this.active)) {
            this.activeChange.emit(this.node.par);
        }
        this.nodeDelete.emit(this.node);
    }
}
