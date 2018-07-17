/**
 * Created by Jason on 2016-11-24.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface ColumnSelectorContent {
    cols: Array<string>,
    isFromAPI: boolean
}

export interface ColumnSelectorAPI {
    setContent?: (str: string) => void,
}

@Component({
    selector: 'column-selector',
    template: `
    <div class="column-selector_root">

    <div class="round_box">
        <h2>Display</h2>
        <ul class="single_select">
            <li *ngFor="let col of dataCols">
                <a (click)="toggleSelection(col.id)" [class.active]="isSelected[col.id]">{{col.name}}</a>
            </li>
        </ul>
        <div style="clear: left"></div>
        Expression: <input style="width: 50%" [(ngModel)]="customExpr"> AS <input style="width: 20%" [(ngModel)]="customColName"> <button (click)="addCustom()">Add!</button>
    </div>

    </div>
    `
})

export class ColumnSelectorComponent {

    constructor() {}

    @Input() api: ColumnSelectorAPI;
    @Input() dataCols: Array<any>;
    @Output() contentChange: EventEmitter<ColumnSelectorContent> = new EventEmitter<ColumnSelectorContent>();
    @Output() error: EventEmitter<any> = new EventEmitter<any>();

    /* GET UI states (because we want the order you click buttons to matter) */
    isSelected: Array<boolean> = [];
    currSelected: Array<any> = [];
    customExpr: string = '';
    customColName: string = '';

    ngOnInit() {
        // publish api methods
        let that = this;
        this.api.setContent = function(str: string) { that.setContentFromString(str) };
    }

    /* GET UI event handlers */
    setContentFromString(str: string) {
        try {
            // clear GET UI
            for (let i = 0; i < this.isSelected.length; i++) {
                this.isSelected[i] = false;
            }
            this.currSelected = [];
            this.sendUpdateEvent(true);

            // parse GET columns
            let obj = JSON.parse(str);
            for (let col of obj) {
                let colObj = this.findDataCol(col);
                if (col.substring(0, 4) == 'expr') {
                    let toks = col.trim().split(' ');
                    colObj = this.findDataCol(toks[toks.length-1]);
                    if (!colObj) {
                        this.currSelected.push(col);
                    }
                }
                if (colObj) {
                    this.isSelected[colObj.id] = true;
                    this.currSelected.push(col);
                }
            }
            this.sendUpdateEvent(true);
        } catch (e) {
            this.error.emit(e);
        }
    }

    sendUpdateEvent(isFromAPI: boolean) {
        this.contentChange.emit({ cols: this.currSelected, isFromAPI: isFromAPI});
    }

    toggleSelection(id: number) {
        if (this.isSelected[id]) {
            // remove GET column
            for (let i = 0; i < this.currSelected.length; i++) {
                if (this.currSelected[i] == this.dataCols[id].key) {
                    this.currSelected.splice(i, 1);
                    break;
                }
            }
            this.isSelected[id] = false;
        } else {
            // add GET column
            this.currSelected.push(this.dataCols[id].key);
            this.isSelected[id] = true;
        }
        this.sendUpdateEvent(false);
    }

    addCustom() {
        if (this.customExpr.length > 0 && this.customColName.length > 0) {
            this.dataCols.push({
                id: this.dataCols.length,
                key: this.customColName,
                type: 'number',
                name: this.customColName,
                expr: this.customExpr
            });
            this.customExpr = '';
            this.customColName = '';
        }
    }

    findDataCol(col: string): any {
        for (let obj of this.dataCols) {
            if (obj.key == col) {
                return obj;
            }
        }
        return undefined;
    }

}
