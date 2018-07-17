"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var rooms_service_1 = require("./rooms.service");
var RoomComponent = (function () {
    function RoomComponent(roomService) {
        this.roomService = roomService;
        this.addRooms = new core_1.EventEmitter();
        this.dataCols = [];
        this.inputGetStr = "[]";
        this.inputWhereStr = "{}";
        this.inputGroupStr = "";
        this.inputApplyStr = "";
        this.inputOrderStr = "";
        this.currError = "";
        this.resultRows = [];
        this.resultCols = [];
        this.resultSelected = [];
        this.inputGetArray = [];
        this.inputGetCustomArray = [];
        this.inputGetNotCustomArray = [];
        this.distancesArray = [];
        this.buildingShortNames = [];
        this.getAPI = {};
        this.whereAPI = {};
        this.applyAPI = {};
        this.orderAPI = {};
    }
    RoomComponent.prototype.ngOnInit = function () {
        var schema = {
            rooms_fullname: { type: 'string', name: 'Full Name', suggMatchType: 'substr' },
            rooms_shortname: { type: 'string', name: 'Short Name', suggMatchType: 'prefix' },
            rooms_number: { type: 'string', name: 'Room Number', suggMatchType: 'prefix' },
            rooms_name: { type: 'string', name: 'Room Full Name', suggMatchType: 'substr' },
            rooms_address: { type: 'string', name: 'Room Address', suggMatchType: 'substr' },
            rooms_lat: { type: 'number', name: 'Building Latitude' },
            rooms_lon: { type: 'number', name: 'Building Longitude' },
            rooms_seats: { type: 'number', name: 'Room Seat Capacity' },
            rooms_type: { type: 'string', name: 'Room Type', suggMatchType: 'substr' },
            rooms_furniture: { type: 'string', name: 'Room Furniture', suggMatchType: 'substr' },
            rooms_href: { type: 'string', name: 'Room Info', suggMatchType: 'substr' },
            rooms_none: { type: 'number', name: '(none)', expr: '1' },
        };
        this.dataCols = [];
        for (var key in schema) {
            var currID = this.dataCols.length;
            var currObj = { id: currID, key: key };
            for (var k in schema[key]) {
                currObj[k] = schema[key][k];
            }
            this.dataCols.push(currObj);
        }
        var latlonList = {
            GET: ["rooms_shortname", "rooms_lat", "rooms_lon"],
            WHERE: {},
            GROUP: ["rooms_shortname", "rooms_lat", "rooms_lon"],
            APPLY: [],
            ORDER: '',
            AS: 'TABLE'
        };
        var that = this;
        this.roomService.roomsQuery(latlonList).then(function (res) {
            that.distancesArray = res.json().result;
            for (var _i = 0, _a = that.distancesArray; _i < _a.length; _i++) {
                var obj = _a[_i];
                that.buildingShortNames.push(obj['rooms_shortname']);
            }
        });
        this.dataCols.forEach(function (obj) {
            obj.uniqueVals = [];
            if (obj.expr)
                return;
            if (obj.type == 'number')
                return;
            var query = {
                GET: [obj.key],
                WHERE: {},
                GROUP: [obj.key],
                APPLY: [],
                ORDER: obj.key,
                AS: 'TABLE'
            };
            that.roomService.roomsQuery(query).then(function (res) {
                var arr = res.json().result;
                for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                    var z = arr_1[_i];
                    obj.uniqueVals.push(z[obj.key]);
                }
            });
        });
    };
    RoomComponent.prototype.clearForms = function () {
        this.inputGetStr = '[]';
        this.inputGetChange();
        this.inputWhereStr = '{}';
        this.inputWhereChange();
        this.inputApplyStr = '';
        this.inputApplyChange();
        this.inputOrderStr = '';
        this.inputOrderChange();
    };
    RoomComponent.prototype.fillSampleQuery = function () {
        this.inputGetStr = '["rooms_fullname", "rooms_number", "rooms_lat", "rooms_lon", "expr(latlondist(rooms_lat, rooms_lon, 49.26125, -123.24807)) AS distFromDMP"]';
        this.inputGetChange();
        this.inputWhereStr = '{}';
        this.inputWhereChange();
        this.inputApplyStr = '';
        this.inputApplyChange();
        this.inputOrderStr = '{ "dir": "UP", "keys": ["distFromDMP", "rooms_fullname", "rooms_number"]}';
        this.inputOrderChange();
    };
    RoomComponent.prototype.handleUIError = function (e) {
        this.currError = e.message;
    };
    RoomComponent.prototype.findDataCol = function (col) {
        for (var _i = 0, _a = this.dataCols; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.key == col) {
                return obj;
            }
        }
        return undefined;
    };
    RoomComponent.prototype.inputGetChange = function () {
        this.currError = '';
        this.getAPI.setContent(this.inputGetStr);
    };
    RoomComponent.prototype.getUIChange = function (e) {
        this.currError = '';
        this.inputGetNotCustomArray = e.cols.concat([]);
        this.syncCols(e.isFromAPI);
    };
    RoomComponent.prototype.serializeGet = function () {
        var arr = [];
        for (var _i = 0, _a = this.inputGetArray; _i < _a.length; _i++) {
            var col = _a[_i];
            var colObj = this.findDataCol(col);
            if (colObj && colObj.expr) {
                arr.push('expr(' + colObj.expr + ') AS ' + col);
            }
            else {
                arr.push(col);
            }
        }
        this.inputGetStr = JSON.stringify(arr);
    };
    RoomComponent.prototype.addDistCol = function (str) {
        var index = -1;
        for (var i = 0; i < this.distancesArray.length; i++) {
            if (str === this.distancesArray[i]['rooms_shortname']) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            return;
        }
        var keyName = "distTo" + str;
        var funName = "Distance to " + str;
        var exprName = "roundN(latlondist(rooms_lat, rooms_lon, " +
            this.distancesArray[index]['rooms_lat'] + ", " +
            this.distancesArray[index]['rooms_lon'] + "), 3)";
        if (this.findDataCol(keyName))
            return;
        var obj = {
            id: this.dataCols.length,
            key: keyName,
            type: "number",
            name: funName,
            expr: exprName
        };
        this.dataCols.push(obj);
    };
    RoomComponent.prototype.inputWhereChange = function () {
        this.currError = '';
        this.whereAPI.setContent(this.inputWhereStr);
    };
    RoomComponent.prototype.whereUIChange = function (str) {
        this.currError = '';
        this.inputWhereStr = str;
    };
    RoomComponent.prototype.inputApplyChange = function () {
        this.currError = '';
        this.applyAPI.setContent(this.inputApplyStr);
    };
    RoomComponent.prototype.applyUIChange = function (e) {
        this.currError = '';
        if (e.enabled) {
            this.inputGroupStr = JSON.stringify(this.inputGetNotCustomArray);
            if (!e.isFromAPI) {
                this.inputApplyStr = e.str;
            }
            this.inputGetCustomArray = e.cols;
            this.syncCols(false);
        }
        else {
            this.inputGroupStr = "";
            this.inputApplyStr = "";
            this.inputGetCustomArray = [];
            this.syncCols(false);
        }
    };
    RoomComponent.prototype.inputOrderChange = function () {
        this.currError = '';
        this.orderAPI.setContent(this.inputOrderStr);
    };
    RoomComponent.prototype.orderUIChange = function (str) {
        this.currError = '';
        this.inputOrderStr = str;
    };
    RoomComponent.prototype.syncCols = function (isModifyingInputGet) {
        this.inputGetArray = this.inputGetNotCustomArray.concat(this.inputGetCustomArray);
        if (!isModifyingInputGet) {
            this.serializeGet();
        }
        if (this.inputApplyStr.length > 0) {
            this.inputGroupStr = JSON.stringify(this.inputGetNotCustomArray);
        }
        else {
            this.inputGroupStr = '';
        }
        var goodOrderCols = [];
        for (var _i = 0, _a = this.inputGetArray; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.substring(0, 4) == 'expr') {
                var toks = col.split(' ');
                col = toks[toks.length - 1];
            }
            var colObj = this.findDataCol(col);
            goodOrderCols.push({ key: col, name: (colObj ? colObj.name : col) });
        }
        this.orderAPI.setAvailableCols(goodOrderCols);
    };
    RoomComponent.prototype.getQueryInfo = function () {
        var res = {
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
    };
    RoomComponent.prototype.performQuery = function () {
        try {
            this.currError = "";
            var that_1 = this;
            var req = this.getQueryInfo();
            this.resultCols = [];
            for (var _i = 0, _a = req.GET; _i < _a.length; _i++) {
                var col = _a[_i];
                if (col.substring(0, 4) == 'expr') {
                    var toks = col.trim().split(' ');
                    this.resultCols.push(toks[toks.length - 1]);
                }
                else {
                    this.resultCols.push(col);
                }
            }
            this.roomService.roomsQuery(req).then(function (res) {
                that_1.renderResult(res.json().result);
            }).catch(function (err) {
                if (err.status == 424) {
                    that_1.currError = "Unable to find datasets: " + JSON.parse(err._body).missing.join(", ");
                }
                else {
                    that_1.currError = JSON.parse(err._body).error;
                }
            });
        }
        catch (e) {
            this.currError = e.message;
        }
    };
    RoomComponent.prototype.renderResult = function (rows) {
        this.resultRows = rows;
        this.resultSelected = [];
        if (this.resultRows.length == 0) {
            this.currError = "No matching results!";
        }
    };
    RoomComponent.prototype.resultSelectAll = function () {
        for (var i = 0; i < this.resultRows.length; i++) {
            this.resultSelected[i] = true;
        }
    };
    RoomComponent.prototype.resultDeselectAll = function () {
        for (var i = 0; i < this.resultRows.length; i++) {
            this.resultSelected[i] = false;
        }
    };
    RoomComponent.prototype.resultAddToScheduler = function () {
        this.currError = '';
        var that = this;
        var seenCols = {};
        for (var _i = 0, _a = this.resultCols; _i < _a.length; _i++) {
            var x = _a[_i];
            seenCols[x] = true;
        }
        if (!seenCols['rooms_name'] &&
            (!seenCols['rooms_shortname'] || !seenCols['rooms_number'])) {
            this.currError = 'Query must have Building Short Name + Room Number, or Room Full Name';
            return;
        }
        var seen = {};
        var arr = [];
        for (var i = 0; i < this.resultRows.length; i++) {
            if (this.resultSelected[i]) {
                var building = void 0;
                var room = void 0;
                if (seenCols['rooms_name']) {
                    var toks = this.resultRows[i]['rooms_name'].split('_');
                    building = toks[0];
                    room = toks[1];
                }
                else {
                    building = this.resultRows[i]['rooms_shortname'];
                    room = this.resultRows[i]['rooms_number'];
                }
                if (!seen[building]) {
                    seen[building] = {};
                }
                if (!seen[building][room]) {
                    seen[building][room] = true;
                    arr.push({ building: building, room: room });
                }
            }
        }
        if (arr.length == 0) {
            this.currError = 'Must select at least one room';
            return;
        }
        var query1 = {
            GET: ['rooms_shortname', 'rooms_number', 'rooms_seats', 'rooms_type', 'rooms_furniture'],
            WHERE: { OR: [] },
            ORDER: { dir: 'UP', keys: ['rooms_shortname', 'rooms_number'] },
            AS: 'TABLE'
        };
        for (var _b = 0, arr_2 = arr; _b < arr_2.length; _b++) {
            var x = arr_2[_b];
            query1.WHERE.OR.push({ AND: [
                    { IS: { rooms_shortname: x['building'] } },
                    { IS: { rooms_number: x['room'] } }
                ] });
        }
        this.roomService.roomsQuery(query1).then(function (res1) {
            var arr = res1.json().result;
            var res2 = [];
            for (var _i = 0, arr_3 = arr; _i < arr_3.length; _i++) {
                var z = arr_3[_i];
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
            }
            catch (e) {
                that.currError = err.message;
            }
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RoomComponent.prototype, "id", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], RoomComponent.prototype, "addRooms", void 0);
    __decorate([
        core_1.ViewChild('distInput'), 
        __metadata('design:type', Object)
    ], RoomComponent.prototype, "distInputEl", void 0);
    RoomComponent = __decorate([
        core_1.Component({
            selector: 'rooms',
            template: "\n    <div><h1>Room Explorer</h1></div>\n\n    <div style=\"float: right; width: 45%\">\n    <div class=\"query_box round_box\">\n        <h2>Raw Query</h2>\n        <div>\n            <label>GET: </label>\n            <input #box1 [(ngModel)]=\"inputGetStr\" class=\"simple_input_text\" (keyup)=\"inputGetChange()\">\n        </div>\n        <div>\n            <label>WHERE:</label>\n            <input #box2 [(ngModel)]=\"inputWhereStr\" class=\"simple_input_text\" (keyup)=\"inputWhereChange()\">\n        </div>\n        <div>\n            <label>GROUP:</label>\n            {{inputGroupStr}}\n        </div>\n        <div>\n            <label>APPLY:</label>\n            <input #box4 [(ngModel)]=\"inputApplyStr\" class=\"simple_input_text\" (keyup)=\"inputApplyChange()\">\n        </div>\n        <div>\n            <label>ORDER:</label>\n            <input #box5 [(ngModel)]=\"inputOrderStr\" class=\"simple_input_text\" (keyup)=\"inputOrderChange()\">\n        </div>\n        <div style=\"padding-top: 1em\">\n            <button (click)=\"clearForms()\">Clear</button>\n            <button (click)=\"fillSampleQuery()\">Sample</button>\n            <button (click)=\"performQuery()\">Submit</button>\n        </div>\n    </div>\n\n    <div class=\"round_box\" *ngIf=\"currError.length > 0\">\n        <h2>Error</h2>\n        {{currError}}\n    </div>\n\n    <div #result_table class=\"results round_box\">\n        <h2>\n            Result ({{resultRows.length}})\n            <button (click)=\"resultSelectAll()\">Select All</button>\n            <button (click)=\"resultDeselectAll()\">Deselect All</button>\n            <button (click)=\"resultAddToScheduler()\">Add To Scheduler</button>\n        </h2>\n        <table>\n        <tr>\n            <th>V</th>\n            <th *ngFor=\"let col of resultCols\">\n                {{findDataCol(col) ? findDataCol(col).name : col}}\n            </th>\n        </tr>\n        <tr *ngFor=\"let row of resultRows; let i = index;\" [class.active]=\"resultSelected[i]\">\n            <td><input type=\"checkbox\" [(ngModel)]=\"resultSelected[i]\"></td>\n            <td *ngFor=\"let col of resultCols\">\n                {{row[col]}}\n            </td>\n        </tr>\n        </table>\n    </div>\n    </div>\n\n    <div style=\"margin-right: 45%\">\n\n    <column-selector [api]=\"getAPI\"  [dataCols]=\"dataCols\" (error)=\"handleUIError($event)\" (contentChange)=\"getUIChange($event)\"></column-selector>\n    \n    <div class=\"round_box\">\n        <input-suggest eager=\"true\" matchMode=\"prefix\" [suggestions]=\"buildingShortNames\"\n            txtLabel=\"Distance to: \" addBtnLabel=\"Add\" (select)=\"addDistCol($event)\">\n        </input-suggest>\n    </div>\n\n    <filter-creator [api]=\"whereAPI\" [dataCols]=\"dataCols\" (error)=\"handleUIError($event)\" (contentChange)=\"whereUIChange($event)\"></filter-creator>\n\n    <aggregator     id=\"{{id}}_agg\" [api]=\"applyAPI\" [dataCols]=\"dataCols\" (error)=\"handleUIError($event)\" (contentChange)=\"applyUIChange($event)\"></aggregator>\n\n    <order-selector [api]=\"orderAPI\" (error)=\"handleUIError($event)\" (contentChange)=\"orderUIChange($event)\"></order-selector>\n\n    <div style=\"height: 500px\"></div>\n\n    </div>\n    ",
            providers: [rooms_service_1.RoomService]
        }), 
        __metadata('design:paramtypes', [rooms_service_1.RoomService])
    ], RoomComponent);
    return RoomComponent;
}());
exports.RoomComponent = RoomComponent;
//# sourceMappingURL=rooms.component.js.map