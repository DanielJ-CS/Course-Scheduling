/**
 * Created by Jason on 2016-11-17.
 */
import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { QueryResponse, QueryRequest } from "../../../controller/QueryController";
import { TreeViewNode, TreeViewComponent } from "./tree-view.component";
import { InputSuggestComponent } from "./input-suggest.component";

export interface FilterCreatorAPI {
    setContent?: (str: string) => void;
}

@Component({
    selector: 'filter-creator',
    template: `
    <div class="filter-creator_root">

    <div class="round_box">
        <h2>Filter By</h2>
        <ul *ngIf="currTree.child.length > 0" class="tree-view tree-view-root">
            <tree-view
                [node]="currTree.child[0]" [active]="currNode"
                (activeChange)="setActiveNode($event)"
                (nodeDelete)="nodeDelete($event)">
            </tree-view>
        </ul>
        <span *ngIf="currTree.child.length == 0">(no filter)</span>
    </div>

    <div class="round_box">
        <ul class="single_select">
            <li *ngFor="let op of logicOps">
                <a (click)="addLogicOp(op)">{{op}}</a>
            </li>
        </ul>
        <div style="clear: left"></div>
    </div>

    <div class="round_box">
        <ul class="single_select">
            <li *ngFor="let col of dataCols">
                <a (click)="selectCol(col.id)"
                    [class.active]="currCol == col.id">
                    {{col.name}}
                </a>
            </li>
        </ul>
        <div style="clear: left"></div>
    </div>

    <div class="round_box" *ngIf="currCol >= 0 && dataCols[currCol]['type'] == 'string'">
        <ul class="single_select">
            <li *ngFor="let op of stringOps">
                <a (click)="selectOp(op.key, 'string')"
                    [class.active]="currOp == op.key">
                    {{op.name}}
                </a>
            </li>
        </ul>
        <div style="clear: left"></div>
    </div>

    <div class="round_box" *ngIf="currCol >= 0 && dataCols[currCol]['type'] == 'number'">
        <ul class="single_select">
            <li *ngFor="let op of numberOps">
                <a (click)="selectOp(op.key, 'number')"
                    [class.active]="currOp == op.key">
                    {{op.name}}
                </a>
            </li>
        </ul>
        <div style="clear: left"></div>
    </div>

    <div class="round_box" *ngIf="this.currOp != ''">
        <input-suggest *ngIf="this.currOpType == 'string'"
            [eager]="currValIsEager" [matchMode]="currColMatchMode" [suggestions]="currColSugg"
            txtLabel="Value: " addBtnLabel="Add Filter!" cancelBtnLabel="Cancel"
            (select)="valSuggSelect($event)" (cancel)="valSuggCancel($event)">
        </input-suggest>

        <div *ngIf="this.currOpType == 'number'">
            <label>Value: </label><input #currValEl [(ngModel)]="currVal" (keyup)="currValKeyUp($event)">
            <button (click)="addFilter()">Add Filter!</button>
            <button (click)="clearFilter()">Cancel</button>
        </div>
    </div>

    </div>
    `,
})

export class FilterCreatorComponent {

    constructor() {}

    @ViewChild('currValEl') currValEl: any;

    @Input() api: FilterCreatorAPI;
    @Input() dataCols: Array<any>;
    @Output() contentChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() error: EventEmitter<any> = new EventEmitter<any>();

    logicOps  = ['AND','OR','NOT'];
    numberOps = [
        {key: 'LT', name: "Less than",    shortDisplay: "<"},
        {key: 'GT', name: "Greater than", shortDisplay: ">"},
        {key: 'EQ', name: "Equals",       shortDisplay: "="}
    ];
    stringOps = [{key: 'IS', name: "Matches", shortDisplay: "matches"}];

    currCol = -1;
    currOp = '';
    currOpType = '';
    currVal: any;
    currValIsEager = false;
    currColMatchMode: string = '';
    currColSugg: Array<string> = [];

    currTree: TreeViewNode = new TreeViewNode();
    currNode: TreeViewNode = undefined;

    ngOnInit() {
        // publish api methods
        let that = this;
        this.api.setContent = function(str: string) { that.setFilterFromString(str) };
    }


    obj2tree(obj: any): TreeViewNode {
        let res = new TreeViewNode();
        let op: string;
        for (let k in obj) {
            op = k;
            break;
        }
        if (op == 'AND' || op == 'OR' || op == 'NOT') {
            res.data = op;
            res.display = op;
            if (op == 'NOT') {
                res.addChild(this.obj2tree(obj[op]));
            } else {
                for (let i = 0; i < obj[op].length; i++) {
                    res.addChild(this.obj2tree(obj[op][i]));
                }
            }
        } else {
            let col: string;
            for (let k in obj[op]) {
                col = k;
                break;
            }
            res.data = obj;
            res.display = this.getFilterText(col, op, obj[op][col]);
        }
        return res;
    }

