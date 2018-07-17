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
var TreeViewNode = (function () {
    function TreeViewNode() {
        this.par = undefined;
        this.child = [];
    }
    TreeViewNode.prototype.clear = function () {
        this.child = [];
    };
    TreeViewNode.prototype.addChild = function (v) {
        this.child.push(v);
        v.par = this;
    };
    TreeViewNode.prototype.replaceChild = function (fromNode, toNode) {
        for (var i = 0; i < this.child.length; i++) {
            if (this.child[i] == fromNode) {
                this.child[i] = toNode;
                toNode.par = this;
                return true;
            }
        }
        return false;
    };
    TreeViewNode.prototype.removeChild = function (v) {
        for (var i = 0; i < this.child.length; i++) {
            if (this.child[i] == v) {
                this.child.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    TreeViewNode.prototype.contains = function (v) {
        if (this == v)
            return true;
        for (var i = 0; i < this.child.length; i++) {
            var res = this.child[i].contains(v);
            if (res)
                return true;
        }
        return false;
    };
    return TreeViewNode;
}());
exports.TreeViewNode = TreeViewNode;
var TreeViewComponent = (function () {
    function TreeViewComponent() {
        this.activeChange = new core_1.EventEmitter();
        this.nodeDelete = new core_1.EventEmitter();
    }
    TreeViewComponent.prototype.setActive = function (v) {
        this.activeChange.emit(v);
    };
    TreeViewComponent.prototype.handleNodeDelete = function (v) {
        this.nodeDelete.emit(v);
    };
    TreeViewComponent.prototype.deleteNode = function () {
        if (this.node.par) {
            this.node.par.removeChild(this.node);
        }
        if (this.active && this.node.contains(this.active)) {
            this.activeChange.emit(this.node.par);
        }
        this.nodeDelete.emit(this.node);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', TreeViewNode)
    ], TreeViewComponent.prototype, "node", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', TreeViewNode)
    ], TreeViewComponent.prototype, "active", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], TreeViewComponent.prototype, "activeChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], TreeViewComponent.prototype, "nodeDelete", void 0);
    TreeViewComponent = __decorate([
        core_1.Component({
            selector: 'tree-view',
            template: "\n    <li [class.active]=\"active == node\">\n        <div class=\"tree-node-select\">\n            <a (click)=\"setActive(node)\">{{node.display}}</a>\n            <button (click)=\"deleteNode()\">X</button>\n        </div>\n        <ul class=\"tree-view\">\n            <tree-view *ngFor=\"let v of node.child\"\n                [node]=\"v\" [active]=\"active\"\n                (activeChange)=\"setActive($event)\"\n                (nodeDelete)=\"handleNodeDelete($event)\">\n            </tree-view>\n        </ul>\n    </li>\n    ",
        }), 
        __metadata('design:paramtypes', [])
    ], TreeViewComponent);
    return TreeViewComponent;
}());
exports.TreeViewComponent = TreeViewComponent;
//# sourceMappingURL=tree-view.component.js.map