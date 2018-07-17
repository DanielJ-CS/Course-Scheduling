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
var AppComponent = (function () {
    function AppComponent() {
        this.title = 'UBC Scheduler';
        this.currPage = 'my-dashboard';
        this.currCourses = [];
        this.currRooms = [];
    }
    AppComponent.prototype.addCourses = function (arr) {
        var seen = {};
        for (var _i = 0, _a = this.currCourses; _i < _a.length; _i++) {
            var y = _a[_i];
            seen[y.dept + y.id] = true;
        }
        var numInserted = 0;
        for (var _b = 0, arr_1 = arr; _b < arr_1.length; _b++) {
            var x = arr_1[_b];
            if (!seen[x.dept + x.id]) {
                seen[x.dept + x.id] = true;
                this.currCourses.push(x);
                numInserted++;
            }
        }
        alert('Added ' + numInserted + ' new courses out of ' + arr.length + ' unique courses selected');
    };
    AppComponent.prototype.addRooms = function (arr) {
        var seen = {};
        for (var _i = 0, _a = this.currRooms; _i < _a.length; _i++) {
            var y = _a[_i];
            seen[y.building + y.room] = true;
        }
        var numInserted = 0;
        for (var _b = 0, arr_2 = arr; _b < arr_2.length; _b++) {
            var x = arr_2[_b];
            if (!seen[x.building + x.room]) {
                seen[x.building + x.room] = true;
                this.currRooms.push(x);
                numInserted++;
            }
        }
        alert('Added ' + numInserted + ' new rooms out of ' + arr.length + ' unique rooms selected');
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "\n    <nav>\n        <table class=\"nav-title\"><tr>\n        <td><img src=\"logo.png\"></td>\n        <td>{{title}}</td>\n        </tr></table>\n        <ul>\n            <li><a (click)=\"currPage = 'my-dashboard'\" [class.active]=\"currPage == 'my-dashboard'\">Dashboard</a></li>\n            <li><a (click)=\"currPage = 'courses'\"      [class.active]=\"currPage == 'courses'\"     >Course Explorer</a></li>\n            <li><a (click)=\"currPage = 'rooms'\"        [class.active]=\"currPage == 'rooms'\"       >Room Explorer</a></li>\n            <li><a (click)=\"currPage = 'scheduler'\"    [class.active]=\"currPage == 'scheduler'\"   >Course Scheduler</a></li>\n        </ul>\n    </nav>\n    <div id=\"content\">\n        <div [style.display]=\"currPage == 'my-dashboard' ? 'block' : 'none'\"><my-dashboard></my-dashboard></div>\n        <div [style.display]=\"currPage == 'courses'      ? 'block' : 'none'\"><courses id=\"course-explorer\" (addCourses)=\"addCourses($event)\"></courses></div>\n        <div [style.display]=\"currPage == 'rooms'        ? 'block' : 'none'\"><rooms id=\"room-explorer\" (addRooms)=\"addRooms($event)\"></rooms></div>\n        <div [style.display]=\"currPage == 'scheduler'    ? 'block' : 'none'\"><scheduler id=\"course-scheduler\" [courses]=\"currCourses\" [rooms]=\"currRooms\"></scheduler></div>\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map