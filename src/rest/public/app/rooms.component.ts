/**
 * Created by Daniel on 2016-11-17.
 */
import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {RoomService} from "./rooms.service";
import {QueryRequest} from "../../../controller/QueryController";
import {ColumnSelectorAPI, ColumnSelectorContent} from "./column-selector.component";
import {FilterCreatorAPI} from "./filter-creator.component";
import {AggregatorAPI, AggregatorContent} from "./aggregator.component";
import {OrderSelectorAPI, OrderColumn} from "./order-selector.component";
import {InputSuggestComponent} from "./input-suggest.component";

@Component({
    selector: 'rooms',
    template: `
    <div><h1>Room Explorer</h1></div>

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
    
    <div class="round_box">
        <input-suggest eager="true" matchMode="prefix" [suggestions]="buildingShortNames"
            txtLabel="Distance to: " addBtnLabel="Add" (select)="addDistCol($event)">
        </input-suggest>
    </div>

    <filter-creator [api]="whereAPI" [dataCols]="dataCols" (error)="handleUIError($event)" (contentChange)="whereUIChange($event)"></filter-creator>

    <aggregator     id="{{id}}_agg" [api]="applyAPI" [dataCols]="dataCols" (error)="handleUIError($event)" (contentChange)="applyUIChange($event)"></aggregator>

    <order-selector [api]="orderAPI" (error)="handleUIError($event)" (contentChange)="orderUIChange($event)"></order-selector>

    <div style="height: 500px"></div>

    </div>
    `,
    providers:[RoomService]
})

export class RoomComponent  {

    constructor(private roomService: RoomService){}

    @Input() id: string;
    @Output() addRooms: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    @ViewChild('distInput') distInputEl: any;

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

    /* GET columns */
    inputGetArray: Array<any> = [];
    inputGetCustomArray: Array<any> = [];
    inputGetNotCustomArray: Array<any> = [];

    distancesArray: Array<any> = [];
    buildingShortNames: Array<string> = [];

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
            rooms_fullname: {type: 'string',name:'Full Name', suggMatchType: 'substr'},
            rooms_shortname: {type: 'string',name:'Short Name', suggMatchType: 'prefix'},
            rooms_number: {type: 'string',name:'Room Number', suggMatchType: 'prefix'},
            rooms_name: {type: 'string',name:'Room Full Name', suggMatchType: 'substr'},
            rooms_address: {type: 'string',name:'Room Address', suggMatchType: 'substr'},
            rooms_lat: {type: 'number',name:'Building Latitude'},
            rooms_lon: {type: 'number',name:'Building Longitude'},
            rooms_seats: {type: 'number',name:'Room Seat Capacity'},
            rooms_type: {type: 'string',name:'Room Type', suggMatchType: 'substr'},
            rooms_furniture: {type: 'string',name:'Room Furniture', suggMatchType: 'substr'},
            rooms_href: {type: 'string',name:'Room Info', suggMatchType: 'substr'},
            rooms_none: {type: 'number', name: '(none)', expr: '1'},
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

