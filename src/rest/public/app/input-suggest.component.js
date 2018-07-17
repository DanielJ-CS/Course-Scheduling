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
var InputSuggestComponent = (function () {
    function InputSuggestComponent() {
        this.select = new core_1.EventEmitter();
        this.cancel = new core_1.EventEmitter();
        this.filteredSuggestions = [];
        this.inputVal = '';
    }
    InputSuggestComponent.prototype.ngOnInit = function () {
        this.inputEl.nativeElement.focus();
    };
    InputSuggestComponent.prototype.preventTab = function (event) {
        if (event.code == 'Tab')
            return false;
        return true;
    };
    InputSuggestComponent.prototype.handleKeyUp = function (event) {
        if (event.code == 'Tab' && this.filteredSuggestions.length > 0) {
            this.setInputVal(this.filteredSuggestions[0]);
            return false;
        }
        this.setInputVal(this.inputVal);
        if (event.code == 'Enter') {
            if (this.eager && this.filteredSuggestions.length > 0) {
                this.setInputVal(this.filteredSuggestions[0]);
            }
            this.sendSelectEvent();
        }
    };
    InputSuggestComponent.prototype.addBtnClick = function () {
        if (this.eager && this.filteredSuggestions.length > 0) {
            this.setInputVal(this.filteredSuggestions[0]);
        }
        this.sendSelectEvent();
    };
    InputSuggestComponent.prototype.cancelBtnClick = function () {
        this.sendCancelEvent();
    };
    InputSuggestComponent.prototype.suggestionClick = function (str) {
        this.setInputVal(str);
        if (this.eager) {
            this.sendSelectEvent();
        }
        else {
            this.inputEl.nativeElement.focus();
        }
    };
    InputSuggestComponent.prototype.isMatch = function (str, sugg) {
        var z = str.length;
        if (this.matchMode == 'prefix') {
            return z > 0 && sugg.length >= z && str == sugg.substring(0, z);
        }
        else if (this.matchMode == 'substr') {
            return z > 0 && sugg.indexOf(str) >= 0;
        }
        return false;
    };
    InputSuggestComponent.prototype.setInputVal = function (str) {
        this.inputVal = str;
        this.filteredSuggestions = [];
        for (var i = 0; i < this.suggestions.length; i++) {
            if (this.isMatch(this.inputVal, this.suggestions[i])) {
                this.filteredSuggestions.push(this.suggestions[i]);
            }
        }
    };
    InputSuggestComponent.prototype.sendSelectEvent = function () {
        if (this.inputVal.length == 0)
            return;
        this.select.emit(this.inputVal);
        this.setInputVal('');
        this.inputEl.nativeElement.focus();
    };
    InputSuggestComponent.prototype.sendCancelEvent = function () {
        this.cancel.emit(this.inputVal);
        this.setInputVal('');
    };
    __decorate([
        core_1.ViewChild('inputEl'), 
        __metadata('design:type', Object)
    ], InputSuggestComponent.prototype, "inputEl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], InputSuggestComponent.prototype, "eager", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputSuggestComponent.prototype, "matchMode", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], InputSuggestComponent.prototype, "suggestions", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputSuggestComponent.prototype, "txtLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputSuggestComponent.prototype, "addBtnLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputSuggestComponent.prototype, "cancelBtnLabel", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], InputSuggestComponent.prototype, "select", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], InputSuggestComponent.prototype, "cancel", void 0);
    InputSuggestComponent = __decorate([
        core_1.Component({
            selector: 'input-suggest',
            template: "\n    <div class=\"input-suggest\">\n        <label>{{txtLabel}}</label>\n        <span class=\"input-suggest-wrap-txt\">\n        <input #inputEl [(ngModel)]=\"inputVal\" class=\"simple_input_text\" (keydown)=\"preventTab($event)\" (keypress)=\"preventTab($event)\" (keyup)=\"handleKeyUp($event)\">\n        <button *ngIf=\"addBtnLabel && addBtnLabel.length > 0\" (click)=\"addBtnClick()\">{{addBtnLabel}}</button>\n        <button *ngIf=\"cancelBtnLabel && cancelBtnLabel.length > 0\" (click)=\"cancelBtnClick()\">{{cancelBtnLabel}}</button>\n        <ul class=\"input-suggest-dropdown\" *ngIf=\"filteredSuggestions.length > 0\">\n        <li *ngFor=\"let str of filteredSuggestions\">\n            <a (click)=\"suggestionClick(str)\">{{str}}</a>\n        </li>\n        </ul>\n        </span>\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], InputSuggestComponent);
    return InputSuggestComponent;
}());
exports.InputSuggestComponent = InputSuggestComponent;
//# sourceMappingURL=input-suggest.component.js.map