    setFilterFromString(str: string) {
        try {
            this.currTree.clear();
            if (str.length == 0 || str == "{}") {
                this.currNode = undefined;
                return;
            }

            let obj: any = JSON.parse(str);
            this.currTree.addChild(this.obj2tree(obj));
            this.currNode = this.currTree.child[0];

        } catch (e) {
            this.error.emit(e);
        }
    }

    tree2obj(u: TreeViewNode): any {
        let res: any = {};
        if (u.data == 'AND' || u.data == 'OR') {
            res[u.data] = [];
            for (let c of u.child) {
                res[u.data].push(this.tree2obj(c));
            }
        } else if (u.data == 'NOT') {
            res[u.data] = this.tree2obj(u.child[0]);
        } else {
            res = u.data;
        }
        return res;
    }

    getFilterString(): string {
        if (this.currTree.child.length == 0) {
            return "{}";
        }
        return JSON.stringify(this.tree2obj(this.currTree.child[0]));
    }

    setActiveNode(v: TreeViewNode) {
        if (v == this.currTree) {
            this.currNode = undefined;
        } else {
            this.currNode = v;
        }
    }

    nodeDelete(v: TreeViewNode) {
        this.contentChange.emit(this.getFilterString());
    }

    addLogicOp(op: string) {
        let par: TreeViewNode;
        let curr: TreeViewNode;
        if (this.currNode) {
            if (this.currNode.data == op && op != 'NOT') return;
            par = this.currNode.par;
            curr = this.currNode;
        } else {
            par = this.currTree;
            curr = this.currTree.child[0];
        }
        if (par.data == op) {
            this.currNode = par;
        } else {
            let u = new TreeViewNode();
            u.data = op;
            u.display = op;
            if (curr) {
                u.addChild(curr);
                par.replaceChild(curr, u);
            } else {
                par.addChild(u);
            }

            this.currNode = u;
            this.contentChange.emit(this.getFilterString());
        }
    }

    selectCol(id: number) {
        this.clearFilter();
        this.currCol = id;
    }

    selectOp(op: string, opType: string) {
        this.currOp = op;
        this.currOpType = opType;

        let suggVals: Array<string> = this.dataCols[this.currCol].uniqueVals;
        this.currColSugg = suggVals ? suggVals : [];
        this.currColMatchMode = this.dataCols[this.currCol].suggMatchType;

        if (this.currOpType == 'number') {
            let that = this;
            setTimeout(function() { that.currValEl.nativeElement.focus();}, 40);
        }
    }

    currValKeyUp(event: any) {
        if (this.currOpType == 'number') {
            this.currVal = this.currVal.replace(/[^0-9.-]*/, "");
        }
        if (event.code == 'Enter') {
            this.addFilter();
        }
    }

    getFilterText(col: string, op: string, val: any): string {
        let str = '';
        for (let x of this.dataCols)  if (x.key == col || x.expr == col.substring(5, -1)) str += x.name;
        for (let x of this.stringOps) if (x.key == op) str += ' ' + x.shortDisplay + ' ';
        for (let x of this.numberOps) if (x.key == op) str += ' ' + x.shortDisplay + ' ';
        str += val;
        return str;
    }

    valSuggSelect(str: string) {
        this.currVal = str;
        this.addFilter();
    }

    valSuggCancel(str: string) {
        this.clearFilter();
    }

    addFilter() {
        let colObj: any = this.dataCols[this.currCol];
        let key: string = colObj['key'];
        let expr: string = colObj['expr'];
        let val: any = (this.currOpType == 'number' ? parseFloat(this.currVal) : this.currVal);
        let filterObj: any = { [this.currOp]: { [expr ? ('expr(' + expr + ')') : key]: val } };
        let n0 = new TreeViewNode();
        n0.data = filterObj;
        n0.display = this.getFilterText(colObj['key'], this.currOp, this.currVal);

        if (this.currTree.child.length == 0) {
            this.currTree.addChild(n0);
            this.currNode = n0;
        } else if (this.currNode) {
            if (this.currNode.data == 'AND' || this.currNode.data == 'OR' ||
                (this.currNode.data == 'NOT' && this.currNode.child.length == 0)) {
                this.currNode.addChild(n0);
                this.currNode = n0;
            } else if (this.currNode.par.data == 'AND' || this.currNode.par.data == 'OR') {
                this.currNode.par.addChild(n0);
                this.currNode = n0;
            } else {
                this.error.emit(new Error("Multiple filters must be joined using AND/OR, please select one of AND/OR before adding this filter"));
                return;
            }
        }

        this.contentChange.emit(this.getFilterString());
        this.clearFilter();
    }

    clearFilter() {
        this.currCol = -1;
        this.currOp = '';
        this.currOpType = '';
        this.currVal = '';
    }
}
