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
var ColumnSelectorComponent = (function () {
    function ColumnSelectorComponent() {
        this.contentChange = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.isSelected = [];
        this.currSelected = [];
        this.customExpr = '';
        this.customColName = '';
    }
    ColumnSelectorComponent.prototype.ngOnInit = function () {
        var that = this;
        this.api.setContent = function (str) { that.setContentFromString(str); };
    };
    ColumnSelectorComponent.prototype.setContentFromString = function (str) {
        try {
            for (var i = 0; i < this.isSelected.length; i++) {
                this.isSelected[i] = false;
            }
            this.currSelected = [];
            this.sendUpdateEvent(true);
            var obj = JSON.parse(str);
            for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
                var col = obj_1[_i];
                var colObj = this.findDataCol(col);
                if (col.substring(0, 4) == 'expr') {
                    var toks = col.trim().split(' ');
                    colObj = this.findDataCol(toks[toks.length - 1]);
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
        }
        catch (e) {
            this.error.emit(e);
        }
    };
    ColumnSelectorComponent.prototype.sendUpdateEvent = function (isFromAPI) {
        this.contentChange.emit({ cols: this.currSelected, isFromAPI: isFromAPI });
    };
    ColumnSelectorComponent.prototype.toggleSelection = function (id) {
        if (this.isSelected[id]) {
            for (var i = 0; i < this.currSelected.length; i++) {
                if (this.currSelected[i] == this.dataCols[id].key) {
                    this.currSelected.splice(i, 1);
                    break;
                }
            }
            this.isSelected[id] = false;
        }
        else {
            this.currSelected.push(this.dataCols[id].key);
            this.isSelected[id] = true;
        }
        this.sendUpdateEvent(false);
    };
    ColumnSelectorComponent.prototype.addCustom = function () {
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
    };
    ColumnSelectorComponent.prototype.findDataCol = function (col) {
        for (var _i = 0, _a = this.dataCols; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.key == col) {
                return obj;
            }
        }
        return undefined;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ColumnSelectorComponent.prototype, "api", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], ColumnSelectorComponent.prototype, "dataCols", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ColumnSelectorComponent.prototype, "contentChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ColumnSelectorComponent.prototype, "error", void 0);
    ColumnSelectorComponent = __decorate([
        core_1.Component({
            selector: 'column-selector',
            template: "\n    <div class=\"column-selector_root\">\n\n    <div class=\"round_box\">\n        <h2>Display</h2>\n        <ul class=\"single_select\">\n            <li *ngFor=\"let col of dataCols\">\n                <a (click)=\"toggleSelection(col.id)\" [class.active]=\"isSelected[col.id]\">{{col.name}}</a>\n            </li>\n        </ul>\n        <div style=\"clear: left\"></div>\n        Expression: <input style=\"width: 50%\" [(ngModel)]=\"customExpr\"> AS <input style=\"width: 20%\" [(ngModel)]=\"customColName\"> <button (click)=\"addCustom()\">Add!</button>\n    </div>\n\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], ColumnSelectorComponent);
    return ColumnSelectorComponent;
}());
exports.ColumnSelectorComponent = ColumnSelectorComponent;
//# sourceMappingURL=column-selector.component.js.map