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
var tree_view_component_1 = require("./tree-view.component");
var FilterCreatorComponent = (function () {
    function FilterCreatorComponent() {
        this.contentChange = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.logicOps = ['AND', 'OR', 'NOT'];
        this.numberOps = [
            { key: 'LT', name: "Less than", shortDisplay: "<" },
            { key: 'GT', name: "Greater than", shortDisplay: ">" },
            { key: 'EQ', name: "Equals", shortDisplay: "=" }
        ];
        this.stringOps = [{ key: 'IS', name: "Matches", shortDisplay: "matches" }];
        this.currCol = -1;
        this.currOp = '';
        this.currOpType = '';
        this.currValIsEager = false;
        this.currColMatchMode = '';
        this.currColSugg = [];
        this.currTree = new tree_view_component_1.TreeViewNode();
        this.currNode = undefined;
    }
    FilterCreatorComponent.prototype.ngOnInit = function () {
        var that = this;
        this.api.setContent = function (str) { that.setFilterFromString(str); };
    };
    FilterCreatorComponent.prototype.obj2tree = function (obj) {
        var res = new tree_view_component_1.TreeViewNode();
        var op;
        for (var k in obj) {
            op = k;
            break;
        }
        if (op == 'AND' || op == 'OR' || op == 'NOT') {
            res.data = op;
            res.display = op;
            if (op == 'NOT') {
                res.addChild(this.obj2tree(obj[op]));
            }
            else {
                for (var i = 0; i < obj[op].length; i++) {
                    res.addChild(this.obj2tree(obj[op][i]));
                }
            }
        }
        else {
            var col = void 0;
            for (var k in obj[op]) {
                col = k;
                break;
            }
            res.data = obj;
            res.display = this.getFilterText(col, op, obj[op][col]);
        }
        return res;
    };
    FilterCreatorComponent.prototype.setFilterFromString = function (str) {
        try {
            this.currTree.clear();
            if (str.length == 0 || str == "{}") {
                this.currNode = undefined;
                return;
            }
            var obj = JSON.parse(str);
            this.currTree.addChild(this.obj2tree(obj));
            this.currNode = this.currTree.child[0];
        }
        catch (e) {
            this.error.emit(e);
        }
    };
    FilterCreatorComponent.prototype.tree2obj = function (u) {
        var res = {};
        if (u.data == 'AND' || u.data == 'OR') {
            res[u.data] = [];
            for (var _i = 0, _a = u.child; _i < _a.length; _i++) {
                var c = _a[_i];
                res[u.data].push(this.tree2obj(c));
            }
        }
        else if (u.data == 'NOT') {
            res[u.data] = this.tree2obj(u.child[0]);
        }
        else {
            res = u.data;
        }
        return res;
    };
    FilterCreatorComponent.prototype.getFilterString = function () {
        if (this.currTree.child.length == 0) {
            return "{}";
        }
        return JSON.stringify(this.tree2obj(this.currTree.child[0]));
    };
    FilterCreatorComponent.prototype.setActiveNode = function (v) {
        if (v == this.currTree) {
            this.currNode = undefined;
        }
        else {
            this.currNode = v;
        }
    };
    FilterCreatorComponent.prototype.nodeDelete = function (v) {
        this.contentChange.emit(this.getFilterString());
    };
    FilterCreatorComponent.prototype.addLogicOp = function (op) {
        var par;
        var curr;
        if (this.currNode) {
            if (this.currNode.data == op && op != 'NOT')
                return;
            par = this.currNode.par;
            curr = this.currNode;
        }
        else {
            par = this.currTree;
            curr = this.currTree.child[0];
        }
        if (par.data == op) {
            this.currNode = par;
        }
        else {
            var u = new tree_view_component_1.TreeViewNode();
            u.data = op;
            u.display = op;
            if (curr) {
                u.addChild(curr);
                par.replaceChild(curr, u);
            }
            else {
                par.addChild(u);
            }
            this.currNode = u;
            this.contentChange.emit(this.getFilterString());
        }
    };
    FilterCreatorComponent.prototype.selectCol = function (id) {
        this.clearFilter();
        this.currCol = id;
    };
    FilterCreatorComponent.prototype.selectOp = function (op, opType) {
        this.currOp = op;
        this.currOpType = opType;
        var suggVals = this.dataCols[this.currCol].uniqueVals;
        this.currColSugg = suggVals ? suggVals : [];
        this.currColMatchMode = this.dataCols[this.currCol].suggMatchType;
        if (this.currOpType == 'number') {
            var that_1 = this;
            setTimeout(function () { that_1.currValEl.nativeElement.focus(); }, 40);
        }
    };
    FilterCreatorComponent.prototype.currValKeyUp = function (event) {
        if (this.currOpType == 'number') {
            this.currVal = this.currVal.replace(/[^0-9.-]*/, "");
        }
        if (event.code == 'Enter') {
            this.addFilter();
        }
    };
    FilterCreatorComponent.prototype.getFilterText = function (col, op, val) {
        var str = '';
        for (var _i = 0, _a = this.dataCols; _i < _a.length; _i++) {
            var x = _a[_i];
            if (x.key == col || x.expr == col.substring(5, -1))
                str += x.name;
        }
        for (var _b = 0, _c = this.stringOps; _b < _c.length; _b++) {
            var x = _c[_b];
            if (x.key == op)
                str += ' ' + x.shortDisplay + ' ';
        }
        for (var _d = 0, _e = this.numberOps; _d < _e.length; _d++) {
            var x = _e[_d];
            if (x.key == op)
                str += ' ' + x.shortDisplay + ' ';
        }
        str += val;
        return str;
    };
    FilterCreatorComponent.prototype.valSuggSelect = function (str) {
        this.currVal = str;
        this.addFilter();
    };
    FilterCreatorComponent.prototype.valSuggCancel = function (str) {
        this.clearFilter();
    };
    FilterCreatorComponent.prototype.addFilter = function () {
        var colObj = this.dataCols[this.currCol];
        var key = colObj['key'];
        var expr = colObj['expr'];
        var val = (this.currOpType == 'number' ? parseFloat(this.currVal) : this.currVal);
        var filterObj = (_a = {}, _a[this.currOp] = (_b = {}, _b[expr ? ('expr(' + expr + ')') : key] = val, _b), _a);
        var n0 = new tree_view_component_1.TreeViewNode();
        n0.data = filterObj;
        n0.display = this.getFilterText(colObj['key'], this.currOp, this.currVal);
        if (this.currTree.child.length == 0) {
            this.currTree.addChild(n0);
            this.currNode = n0;
        }
        else if (this.currNode) {
            if (this.currNode.data == 'AND' || this.currNode.data == 'OR' ||
                (this.currNode.data == 'NOT' && this.currNode.child.length == 0)) {
                this.currNode.addChild(n0);
                this.currNode = n0;
            }
            else if (this.currNode.par.data == 'AND' || this.currNode.par.data == 'OR') {
                this.currNode.par.addChild(n0);
                this.currNode = n0;
            }
            else {
                this.error.emit(new Error("Multiple filters must be joined using AND/OR, please select one of AND/OR before adding this filter"));
                return;
            }
        }
        this.contentChange.emit(this.getFilterString());
        this.clearFilter();
        var _a, _b;
    };
    FilterCreatorComponent.prototype.clearFilter = function () {
        this.currCol = -1;
        this.currOp = '';
        this.currOpType = '';
        this.currVal = '';
    };
    __decorate([
        core_1.ViewChild('currValEl'), 
        __metadata('design:type', Object)
    ], FilterCreatorComponent.prototype, "currValEl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], FilterCreatorComponent.prototype, "api", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], FilterCreatorComponent.prototype, "dataCols", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], FilterCreatorComponent.prototype, "contentChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], FilterCreatorComponent.prototype, "error", void 0);
    FilterCreatorComponent = __decorate([
        core_1.Component({
            selector: 'filter-creator',
            template: "\n    <div class=\"filter-creator_root\">\n\n    <div class=\"round_box\">\n        <h2>Filter By</h2>\n        <ul *ngIf=\"currTree.child.length > 0\" class=\"tree-view tree-view-root\">\n            <tree-view\n                [node]=\"currTree.child[0]\" [active]=\"currNode\"\n                (activeChange)=\"setActiveNode($event)\"\n                (nodeDelete)=\"nodeDelete($event)\">\n            </tree-view>\n        </ul>\n        <span *ngIf=\"currTree.child.length == 0\">(no filter)</span>\n    </div>\n\n    <div class=\"round_box\">\n        <ul class=\"single_select\">\n            <li *ngFor=\"let op of logicOps\">\n                <a (click)=\"addLogicOp(op)\">{{op}}</a>\n            </li>\n        </ul>\n        <div style=\"clear: left\"></div>\n    </div>\n\n    <div class=\"round_box\">\n        <ul class=\"single_select\">\n            <li *ngFor=\"let col of dataCols\">\n                <a (click)=\"selectCol(col.id)\"\n                    [class.active]=\"currCol == col.id\">\n                    {{col.name}}\n                </a>\n            </li>\n        </ul>\n        <div style=\"clear: left\"></div>\n    </div>\n\n    <div class=\"round_box\" *ngIf=\"currCol >= 0 && dataCols[currCol]['type'] == 'string'\">\n        <ul class=\"single_select\">\n            <li *ngFor=\"let op of stringOps\">\n                <a (click)=\"selectOp(op.key, 'string')\"\n                    [class.active]=\"currOp == op.key\">\n                    {{op.name}}\n                </a>\n            </li>\n        </ul>\n        <div style=\"clear: left\"></div>\n    </div>\n\n    <div class=\"round_box\" *ngIf=\"currCol >= 0 && dataCols[currCol]['type'] == 'number'\">\n        <ul class=\"single_select\">\n            <li *ngFor=\"let op of numberOps\">\n                <a (click)=\"selectOp(op.key, 'number')\"\n                    [class.active]=\"currOp == op.key\">\n                    {{op.name}}\n                </a>\n            </li>\n        </ul>\n        <div style=\"clear: left\"></div>\n    </div>\n\n    <div class=\"round_box\" *ngIf=\"this.currOp != ''\">\n        <input-suggest *ngIf=\"this.currOpType == 'string'\"\n            [eager]=\"currValIsEager\" [matchMode]=\"currColMatchMode\" [suggestions]=\"currColSugg\"\n            txtLabel=\"Value: \" addBtnLabel=\"Add Filter!\" cancelBtnLabel=\"Cancel\"\n            (select)=\"valSuggSelect($event)\" (cancel)=\"valSuggCancel($event)\">\n        </input-suggest>\n\n        <div *ngIf=\"this.currOpType == 'number'\">\n            <label>Value: </label><input #currValEl [(ngModel)]=\"currVal\" (keyup)=\"currValKeyUp($event)\">\n            <button (click)=\"addFilter()\">Add Filter!</button>\n            <button (click)=\"clearFilter()\">Cancel</button>\n        </div>\n    </div>\n\n    </div>\n    ",
        }), 
        __metadata('design:paramtypes', [])
    ], FilterCreatorComponent);
    return FilterCreatorComponent;
}());
exports.FilterCreatorComponent = FilterCreatorComponent;
//# sourceMappingURL=filter-creator.component.js.map