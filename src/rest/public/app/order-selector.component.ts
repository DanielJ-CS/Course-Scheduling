/**
 * Created by Jason on 2016-11-24.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface OrderColumn {
    key: string,
    name: string
}

export interface OrderSelectorAPI {
    setContent?: (str: string) => void,
    setAvailableCols?: (arr: Array<OrderColumn>) => void
}

@Component({
    selector: 'order-selector',
    template: `
    <div class="order-selector_root">

    <div class="round_box">
        <h2>Order</h2>
        <div *ngIf="currCols.length == 0">(no ordering)</div>
        <ul *ngIf="currCols.length > 0">
            <li *ngFor="let col of currCols">
                {{col.name}}
                <button (click)="deleteCol(col)">X</button>
            </li>
        </ul>
    </div>

    <div class="round_box">
        <div *ngIf="unusedCols.length == 0">(all columns already used for ordering)</div>
        <ul class="single_select" *ngIf="unusedCols.length > 0">
            <li *ngFor="let col of unusedCols">
                <a (click)="selectCol(col)">{{col.name}}</a>
            </li>
        </ul>
        <div style="clear: left"></div>
    </div>

    <div class="round_box">
        <ul class="single_select">
            <li *ngFor="let dir of orderDirs">
                <a (click)="selectDir(dir)" [class.active]="currDir == dir">{{dir}}</a>
            </li>
        </ul>
        <div style="clear: left"></div>
    </div>

    </div>
    `
})

export class OrderSelectorComponent {

    constructor() {}

    @Input() api: OrderSelectorAPI;
    @Output() contentChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() error: EventEmitter<any> = new EventEmitter<any>();

    /* ORDER UI states */
    goodCols: Array<OrderColumn> = [];

    isColSelected: any = {};
    currCols: Array<OrderColumn> = [];
    unusedCols: Array<OrderColumn> = [];

    orderDirs: Array<string> = ["UP", "DOWN"];
    currDir: string = 'UP';

    ngOnInit() {
        // publish api methods
        let that = this;
        this.api.setContent = function(str: string) { that.setContentFromString(str) };
        this.api.setAvailableCols = function(arr: Array<OrderColumn>) { that.restrictCols(arr) };
    }

    /* ORDER UI event handlers */
    setContentFromString(str: string) {
        this.isColSelected = {};
        this.currCols = [];
        this.unusedCols = [];
        for (let colObj of this.goodCols) {
            this.unusedCols.push(colObj);
        }
        this.currDir = this.orderDirs[0];

        if (str == '') return;

        try {
            let obj: any = JSON.parse(str);
            if ((typeof obj) === 'string') {
                obj = { dir: this.orderDirs[0], keys: [obj] };
            }

            this.currDir = obj['dir'];
            for (let key of obj['keys']) {
                for (let i = 0; i < this.unusedCols.length; i++) {
                    let colObj = this.unusedCols[i];
                    if (colObj.key == key) {
                        this.isColSelected[key] = true;
                        this.unusedCols.splice(i, 1);
                        this.currCols.push(colObj);
                        break;
                    }
                }
            }

        } catch (e) {
            this.error.emit(e);
        }
    }

    restrictCols(goodCols: Array<OrderColumn>): void {
        this.goodCols = goodCols;
        this.fixCols();
        this.sendUpdateEvent();
    }

    fixCols(): void {
        let seen: any = {};
        for (let colObj of this.goodCols) {
            seen[colObj.key] = true;
        }

        // filter selected cols by goodCols
        let newCols: Array<OrderColumn> = [];
        for (let colObj of this.currCols) {
            if (seen[colObj.key]) {
                newCols.push(colObj);
            } else {
                this.isColSelected[colObj.key] = false;
            }
        }
        this.currCols = newCols;

        // add the rest of goodCols into unused
        let newUnused: Array<OrderColumn> = [];
        for (let colObj of this.goodCols) {
            if (!this.isColSelected[colObj.key]) {
                newUnused.push(colObj);
            }
        }
        this.unusedCols = newUnused;
    }

    sendUpdateEvent() {
        if (this.currCols.length > 0) {
            let colsArr: Array<string> = [];
            for (let colObj of this.currCols) {
                colsArr.push(colObj.key);
            }

            let obj: any = {
                dir: this.currDir,
                keys: colsArr
            }
            this.contentChange.emit(JSON.stringify(obj));
        } else {
            this.contentChange.emit('');
        }
    }

    selectCol(col: OrderColumn) {
        this.currCols.push(col);
        this.isColSelected[col.key] = true;
        for (let i = 0; i < this.unusedCols.length; i++) {
            if (this.unusedCols[i].key == col.key) {
                this.unusedCols.splice(i, 1);
                break;
            }
        }
        this.sendUpdateEvent();
    }

    selectDir(dir: any) {
        this.currDir = dir;
        this.sendUpdateEvent();
    }

    deleteCol(col: OrderColumn) {
        for (let i = 0; i < this.currCols.length; i++) {
            if (this.currCols[i].key == col.key) {
                this.isColSelected[col.key] = false;
                this.currCols.splice(i, 1);
                break;
            }
        }
        this.fixCols();
        this.sendUpdateEvent();
    }
}
