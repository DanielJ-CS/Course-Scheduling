/**
 * Created by Jason on 2016-11-24.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface AggregatorAPI {
    setContent?: (str: string) => void;
}

export interface AggregatorContent {
    str: string,
    cols: Array<string>,
    enabled: boolean,
    isFromAPI: boolean
}

@Component({
    selector: 'aggregator',
    template: `
    <div class="aggregator_root">

    <div class="round_box">
        <ul class="single_select">
            <h2>Aggregate</h2>
            <input id="{{id}}_enable_chk" type="checkbox" [(ngModel)]="enabled" (change)="toggleEnable()">
            <label [attr.for]="id + '_enable_chk'">Aggregate results</label>
        </ul>
        <div *ngIf="enabled">
            <div *ngIf="rules.length == 0">(no aggregation rules)</div>
            <ul *ngIf="rules.length > 0">
                <li *ngFor="let obj of rules">
                    {{obj.display}}
                    <button (click)="deleteRule(obj)">X</button>
                </li>
            </ul>
        </div>
        <div style="clear: left"></div>
    </div>

    <div class="round_box" *ngIf="enabled">
        <ul class="single_select">
            <li *ngFor="let op of aggOps"><a (click)="selectOp(op)" [class.active]="currOp == op">{{op}}</a></li>
        </ul>
        <div style="clear: left"></div>
    </div>

    <div class="round_box" *ngIf="enabled && currOp != ''">
        <ul class="single_select">
            <li *ngFor="let col of goodCols">
                <a (click)="selectCol(col.key)">{{col.name}}</a>
            </li>
        </ul>
        <div style="clear: left"></div>
    </div>

    </div>
    `,
})

export class AggregatorComponent {

    constructor() {}

    @Input() id: string;
    @Input() api: AggregatorAPI;
    @Input() dataCols: Array<any>;
    @Output() contentChange: EventEmitter<AggregatorContent> = new EventEmitter<AggregatorContent>();
    @Output() error: EventEmitter<any> = new EventEmitter<any>();

    enabled: boolean = false;
    rules: Array<any> = [];

    aggOps: Array<any> = ["MAX", "MIN", "AVG", "COUNT"];
    aggOpDisplay: any= {
        MAX: "Maximum",
        MIN: "Minimum",
        AVG: "Average",
        COUNT: "Unique Count"
    }
    aggOpTypes: any = {
        MAX: { "number": true, "string": true },
        MIN: { "number": true, "string": true },
        AVG: { "number": true },
        COUNT: { "number": true, "string": true }
    };

    goodCols: Array<string> = [];
    currOp: string = '';

    ngOnInit() {
        // publish api methods
        let that = this;
        this.api.setContent = function(str: string) { that.setContentFromString(str) };
    }

    setContentFromString(str: string) {
        try {
            this.rules = [];
            if (str == '') {
                this.enabled = false;
                this.sendUpdateEvent(true);
                return;
            } else {
                this.enabled = true;
                this.sendUpdateEvent(true);
            }

            let arr = JSON.parse(str);
            for (let obj of arr) {
                let name: string;
                let op: string;
                let col: string;
                for (let k in obj) {
                    name = k;
                    break;
                }
                for (let k in obj[name]) {
                    op = k;
                    break;
                }
                col = obj[name][op];

                let colObj: any = this.findDataCol(col);
                if (col.substring(0, 4) == 'expr' || (colObj && this.aggOpTypes[op] && this.aggOpTypes[op][colObj.type])) {
                    let disp = this.getRuleDesc(name, op, col);
                    this.rules.push({op: op, col: col, name: name, display: disp});
                }
            }
            this.sendUpdateEvent(true);

        } catch (e) {
            this.error.emit(e);
        }
    }

    sendUpdateEvent(isFromAPI: boolean): void {
        if (this.enabled) {
            let rulesArr: Array<any> = [];
            let colsArr: Array<string> = [];
            for (let obj of this.rules) {
                rulesArr.push({ [obj.name]: { [obj.op]: obj.col } });
                colsArr.push(obj.name);
            }
            let evt: AggregatorContent = {
                enabled: true,
                str: JSON.stringify(rulesArr),
                cols: colsArr,
                isFromAPI: isFromAPI
            }
            this.contentChange.emit(evt);
        } else {
            this.contentChange.emit({ enabled: false, str: "", cols: [], isFromAPI: isFromAPI });
        }
    }

    toggleEnable() {
        this.enabled = !this.enabled;
        this.sendUpdateEvent(false);
    }

    selectOp(op: string) {
        this.currOp = op;
        this.goodCols = [];
        for (let obj of this.dataCols) {
            if (this.aggOpTypes[this.currOp][obj.type]) {
                this.goodCols.push(obj);
            }
        }
    }

    selectCol(col: string) {
        let colObj = this.findDataCol(col);
        let name: string = this.genRuleName(this.currOp, col);
        let disp: string = this.getRuleDesc(name, this.currOp, col);
        let colExpr: string = ((colObj && colObj.expr)
                ? ('expr(' + colObj.expr + ')')
                : ((colObj.type == 'string' && (this.currOp == 'MAX' || this.currOp == 'MIN')) ? 'expr(' + col + ')' : col));
        this.rules.push({op: this.currOp, col: colExpr, name: name, display: disp});
        this.sendUpdateEvent(false);
    }

    deleteRule(obj: any) {
        for (let i = 0; i < this.rules.length; i++) {
            if (this.rules[i] == obj) {
                this.rules.splice(i, 1);
                break;
            }
        }
        this.sendUpdateEvent(false);
    }

    findDataCol(col: string): any {
        for (let obj of this.dataCols) {
            if (obj.key == col) {
                return obj;
            }
        }
        return undefined;
    }

    genRuleName(op: string, col: string): string {
        let res = op.toLowerCase();
        let arr = col.split("_");
        for (let str of arr) {
            res += str.substr(0, 1).toUpperCase() + str.substr(1);
        }
        return res;
    }

    getRuleDesc(name: string, op: string, col: string): string {
        let colObj = this.findDataCol(col);
        return name + " = " + this.aggOpDisplay[op] + " of " + (colObj ? colObj.name : col);
    }
}
