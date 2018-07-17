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
var courses_service_1 = require("./courses.service");
var CourseComponent = (function () {
    function CourseComponent(courseService) {
        this.courseService = courseService;
        this.addCourses = new core_1.EventEmitter();
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
        this.prevQuery = {};
        this.inputGetArray = [];
        this.inputGetCustomArray = [];
        this.inputGetNotCustomArray = [];
        this.getAPI = {};
        this.whereAPI = {};
        this.applyAPI = {};
        this.orderAPI = {};
    }
    CourseComponent.prototype.ngOnInit = function () {
        var schema = {
            courses_dept: { type: 'string', name: 'Department', suggMatchType: 'prefix' },
            courses_id: { type: 'string', name: 'Course Number', suggMatchType: 'prefix' },
            courses_name: { type: 'string', name: 'Course Name', expr: 'courses_dept + courses_id' },
            courses_title: { type: 'string', name: 'Course Title', suggMatchType: 'substr' },
            courses_year: { type: 'number', name: 'Section Year' },
            courses_instructor: { type: 'string', name: 'Section Instructor', suggMatchType: 'substr' },
            courses_avg: { type: 'number', name: 'Section Average' },
            courses_size: { type: 'number', name: 'Section Size', expr: 'courses_pass + courses_fail' },
            courses_pass: { type: 'number', name: 'Number of Passes' },
            courses_fail: { type: 'number', name: 'Number of Fails' },
            courses_audit: { type: 'number', name: 'Number of Audits' },
            courses_uuid: { type: 'number', name: 'Section UUID' },
            courses_none: { type: 'number', name: '(none)', expr: '1' },
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
        var that = this;
        this.dataCols.forEach(function (obj) {
            obj.uniqueVals = [];
            if (obj.type == 'number')
                return;
            var query = {
                GET: [obj.expr ? 'expr(' + obj.expr + ') AS ' + obj.key : obj.key],
                WHERE: {},
                GROUP: [obj.key],
                APPLY: [],
                ORDER: obj.key,
                AS: 'TABLE'
            };
            that.courseService.courseQuery(query).then(function (res) {
                var arr = res.json().result;
                for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                    var z = arr_1[_i];
                    obj.uniqueVals.push(z[obj.key]);
                }
            });
        });
    };
    CourseComponent.prototype.clearForms = function () {
        this.inputGetStr = '[]';
        this.inputGetChange();
        this.inputWhereStr = '{}';
        this.inputWhereChange();
        this.inputApplyStr = '';
        this.inputApplyChange();
        this.inputOrderStr = '';
        this.inputOrderChange();
    };
    CourseComponent.prototype.fillSampleQuery = function () {
        this.inputGetStr = '["courses_dept", "courses_id", "numSections"]';
        this.inputGetChange();
        this.inputWhereStr = '{"GT": {"courses_avg": 90}}';
        this.inputWhereChange();
        this.inputApplyStr = '[ {"numSections": {"COUNT": "courses_uuid"}} ]';
        this.inputApplyChange();
        this.inputOrderStr = '"numSections"';
        this.inputOrderChange();
    };
    CourseComponent.prototype.handleUIError = function (e) {
        this.currError = e.message;
    };
    CourseComponent.prototype.findDataCol = function (col) {
        for (var _i = 0, _a = this.dataCols; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.key == col) {
                return obj;
            }
        }
        return undefined;
    };
    CourseComponent.prototype.inputGetChange = function () {
        this.currError = '';
        this.getAPI.setContent(this.inputGetStr);
    };
    CourseComponent.prototype.getUIChange = function (e) {
        this.currError = '';
        this.inputGetNotCustomArray = e.cols.concat([]);
        this.syncCols(e.isFromAPI);
    };
    CourseComponent.prototype.serializeGet = function () {
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
    CourseComponent.prototype.inputWhereChange = function () {
        this.currError = '';
        this.whereAPI.setContent(this.inputWhereStr);
    };
    CourseComponent.prototype.whereUIChange = function (str) {
        this.currError = '';
        this.inputWhereStr = str;
    };
    CourseComponent.prototype.inputApplyChange = function () {
        this.currError = '';
        this.applyAPI.setContent(this.inputApplyStr);
    };
    CourseComponent.prototype.applyUIChange = function (e) {
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
    CourseComponent.prototype.inputOrderChange = function () {
        this.currError = '';
        this.orderAPI.setContent(this.inputOrderStr);
    };
    CourseComponent.prototype.orderUIChange = function (str) {
        this.currError = '';
        this.inputOrderStr = str;
    };
    CourseComponent.prototype.syncCols = function (isModifyingInputGet) {
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
    CourseComponent.prototype.getQueryInfo = function () {
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
    CourseComponent.prototype.performQuery = function () {
        try {
            this.currError = "";
            var that_1 = this;
            var req_1 = this.getQueryInfo();
            this.resultCols = [];
            for (var _i = 0, _a = req_1.GET; _i < _a.length; _i++) {
                var col = _a[_i];
                if (col.substring(0, 4) == 'expr') {
                    var toks = col.trim().split(' ');
                    this.resultCols.push(toks[toks.length - 1]);
                }
                else {
                    this.resultCols.push(col);
                }
            }
            this.courseService.courseQuery(req_1).then(function (res) {
                that_1.renderResult(res.json().result);
                that_1.prevQuery = req_1;
            }).catch(function (err) {
                if (err.status == 424) {
                    that_1.currError = "Unable to find datasets: " + JSON.parse(err._body).missing.join(", ");
                }
                else {
                    that_1.currError = JSON.parse(err._body).error;
                }
                that_1.prevQuery = {};
            });
        }
        catch (e) {
            this.currError = e.message;
            this.prevQuery = {};
        }
    };
    CourseComponent.prototype.renderResult = function (rows) {
        this.resultRows = rows;
        this.resultSelected = [];
        if (this.resultRows.length == 0) {
            this.currError = "No matching results!";
        }
    };
    CourseComponent.prototype.resultSelectAll = function () {
        for (var i = 0; i < this.resultRows.length; i++) {
            this.resultSelected[i] = true;
        }
    };
    CourseComponent.prototype.resultDeselectAll = function () {
        for (var i = 0; i < this.resultRows.length; i++) {
            this.resultSelected[i] = false;
        }
    };
    CourseComponent.prototype.resultAddToScheduler = function () {
        var that = this;
        this.currError = '';
        var seenCols = {};
        for (var _i = 0, _a = this.resultCols; _i < _a.length; _i++) {
            var x = _a[_i];
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
        var seen = {};
        var selectedArr = [];
        for (var i = 0; i < this.resultRows.length; i++) {
            if (this.resultSelected[i]) {
                var dept = this.resultRows[i]['courses_dept'];
                var id = this.resultRows[i]['courses_id'];
                if (!seen[dept]) {
                    seen[dept] = {};
                }
                if (!seen[dept][id]) {
                    seen[dept][id] = true;
                    selectedArr.push({ dept: dept, id: id });
                }
            }
        }
        if (selectedArr.length == 0) {
            this.currError = 'Must select at least one course';
            return;
        }
        var query1 = {
            GET: ['courses_dept', 'courses_id', 'maxYear', 'maxSize'],
            WHERE: { GT: { courses_year: 1900 } },
            GROUP: ['courses_dept', 'courses_id'],
            APPLY: [{ maxYear: { MAX: 'courses_year' } },
                { maxSize: { MAX: 'expr(courses_pass + courses_fail)' } }],
            ORDER: { dir: 'UP', keys: ['courses_dept', 'courses_id'] },
            AS: 'TABLE'
        };
        var arr1 = {};
        this.courseService.courseQuery(query1).then(function (res) {
            var arr = res.json().result;
            var query2 = {
                GET: ['courses_dept', 'courses_id', 'courses_title', 'courses_year', 'numSections'],
                WHERE: {},
                GROUP: ['courses_dept', 'courses_id', 'courses_title', 'courses_year'],
                APPLY: [{ numSections: { COUNT: 'courses_uuid' } }],
                ORDER: { dir: 'UP', keys: ['courses_dept', 'courses_id'] },
                AS: 'TABLE'
            };
            for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
                var z = arr_2[_i];
                if (!arr1[z.courses_dept]) {
                    arr1[z.courses_dept] = {};
                }
                if (!arr1[z.courses_dept][z.courses_id]) {
                    arr1[z.courses_dept][z.courses_id] = z;
                    arr1[z.courses_dept][z.courses_id].seen = false;
                }
            }
            return that.courseService.courseQuery(query2);
        }).then(function (res1) {
            var arr = res1.json().result;
            var res2 = [];
            var cnt1900 = 0;
            var is1900 = {};
            for (var i = 0; i < arr.length; i++) {
                var z = arr[i];
                var y = arr1[z.courses_dept] && arr1[z.courses_dept][z.courses_id];
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
                if (y.seen)
                    continue;
                if (z.courses_year != y.maxYear)
                    continue;
                y.seen = true;
                if (seen[z.courses_dept] && seen[z.courses_dept][z.courses_id]) {
                    res2.push({
                        dept: z.courses_dept,
                        id: z.courses_id,
                        title: z.courses_title,
                        sectionSize: y.maxSize,
                        numSections: Math.ceil(z.numSections / 3)
                    });
                }
            }
            for (var i = 0; i < selectedArr.length; i++) {
                var dd = selectedArr[i].dept;
                var ii = selectedArr[i].id;
                if (is1900[dd] && is1900[dd][ii])
                    continue;
                if (!arr1[dd] || !arr1[dd][ii] || !arr1[dd][ii].seen) {
                    that.currError = 'BUG: missed course ' + dd + ii;
                    return;
                }
            }
            that.addCourses.emit(res2);
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
    ], CourseComponent.prototype, "id", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], CourseComponent.prototype, "addCourses", void 0);
    CourseComponent = __decorate([
        core_1.Component({
            selector: 'courses',
            template: "\n    <div><h1>Course Explorer</h1></div>\n\n    <div style=\"float: right; width: 45%\">\n    <div class=\"query_box round_box\">\n        <h2>Raw Query</h2>\n        <div>\n            <label>GET: </label>\n            <input #box1 [(ngModel)]=\"inputGetStr\" class=\"simple_input_text\" (keyup)=\"inputGetChange()\">\n        </div>\n        <div>\n            <label>WHERE:</label>\n            <input #box2 [(ngModel)]=\"inputWhereStr\" class=\"simple_input_text\" (keyup)=\"inputWhereChange()\">\n        </div>\n        <div>\n            <label>GROUP:</label>\n            {{inputGroupStr}}\n        </div>\n        <div>\n            <label>APPLY:</label>\n            <input #box4 [(ngModel)]=\"inputApplyStr\" class=\"simple_input_text\" (keyup)=\"inputApplyChange()\">\n        </div>\n        <div>\n            <label>ORDER:</label>\n            <input #box5 [(ngModel)]=\"inputOrderStr\" class=\"simple_input_text\" (keyup)=\"inputOrderChange()\">\n        </div>\n        <div style=\"padding-top: 1em\">\n            <button (click)=\"clearForms()\">Clear</button>\n            <button (click)=\"fillSampleQuery()\">Sample</button>\n            <button (click)=\"performQuery()\">Submit</button>\n        </div>\n    </div>\n\n    <div class=\"round_box\" *ngIf=\"currError.length > 0\">\n        <h2>Error</h2>\n        {{currError}}\n    </div>\n\n    <div #result_table class=\"results round_box\">\n        <h2>\n            Result ({{resultRows.length}})\n            <button (click)=\"resultSelectAll()\">Select All</button>\n            <button (click)=\"resultDeselectAll()\">Deselect All</button>\n            <button (click)=\"resultAddToScheduler()\">Add To Scheduler</button>\n        </h2>\n        <table>\n        <tr>\n            <th>V</th>\n            <th *ngFor=\"let col of resultCols\">\n                {{findDataCol(col) ? findDataCol(col).name : col}}\n            </th>\n        </tr>\n        <tr *ngFor=\"let row of resultRows; let i = index;\" [class.active]=\"resultSelected[i]\">\n            <td><input type=\"checkbox\" [(ngModel)]=\"resultSelected[i]\"></td>\n            <td *ngFor=\"let col of resultCols\">\n                {{row[col]}}\n            </td>\n        </tr>\n        </table>\n    </div>\n    </div>\n\n    <div style=\"margin-right: 45%\">\n\n    <column-selector [api]=\"getAPI\"  [dataCols]=\"dataCols\" (error)=\"handleUIError($event)\" (contentChange)=\"getUIChange($event)\"></column-selector>\n\n    <filter-creator [api]=\"whereAPI\" [dataCols]=\"dataCols\" (error)=\"handleUIError($event)\" (contentChange)=\"whereUIChange($event)\"></filter-creator>\n\n    <aggregator     id=\"{{id}}_agg\" [api]=\"applyAPI\" [dataCols]=\"dataCols\" (error)=\"handleUIError($event)\" (contentChange)=\"applyUIChange($event)\"></aggregator>\n\n    <order-selector [api]=\"orderAPI\" (error)=\"handleUIError($event)\" (contentChange)=\"orderUIChange($event)\"></order-selector>\n\n    <div style=\"height: 500px\"></div>\n\n    </div>\n    ",
            providers: [courses_service_1.CourseService]
        }), 
        __metadata('design:paramtypes', [courses_service_1.CourseService])
    ], CourseComponent);
    return CourseComponent;
}());
exports.CourseComponent = CourseComponent;
//# sourceMappingURL=courses.component.js.map