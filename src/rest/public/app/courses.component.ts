/**
 * Created by Daniel on 2016-11-17.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {QueryResponse, QueryRequest} from "../../../controller/QueryController";
import {CourseService} from "./courses.service";
import {ColumnSelectorAPI, ColumnSelectorContent, ColumnSelectorComponent} from "./column-selector.component";
import {FilterCreatorAPI, FilterCreatorComponent} from "./filter-creator.component";
import {AggregatorAPI, AggregatorContent, AggregatorComponent} from "./aggregator.component";
import {OrderSelectorAPI, OrderColumn, OrderSelectorComponent} from "./order-selector.component";

@Component({
    selector: 'courses',
    template: `
    <div><h1>Course Explorer</h1></div>

    <div style="float: right; width: 45%">
    <div class="query_box round_box">
        <h2>Raw Query</h2>
        <div>
            <label>GET: </label>
            <input #box1 [(ngModel)]="inputGetStr" class="simple_input_text" (keyup)="inputGetChange()">
        </div>
        <div>
            <label>WHERE:</label>
            <input #box2 [(ngModel)]="inputWhereStr" class="simple_input_text" (keyup)="inputWhereChange()">
        </div>
        <div>
            <label>GROUP:</label>
            {{inputGroupStr}}
        </div>
        <div>
            <label>APPLY:</label>
            <input #box4 [(ngModel)]="inputApplyStr" class="simple_input_text" (keyup)="inputApplyChange()">
        </div>
        <div>
            <label>ORDER:</label>
            <input #box5 [(ngModel)]="inputOrderStr" class="simple_input_text" (keyup)="inputOrderChange()">
        </div>
        <div style="padding-top: 1em">
            <button (click)="clearForms()">Clear</button>
            <button (click)="fillSampleQuery()">Sample</button>
            <button (click)="performQuery()">Submit</button>
        </div>
    </div>

    <div class="round_box" *ngIf="currError.length > 0">
        <h2>Error</h2>
        {{currError}}
    </div>

    <div #result_table class="results round_box">
        <h2>
            Result ({{resultRows.length}})
            <button (click)="resultSelectAll()">Select All</button>
            <button (click)="resultDeselectAll()">Deselect All</button>
            <button (click)="resultAddToScheduler()">Add To Scheduler</button>
        </h2>
        <table>
        <tr>
            <th>V</th>
            <th *ngFor="let col of resultCols">
                {{findDataCol(col) ? findDataCol(col).name : col}}
            </th>
        </tr>
        <tr *ngFor="let row of resultRows; let i = index;" [class.active]="resultSelected[i]">
            <td><input type="checkbox" [(ngModel)]="resultSelected[i]"></td>
            <td *ngFor="let col of resultCols">
                {{row[col]}}
            </td>
        </tr>
        </table>
    </div>
    </div>

    <div style="margin-right: 45%">

    <column-selector [api]="getAPI"  [dataCols]="dataCols" (error)="handleUIError($event)" (contentChange)="getUIChange($event)"></column-selector>

    <filter-creator [api]="whereAPI" [dataCols]="dataCols" (error)="handleUIError($event)" (contentChange)="whereUIChange($event)"></filter-creator>

    <aggregator     id="{{id}}_agg" [api]="applyAPI" [dataCols]="dataCols" (error)="handleUIError($event)" (contentChange)="applyUIChange($event)"></aggregator>

    <order-selector [api]="orderAPI" (error)="handleUIError($event)" (contentChange)="orderUIChange($event)"></order-selector>

    <div style="height: 500px"></div>

    </div>
    `,
    providers: [CourseService]
})

export class CourseComponent {

    constructor(private courseService: CourseService) {}

    @Input() id: string;
    @Output() addCourses: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    /* dataset schema */
    dataCols: Array<any> = []; // binded to WHERE UI

    /* Raw Query UI bindings */
    inputGetStr = "[]";
    inputWhereStr = "{}";
    inputGroupStr = "";
    inputApplyStr = "";
    inputOrderStr = "";

    /* Result Table bindings */
    currError = "";
    resultRows: Array<any> = [];
    resultCols: Array<any> = [];
    resultSelected: Array<any> = [];
    prevQuery: any = {};

    /* GET columns */
    inputGetArray: Array<any> = [];
    inputGetCustomArray: Array<any> = [];
    inputGetNotCustomArray: Array<any> = [];

    /* GET UI bindings */
    getAPI: ColumnSelectorAPI = {};

    /* WHERE UI bindings */
    whereAPI: FilterCreatorAPI = {};

    /* APPLY UI states */
    applyAPI: AggregatorAPI = {};

    /* ORDER UI states */
    orderAPI: OrderSelectorAPI = {};

    ngOnInit() {
        let schema: any = {
            courses_dept: {type: 'string', name: 'Department', suggMatchType: 'prefix'},
            courses_id: {type: 'string', name: 'Course Number', suggMatchType: 'prefix'},
            courses_name: {type: 'string', name: 'Course Name', expr: 'courses_dept + courses_id'},
            courses_title: {type: 'string', name: 'Course Title', suggMatchType: 'substr'},
            courses_year: {type: 'number', name: 'Section Year'},
            courses_instructor: {type: 'string', name: 'Section Instructor', suggMatchType: 'substr'},
            courses_avg: {type: 'number', name: 'Section Average'},
            courses_size: {type: 'number', name: 'Section Size', expr: 'courses_pass + courses_fail'},
            courses_pass: {type: 'number', name: 'Number of Passes'},
            courses_fail: {type: 'number', name: 'Number of Fails'},
            courses_audit: {type: 'number', name: 'Number of Audits'},
            courses_uuid: {type: 'number', name: 'Section UUID'},
            courses_none: {type: 'number', name: '(none)', expr: '1'},
        };
        this.dataCols = [];
        for (let key in schema) {
            let currID = this.dataCols.length;
            let currObj: any = {id: currID, key: key};
            for (let k in schema[key]) {
                currObj[k] = schema[key][k];
            }
            this.dataCols.push(currObj);
        }
        let that = this;
        this.dataCols.forEach(function (obj: any) {
            obj.uniqueVals = [];
            if (obj.type == 'number') return;
            let query: QueryRequest = {
                GET:   [obj.expr ? 'expr(' + obj.expr + ') AS ' + obj.key : obj.key],
                WHERE: {},
                GROUP: [obj.key],
                APPLY: [],
                ORDER: obj.key,
                AS:    'TABLE'
            };
            that.courseService.courseQuery(query).then(function (res: any) {
                let arr: Array<any> = res.json().result;
                for (let z of arr) {
                    obj.uniqueVals.push(z[obj.key]);
                }
            });
        });
    }

    clearForms(): void {
        this.inputGetStr = '[]';
        this.inputGetChange();

        this.inputWhereStr = '{}';
        this.inputWhereChange();

        this.inputApplyStr = '';
        this.inputApplyChange();

        this.inputOrderStr = '';
        this.inputOrderChange();
    }

    fillSampleQuery(): void {
        this.inputGetStr = '["courses_dept", "courses_id", "numSections"]';
        this.inputGetChange();

        this.inputWhereStr = '{"GT": {"courses_avg": 90}}';
        this.inputWhereChange();

        this.inputApplyStr = '[ {"numSections": {"COUNT": "courses_uuid"}} ]';
        this.inputApplyChange();

        this.inputOrderStr = '"numSections"';
        this.inputOrderChange();
    }

    handleUIError(e: any) {
        this.currError = e.message;
    }

    findDataCol(col: string): any {
        for (let obj of this.dataCols) {
            if (obj.key == col) {
                return obj;
            }
        }
        return undefined;
    }

    /* GET UI event handlers */
    inputGetChange() {
        this.currError = '';
        this.getAPI.setContent(this.inputGetStr);
    }

    getUIChange(e: ColumnSelectorContent) {
        this.currError = '';
        this.inputGetNotCustomArray = e.cols.concat([]); // make copy
        this.syncCols(e.isFromAPI);
    }

    serializeGet() {
        let arr: Array<string> = [];
        for (let col of this.inputGetArray) {
            let colObj: any = this.findDataCol(col);
            if (colObj && colObj.expr) {
                arr.push('expr(' + colObj.expr + ') AS ' + col);
            } else {
                arr.push(col);
            }
        }
        this.inputGetStr = JSON.stringify(arr);
    }

    /* WHERE UI event handlers */
    inputWhereChange() {
        this.currError = '';
        this.whereAPI.setContent(this.inputWhereStr);
    }

    whereUIChange(str: string) {
        this.currError = '';
        this.inputWhereStr = str;
    }

    /* APPLY UI event handlers */
    inputApplyChange() {
        this.currError = '';
        this.applyAPI.setContent(this.inputApplyStr);
    }

    applyUIChange(e: AggregatorContent) {
        this.currError = '';
        if (e.enabled) {
            this.inputGroupStr = JSON.stringify(this.inputGetNotCustomArray);
            if (!e.isFromAPI) {
                this.inputApplyStr = e.str;
            }
            this.inputGetCustomArray = e.cols;
            this.syncCols(false);
        } else {
            this.inputGroupStr = "";
            this.inputApplyStr = "";
            this.inputGetCustomArray = [];
            this.syncCols(false);
        }
    }

    /* ORDER UI event handlers */
    inputOrderChange() {
        this.currError = '';
        this.orderAPI.setContent(this.inputOrderStr);
    }

    orderUIChange(str: string) {
        this.currError = '';
        this.inputOrderStr = str;
    }

    /* Enforces restrictions:
     *
     * GET contains some columns in dataset and all columns in APPLY
     * GROUP contains all GET columns not in APPLY
     * ORDER contains only columns in GET
     *
     */
    syncCols(isModifyingInputGet: boolean): void {
        // fix GET: remove elements not there, insert new custom cols
        this.inputGetArray = this.inputGetNotCustomArray.concat(this.inputGetCustomArray);
        if (!isModifyingInputGet) {
            this.serializeGet();
        }

        // fix GROUP: should be the non-custom cols
        if (this.inputApplyStr.length > 0) {
            this.inputGroupStr = JSON.stringify(this.inputGetNotCustomArray);
        } else {
            this.inputGroupStr = '';
        }

        // fix ORDER: remove elements not there, put all non-selected into candidates
        let goodOrderCols: Array<OrderColumn> = [];
        for (let col of this.inputGetArray) {
            if (col.substring(0, 4) == 'expr') {
                let toks = col.split(' ');
                col = toks[toks.length-1];
            }
            let colObj: any = this.findDataCol(col);
            goodOrderCols.push({key: col, name: (colObj ? colObj.name : col)});
        }
        this.orderAPI.setAvailableCols(goodOrderCols);
    }

    /* Helpers for Querying */
    getQueryInfo(): QueryRequest {
        let res: QueryRequest = {
            GET: JSON.parse(this.inputGetStr),
            WHERE: JSON.parse(this.inputWhereStr),
            AS: 'TABLE'
        };
        if (this.inputGroupStr.length > 0) {
            res.GROUP = JSON.parse(this.inputGroupStr);
            res.APPLY = JSON.parse(this.inputApplyStr);
        }
        if (this.inputOrderStr.length > 0) {
            res.ORDER = JSON.parse(this.inputOrderStr);
        }
        return res;
    }

    performQuery(): void {
        try {
            this.currError = "";

            let that = this;
            let req = this.getQueryInfo();

            this.resultCols = [];
            for (let col of req.GET) {
                if (col.substring(0, 4) == 'expr') {
                    let toks = col.trim().split(' ');
                    this.resultCols.push(toks[toks.length-1]);
                } else {
                    this.resultCols.push(col);
                }
            }
            this.courseService.courseQuery(req).then(function (res: any) {
                that.renderResult(res.json().result);
                that.prevQuery = req;

            }).catch(function (err: any) {
                if (err.status == 424) {
                    that.currError = "Unable to find datasets: " + JSON.parse(err._body).missing.join(", ");
                } else {
                    that.currError = JSON.parse(err._body).error;
                }
                that.prevQuery = {};
            });

        } catch (e) {
            this.currError = e.message;
            this.prevQuery = {};
        }
    }

    renderResult(rows: any) {
        this.resultRows = rows;
        this.resultSelected = [];
        if (this.resultRows.length == 0) {
            this.currError = "No matching results!";
        }
    }

    resultSelectAll() {
        for (let i = 0; i < this.resultRows.length; i++) {
            this.resultSelected[i] = true;
        }
    }

    resultDeselectAll() {
        for (let i = 0; i < this.resultRows.length; i++) {
            this.resultSelected[i] = false;
        }
    }

    resultAddToScheduler() {
        let that = this;
        this.currError = '';

        let seenCols: any = {};
        for (let x of this.resultCols) {
            seenCols[x] = true;
        }

        if (!seenCols['courses_dept'] || !seenCols['courses_id']) {
            this.currError = 'Query must have Department and ID for adding to scheduler';
            return;
        }

        if (!this.prevQuery || !this.prevQuery.WHERE) {
            this.currError = 'Must have successful previous query before adding';
            return;
        }

        let seen: any = {};
        let selectedArr: Array<any> = [];
        for (let i = 0; i < this.resultRows.length; i++) {
            if (this.resultSelected[i]) {
                let dept = this.resultRows[i]['courses_dept'];
                let id = this.resultRows[i]['courses_id'];
                if (!seen[dept]) {
                    seen[dept] = {};
                }
                if (!seen[dept][id]) {
                    seen[dept][id] = true;
                    selectedArr.push({dept: dept, id: id});
                }
            }
        }
        if (selectedArr.length == 0) {
            this.currError = 'Must select at least one course';
            return;
        }

        let query1: any = {
            GET:   ['courses_dept', 'courses_id', 'maxYear', 'maxSize'],
            WHERE: {GT: {courses_year: 1900}},
            GROUP: ['courses_dept', 'courses_id'],
            APPLY: [{maxYear: {MAX: 'courses_year'}},
                    {maxSize: {MAX: 'expr(courses_pass + courses_fail)'}}],
            ORDER: {dir: 'UP', keys: ['courses_dept', 'courses_id']},
            AS:    'TABLE'
        }

        let arr1: any = {};
        this.courseService.courseQuery(query1).then(function (res: any) {
            let arr: Array<any> = res.json().result;

            let query2: any = {
                GET:   ['courses_dept', 'courses_id', 'courses_title', 'courses_year', 'numSections'],
                WHERE: {},
                GROUP: ['courses_dept', 'courses_id', 'courses_title', 'courses_year'],
                APPLY: [ {numSections: {COUNT: 'courses_uuid'}} ],
                ORDER: {dir: 'UP', keys: ['courses_dept', 'courses_id']},
                AS:    'TABLE'
            }

            for (let z of arr) {
                if (!arr1[z.courses_dept]) {
                    arr1[z.courses_dept] = {};
                }
                if (!arr1[z.courses_dept][z.courses_id]) {
                    arr1[z.courses_dept][z.courses_id] = z;
                    arr1[z.courses_dept][z.courses_id].seen = false;
                }
            }

            return that.courseService.courseQuery(query2)

        }).then(function (res1: any) {
            let arr: Array<any> = res1.json().result;
            let res2: Array<any> = [];

            let cnt1900 = 0;
            let is1900: any = {};
            for (let i = 0; i < arr.length; i++) {
                let z: any = arr[i];
                let y: any = arr1[z.courses_dept] && arr1[z.courses_dept][z.courses_id];
                if (!y) {
                    if (z.courses_year == 1900) {
                        if (!is1900[z.courses_dept]) {
                            is1900[z.courses_dept] = {};
                        }
                        if (!is1900[z.courses_dept][z.courses_id]) {
                            is1900[z.courses_dept][z.courses_id] = true;
                            cnt1900++;
                        }
                    }
                    continue;
                }
                if (y.seen) continue;
                if (z.courses_year != y.maxYear) continue;
                y.seen = true;
                if (seen[z.courses_dept] && seen[z.courses_dept][z.courses_id]) {
                    res2.push({
                        dept: z.courses_dept,
                        id: z.courses_id,
                        title: z.courses_title,
                        sectionSize: y.maxSize,
                        numSections: Math.ceil(z.numSections/3)
                    });
                }
            }

            for (let i = 0; i < selectedArr.length; i++) {
                let dd = selectedArr[i].dept;
                let ii = selectedArr[i].id;
                if (is1900[dd] && is1900[dd][ii]) continue;
                if (!arr1[dd] || !arr1[dd][ii] || !arr1[dd][ii].seen) {
                    that.currError = 'BUG: missed course ' + dd + ii;
                    return;
                }
            }

            that.addCourses.emit(res2);

        }).catch(function (err) {
            try {
                that.currError = JSON.parse(err._body).error;
            } catch (e) {
                that.currError = err.message;
            }

        });
    }
}
