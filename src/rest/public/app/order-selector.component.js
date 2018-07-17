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
var OrderSelectorComponent = (function () {
    function OrderSelectorComponent() {
        this.contentChange = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.goodCols = [];
        this.isColSelected = {};
        this.currCols = [];
        this.unusedCols = [];
        this.orderDirs = ["UP", "DOWN"];
        this.currDir = 'UP';
    }
    OrderSelectorComponent.prototype.ngOnInit = function () {
        var that = this;
        this.api.setContent = function (str) { that.setContentFromString(str); };
        this.api.setAvailableCols = function (arr) { that.restrictCols(arr); };
    };
    OrderSelectorComponent.prototype.setContentFromString = function (str) {
        this.isColSelected = {};
        this.currCols = [];
        this.unusedCols = [];
        for (var _i = 0, _a = this.goodCols; _i < _a.length; _i++) {
            var colObj = _a[_i];
            this.unusedCols.push(colObj);
        }
        this.currDir = this.orderDirs[0];
        if (str == '')
            return;
        try {
            var obj = JSON.parse(str);
            if ((typeof obj) === 'string') {
                obj = { dir: this.orderDirs[0], keys: [obj] };
            }
            this.currDir = obj['dir'];
            for (var _b = 0, _c = obj['keys']; _b < _c.length; _b++) {
                var key = _c[_b];
                for (var i = 0; i < this.unusedCols.length; i++) {
                    var colObj = this.unusedCols[i];
                    if (colObj.key == key) {
                        this.isColSelected[key] = true;
                        this.unusedCols.splice(i, 1);
                        this.currCols.push(colObj);
                        break;
                    }
                }
            }
        }
        catch (e) {
            this.error.emit(e);
        }
    };
    OrderSelectorComponent.prototype.restrictCols = function (goodCols) {
        this.goodCols = goodCols;
        this.fixCols();
        this.sendUpdateEvent();
    };
    OrderSelectorComponent.prototype.fixCols = function () {
        var seen = {};
        for (var _i = 0, _a = this.goodCols; _i < _a.length; _i++) {
            var colObj = _a[_i];
            seen[colObj.key] = true;
        }
        var newCols = [];
        for (var _b = 0, _c = this.currCols; _b < _c.length; _b++) {
            var colObj = _c[_b];
            if (seen[colObj.key]) {
                newCols.push(colObj);
            }
            else {
                this.isColSelected[colObj.key] = false;
            }
        }
        this.currCols = newCols;
        var newUnused = [];
        for (var _d = 0, _e = this.goodCols; _d < _e.length; _d++) {
            var colObj = _e[_d];
            if (!this.isColSelected[colObj.key]) {
                newUnused.push(colObj);
            }
        }
        this.unusedCols = newUnused;
    };
    OrderSelectorComponent.prototype.sendUpdateEvent = function () {
        if (this.currCols.length > 0) {
            var colsArr = [];
            for (var _i = 0, _a = this.currCols; _i < _a.length; _i++) {
                var colObj = _a[_i];
                colsArr.push(colObj.key);
            }
            var obj = {
                dir: this.currDir,
                keys: colsArr
            };
            this.contentChange.emit(JSON.stringify(obj));
        }
        else {
            this.contentChange.emit('');
        }
    };
    OrderSelectorComponent.prototype.selectCol = function (col) {
        this.currCols.push(col);
        this.isColSelected[col.key] = true;
        for (var i = 0; i < this.unusedCols.length; i++) {
            if (this.unusedCols[i].key == col.key) {
                this.unusedCols.splice(i, 1);
                break;
            }
        }
        this.sendUpdateEvent();
    };
    OrderSelectorComponent.prototype.selectDir = function (dir) {
        this.currDir = dir;
        this.sendUpdateEvent();
    };
    OrderSelectorComponent.prototype.deleteCol = function (col) {
        for (var i = 0; i < this.currCols.length; i++) {
            if (this.currCols[i].key == col.key) {
                this.isColSelected[col.key] = false;
                this.currCols.splice(i, 1);
                break;
            }
        }
        this.fixCols();
        this.sendUpdateEvent();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], OrderSelectorComponent.prototype, "api", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], OrderSelectorComponent.prototype, "contentChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], OrderSelectorComponent.prototype, "error", void 0);
    OrderSelectorComponent = __decorate([
        core_1.Component({
            selector: 'order-selector',
            template: "\n    <div class=\"order-selector_root\">\n\n    <div class=\"round_box\">\n        <h2>Order</h2>\n        <div *ngIf=\"currCols.length == 0\">(no ordering)</div>\n        <ul *ngIf=\"currCols.length > 0\">\n            <li *ngFor=\"let col of currCols\">\n                {{col.name}}\n                <button (click)=\"deleteCol(col)\">X</button>\n            </li>\n        </ul>\n    </div>\n\n    <div class=\"round_box\">\n        <div *ngIf=\"unusedCols.length == 0\">(all columns already used for ordering)</div>\n        <ul class=\"single_select\" *ngIf=\"unusedCols.length > 0\">\n            <li *ngFor=\"let col of unusedCols\">\n                <a (click)=\"selectCol(col)\">{{col.name}}</a>\n            </li>\n        </ul>\n        <div style=\"clear: left\"></div>\n    </div>\n\n    <div class=\"round_box\">\n        <ul class=\"single_select\">\n            <li *ngFor=\"let dir of orderDirs\">\n                <a (click)=\"selectDir(dir)\" [class.active]=\"currDir == dir\">{{dir}}</a>\n            </li>\n        </ul>\n        <div style=\"clear: left\"></div>\n    </div>\n\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], OrderSelectorComponent);
    return OrderSelectorComponent;
}());
exports.OrderSelectorComponent = OrderSelectorComponent;
//# sourceMappingURL=order-selector.component.js.map