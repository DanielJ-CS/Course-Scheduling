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
var AggregatorComponent = (function () {
    function AggregatorComponent() {
        this.contentChange = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.enabled = false;
        this.rules = [];
        this.aggOps = ["MAX", "MIN", "AVG", "COUNT"];
        this.aggOpDisplay = {
            MAX: "Maximum",
            MIN: "Minimum",
            AVG: "Average",
            COUNT: "Unique Count"
        };
        this.aggOpTypes = {
            MAX: { "number": true, "string": true },
            MIN: { "number": true, "string": true },
            AVG: { "number": true },
            COUNT: { "number": true, "string": true }
        };
        this.goodCols = [];
        this.currOp = '';
    }
    AggregatorComponent.prototype.ngOnInit = function () {
        var that = this;
        this.api.setContent = function (str) { that.setContentFromString(str); };
    };
    AggregatorComponent.prototype.setContentFromString = function (str) {
        try {
            this.rules = [];
            if (str == '') {
                this.enabled = false;
                this.sendUpdateEvent(true);
                return;
            }
            else {
                this.enabled = true;
                this.sendUpdateEvent(true);
            }
            var arr = JSON.parse(str);
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var obj = arr_1[_i];
                var name_1 = void 0;
                var op = void 0;
                var col = void 0;
                for (var k in obj) {
                    name_1 = k;
                    break;
                }
                for (var k in obj[name_1]) {
                    op = k;
                    break;
                }
                col = obj[name_1][op];
                var colObj = this.findDataCol(col);
                if (col.substring(0, 4) == 'expr' || (colObj && this.aggOpTypes[op] && this.aggOpTypes[op][colObj.type])) {
                    var disp = this.getRuleDesc(name_1, op, col);
                    this.rules.push({ op: op, col: col, name: name_1, display: disp });
                }
            }
            this.sendUpdateEvent(true);
        }
        catch (e) {
            this.error.emit(e);
        }
    };
    AggregatorComponent.prototype.sendUpdateEvent = function (isFromAPI) {
        if (this.enabled) {
            var rulesArr = [];
            var colsArr = [];
            for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
                var obj = _a[_i];
                rulesArr.push((_b = {}, _b[obj.name] = (_c = {}, _c[obj.op] = obj.col, _c), _b));
                colsArr.push(obj.name);
            }
            var evt = {
                enabled: true,
                str: JSON.stringify(rulesArr),
                cols: colsArr,
                isFromAPI: isFromAPI
            };
            this.contentChange.emit(evt);
        }
        else {
            this.contentChange.emit({ enabled: false, str: "", cols: [], isFromAPI: isFromAPI });
        }
        var _b, _c;
    };
    AggregatorComponent.prototype.toggleEnable = function () {
        this.enabled = !this.enabled;
        this.sendUpdateEvent(false);
    };
    AggregatorComponent.prototype.selectOp = function (op) {
        this.currOp = op;
        this.goodCols = [];
        for (var _i = 0, _a = this.dataCols; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (this.aggOpTypes[this.currOp][obj.type]) {
                this.goodCols.push(obj);
            }
        }
    };
    AggregatorComponent.prototype.selectCol = function (col) {
        var colObj = this.findDataCol(col);
        var name = this.genRuleName(this.currOp, col);
        var disp = this.getRuleDesc(name, this.currOp, col);
        var colExpr = ((colObj && colObj.expr)
            ? ('expr(' + colObj.expr + ')')
            : ((colObj.type == 'string' && (this.currOp == 'MAX' || this.currOp == 'MIN')) ? 'expr(' + col + ')' : col));
        this.rules.push({ op: this.currOp, col: colExpr, name: name, display: disp });
        this.sendUpdateEvent(false);
    };
    AggregatorComponent.prototype.deleteRule = function (obj) {
        for (var i = 0; i < this.rules.length; i++) {
            if (this.rules[i] == obj) {
                this.rules.splice(i, 1);
                break;
            }
        }
        this.sendUpdateEvent(false);
    };
    AggregatorComponent.prototype.findDataCol = function (col) {
        for (var _i = 0, _a = this.dataCols; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.key == col) {
                return obj;
            }
        }
        return undefined;
    };
    AggregatorComponent.prototype.genRuleName = function (op, col) {
        var res = op.toLowerCase();
        var arr = col.split("_");
        for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
            var str = arr_2[_i];
            res += str.substr(0, 1).toUpperCase() + str.substr(1);
        }
        return res;
    };
    AggregatorComponent.prototype.getRuleDesc = function (name, op, col) {
        var colObj = this.findDataCol(col);
        return name + " = " + this.aggOpDisplay[op] + " of " + (colObj ? colObj.name : col);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], AggregatorComponent.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AggregatorComponent.prototype, "api", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], AggregatorComponent.prototype, "dataCols", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], AggregatorComponent.prototype, "contentChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], AggregatorComponent.prototype, "error", void 0);
    AggregatorComponent = __decorate([
        core_1.Component({
            selector: 'aggregator',
            template: "\n    <div class=\"aggregator_root\">\n\n    <div class=\"round_box\">\n        <ul class=\"single_select\">\n            <h2>Aggregate</h2>\n            <input id=\"{{id}}_enable_chk\" type=\"checkbox\" [(ngModel)]=\"enabled\" (change)=\"toggleEnable()\">\n            <label [attr.for]=\"id + '_enable_chk'\">Aggregate results</label>\n        </ul>\n        <div *ngIf=\"enabled\">\n            <div *ngIf=\"rules.length == 0\">(no aggregation rules)</div>\n            <ul *ngIf=\"rules.length > 0\">\n                <li *ngFor=\"let obj of rules\">\n                    {{obj.display}}\n                    <button (click)=\"deleteRule(obj)\">X</button>\n                </li>\n            </ul>\n        </div>\n        <div style=\"clear: left\"></div>\n    </div>\n\n    <div class=\"round_box\" *ngIf=\"enabled\">\n        <ul class=\"single_select\">\n            <li *ngFor=\"let op of aggOps\"><a (click)=\"selectOp(op)\" [class.active]=\"currOp == op\">{{op}}</a></li>\n        </ul>\n        <div style=\"clear: left\"></div>\n    </div>\n\n    <div class=\"round_box\" *ngIf=\"enabled && currOp != ''\">\n        <ul class=\"single_select\">\n            <li *ngFor=\"let col of goodCols\">\n                <a (click)=\"selectCol(col.key)\">{{col.name}}</a>\n            </li>\n        </ul>\n        <div style=\"clear: left\"></div>\n    </div>\n\n    </div>\n    ",
        }), 
        __metadata('design:paramtypes', [])
    ], AggregatorComponent);
    return AggregatorComponent;
}());
exports.AggregatorComponent = AggregatorComponent;
//# sourceMappingURL=aggregator.component.js.map