        let latlonList: QueryRequest = {
            GET:   ["rooms_shortname","rooms_lat","rooms_lon"],
            WHERE: {},
            GROUP: ["rooms_shortname","rooms_lat","rooms_lon"],
            APPLY: [],
            ORDER: '',
            AS:    'TABLE'
        };
        let that = this;
        this.roomService.roomsQuery(latlonList).then(function (res: any) {
            that.distancesArray = res.json().result;
            for (let obj of that.distancesArray) {
                that.buildingShortNames.push(obj['rooms_shortname']);
            }
        });
        this.dataCols.forEach(function (obj: any) {
            obj.uniqueVals = [];
            if (obj.expr) return;
            if (obj.type == 'number') return;
            let query: QueryRequest = {
                GET:   [obj.key],
                WHERE: {},
                GROUP: [obj.key],
                APPLY: [],
                ORDER: obj.key,
                AS:    'TABLE'
            };
            that.roomService.roomsQuery(query).then(function (res: any) {
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
        this.inputGetStr = '["rooms_fullname", "rooms_number", "rooms_lat", "rooms_lon", "expr(latlondist(rooms_lat, rooms_lon, 49.26125, -123.24807)) AS distFromDMP"]';
        this.inputGetChange();

        this.inputWhereStr = '{}';
        this.inputWhereChange();

        this.inputApplyStr = '';
        this.inputApplyChange();

        this.inputOrderStr = '{ "dir": "UP", "keys": ["distFromDMP", "rooms_fullname", "rooms_number"]}';
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

    addDistCol(str: string) {
        let index = -1;
        for (let i = 0; i < this.distancesArray.length; i++) {
            if (str === this.distancesArray[i]['rooms_shortname']) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            return;
        }

        let keyName = "distTo" + str;
        let funName = "Distance to " + str;
        let exprName = "roundN(latlondist(rooms_lat, rooms_lon, " +
                this.distancesArray[index]['rooms_lat'] + ", " +
                this.distancesArray[index]['rooms_lon'] + "), 3)";

        if (this.findDataCol(keyName)) return;

        let obj = {
            id: this.dataCols.length,
            key: keyName,
            type: "number",
            name: funName,
            expr: exprName
        }
        this.dataCols.push(obj);
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
            this.roomService.roomsQuery(req).then(function (res: any) {
                that.renderResult(res.json().result);

            }).catch(function (err: any) {
                if (err.status == 424) {
                    that.currError = "Unable to find datasets: " + JSON.parse(err._body).missing.join(", ");
                } else {
                    that.currError = JSON.parse(err._body).error;
                }
            });

        } catch (e) {
            this.currError = e.message;
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
        this.currError = '';
        let that = this;
        let seenCols: any = {};
        for (let x of this.resultCols) {
            seenCols[x] = true;
        }

        if (!seenCols['rooms_name'] &&
            (!seenCols['rooms_shortname'] || !seenCols['rooms_number'])) {
            this.currError = 'Query must have Building Short Name + Room Number, or Room Full Name';
            return;
        }

        let seen: any = {};
        let arr: Array<any> = [];
        for (let i = 0; i < this.resultRows.length; i++) {
            if (this.resultSelected[i]) {
                let building: string;
                let room: string;
                if (seenCols['rooms_name']) {
                    let toks = this.resultRows[i]['rooms_name'].split('_');
                    building = toks[0];
                    room = toks[1];
                } else {
                    building = this.resultRows[i]['rooms_shortname'];
                    room = this.resultRows[i]['rooms_number'];
                }
                if (!seen[building]) {
                    seen[building] = {};
                }
                if (!seen[building][room]) {
                    seen[building][room] = true;
                    arr.push({building: building, room: room});
                }
            }
        }
        if (arr.length == 0) {
            this.currError = 'Must select at least one room';
            return;
        }

        let query1: any = {
            GET:   ['rooms_shortname', 'rooms_number', 'rooms_seats', 'rooms_type', 'rooms_furniture'],
            WHERE: {OR: []},
            ORDER: {dir: 'UP', keys: ['rooms_shortname', 'rooms_number']},
            AS:    'TABLE'
        }
        for (let x of arr) {
            query1.WHERE.OR.push({ AND: [
                { IS: { rooms_shortname: x['building'] }},
                { IS: { rooms_number:    x['room'] } }
            ]});
        }
        this.roomService.roomsQuery(query1).then(function (res1: any) {
            let arr: Array<any> = res1.json().result;
            let res2: Array<any> = [];

            for (let z of arr) {
                res2.push({
                    building: z['rooms_shortname'],
                    room: z['rooms_number'],
                    seats: z['rooms_seats'],
                    type: z['rooms_type'],
                    furniture: z['rooms_furniture']
                });
            }
            that.addRooms.emit(res2);

        }).catch(function (err) {
            try {
                that.currError = JSON.parse(err._body).error;
            } catch (e) {
                that.currError = err.message;
            }
        });
    }
}
