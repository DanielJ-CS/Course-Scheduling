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
var ArrayQueue = (function () {
    function ArrayQueue() {
        this.arr = [];
        this.q1 = 0;
        this.q2 = 0;
    }
    ArrayQueue.prototype.push = function (x) {
        this.arr[this.q2] = x;
        this.q2++;
    };
    ArrayQueue.prototype.front = function () {
        return this.arr[this.q1];
    };
    ArrayQueue.prototype.pop = function () {
        this.q1++;
        if (this.q1 == this.q2) {
            this.q1 = 0;
            this.q2 = 0;
        }
    };
    ArrayQueue.prototype.empty = function () {
        return this.q1 == this.q2;
    };
    return ArrayQueue;
}());
var MaximumFlow = (function () {
    function MaximumFlow(N) {
        this.INF = 1000000000;
        this.par = [];
        this.first = [];
        this.nxt = [];
        this.ep = [];
        this.flo = [];
        this.cap = [];
        this.L = [];
        this.cur = [];
        this.N = N;
        this.m = 0;
        for (var i = 0; i < this.N; i++) {
            this.first[i] = -1;
            this.par[i] = 0;
            this.L[i] = 0;
            this.cur[i] = 0;
        }
    }
    MaximumFlow.prototype.prepForFlow = function () {
        this.M = this.m;
        for (var i = 0; i < this.M * 2; i++) {
            this.flo[i] = 0;
        }
    };
    MaximumFlow.prototype.add_edge = function (a, b, c, p) {
        this.ep[this.m] = a;
        this.nxt[this.m] = this.first[this.ep[this.m]];
        this.first[this.ep[this.m]] = this.m;
        this.cap[this.m] = c;
        this.m++;
        this.ep[this.m] = b;
        this.nxt[this.m] = this.first[this.ep[this.m]];
        this.first[this.ep[this.m]] = this.m;
        this.cap[this.m] = 0;
        this.m++;
    };
    MaximumFlow.prototype.getFlow = function (S, T) {
        var flow = 0;
        while (this.bfs(S, T)) {
            flow += this.dfs(S, T, this.INF);
        }
        return flow;
    };
    MaximumFlow.prototype.bfs = function (s, t) {
        for (var i = 0; i < this.N; i++) {
            this.L[i] = this.INF;
        }
        var q = new ArrayQueue();
        q.push(s);
        this.L[s] = 0;
        while (!q.empty()) {
            var u = q.front();
            q.pop();
            var v = void 0;
            this.cur[u] = this.first[u];
            var e = this.cur[u];
            while (e != -1) {
                v = this.ep[e ^ 1];
                if (this.L[v] == this.INF && this.flo[e] < this.cap[e]) {
                    q.push(v);
                    this.L[v] = this.L[u] + 1;
                }
                e = this.nxt[e];
            }
        }
        return this.L[t] < this.INF;
    };
    MaximumFlow.prototype.dfs = function (u, t, f) {
        if (u == t)
            return f;
        var cf;
        var df = 0;
        var v;
        var e = this.cur[u];
        while (e != -1 && df < f) {
            v = this.ep[e ^ 1];
            if (this.flo[e] < this.cap[e] && this.L[v] == this.L[u] + 1) {
                cf = this.dfs(v, t, Math.min(this.cap[e] - this.flo[e], f - df));
                this.flo[e] += cf;
                this.flo[e ^ 1] -= cf;
                df += cf;
            }
            e = this.nxt[e];
            this.cur[u] = e;
        }
        return df;
    };
    return MaximumFlow;
}());
var SchedulerComponent = (function () {
    function SchedulerComponent() {
        this.coursesFields = [
            { key: 'dept', display: 'Department' },
            { key: 'id', display: 'Number' },
            { key: 'title', display: 'Title' },
            { key: 'sectionSize', display: 'Max Section Size' },
            { key: 'numSections', display: 'Number of Sections' }
        ];
        this.roomsFields = [
            { key: 'building', display: 'Building' },
            { key: 'room', display: 'Room Number' },
            { key: 'seats', display: 'Capacity' },
            { key: 'type', display: 'Type' },
            { key: 'furniture', display: 'Furniture' },
        ];
        this.coursesSelected = [];
        this.roomsSelected = [];
        this.mwfSchedule = [];
        this.tthSchedule = [];
        this.mwfLabel = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
        this.tthLabel = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00'];
        this.qualityStr = "";
        this.missedSections = [];
    }
    SchedulerComponent.prototype.shuffleArray = function (arr) {
        var n = arr.length;
        for (var t = 0; t < n; t++) {
            var t2 = t + Math.floor(Math.random() * (n - t));
            var tmp = arr[t];
            arr[t] = arr[t2];
            arr[t2] = tmp;
        }
    };
    SchedulerComponent.prototype.scheduleClick = function () {
        var NC = this.courses.length;
        var NR = this.rooms.length;
        var NT = 15;
        var NV = NT * (NC + NR) + NC + 2;
        var NE = NT * NC * NR + NT * (NC + NR) + NC;
        var startTime = window.performance.now();
        var f = new MaximumFlow(NV);
        var S = 0;
        var T = 1;
        var B1 = 2;
        var B2 = B1 + NC;
        var NCR = NC + NR;
        var tArr = [];
        for (var t = 0; t < NT; t++) {
            tArr.push(t);
        }
        for (var i = 0; i < NC; i++) {
            f.add_edge(S, B1 + i, this.courses[i].numSections, 0);
        }
        for (var i = 0; i < NC; i++) {
            this.shuffleArray(tArr);
            for (var _i = 0, tArr_1 = tArr; _i < tArr_1.length; _i++) {
                var t = tArr_1[_i];
                f.add_edge(B1 + i, B2 + t * NCR + i, 1, 0);
            }
        }
        for (var i = 0; i < NC; i++) {
            for (var j = 0; j < NR; j++) {
                if (this.courses[i].sectionSize <= this.rooms[j].seats) {
                    this.shuffleArray(tArr);
                    for (var _a = 0, tArr_2 = tArr; _a < tArr_2.length; _a++) {
                        var t = tArr_2[_a];
                        f.add_edge(B2 + t * NCR + i, B2 + t * NCR + NC + j, 1, 0);
                    }
                }
            }
        }
        for (var j = 0; j < NR; j++) {
            this.shuffleArray(tArr);
            for (var _b = 0, tArr_3 = tArr; _b < tArr_3.length; _b++) {
                var t = tArr_3[_b];
                f.add_edge(B2 + t * NCR + NC + j, T, 1, 0);
            }
        }
        f.prepForFlow();
        var flow = f.getFlow(S, T);
        var elapsedTime = window.performance.now() - startTime;
        var schedule = [];
        for (var t = 0; t < NT; t++) {
            schedule[t] = [];
        }
        var numSections = 0;
        var missedCount = [];
        for (var i = 0; i < NC; i++) {
            numSections += this.courses[i].numSections;
            missedCount[i] = this.courses[i].numSections;
        }
        var missedTotal = numSections;
        for (var e = 0; e < f.m; e += 2) {
            if (f.flo[e] != 0) {
                var a = f.ep[e];
                var b = f.ep[e ^ 1];
                if (B2 <= a && b != T) {
                    var cc = (a - B2) % NCR;
                    var rr = ((b - B2) % NCR) - NC;
                    var tt = (a - cc - B2) / NCR;
                    schedule[tt].push({ c: cc, r: rr });
                    missedCount[cc]--;
                    missedTotal--;
                }
            }
        }
        var gotTotal = numSections - missedTotal;
        var sectionID = [];
        for (var i = 0; i < NC; i++) {
            sectionID[i] = 100;
        }
        for (var t = 0; t < NT; t++) {
            if (t < 9) {
                this.mwfSchedule[t] = [];
            }
            else {
                this.tthSchedule[t - 9] = [];
            }
            for (var _c = 0, _d = schedule[t]; _c < _d.length; _c++) {
                var x = _d[_c];
                var cobj = this.courses[x.c];
                var robj = this.rooms[x.r];
                var cstr = cobj.dept.toUpperCase() + cobj.id;
                while (cstr.length < 7)
                    cstr += ' ';
                cstr += ' ' + sectionID[x.c];
                var rstr = robj.building + robj.room;
                while (rstr.length < 8)
                    rstr += ' ';
                var str = cstr + ' at ' + rstr + ' (' + cobj.sectionSize + '/' + robj.seats + ' seats used)';
                var obj = { c: x.c, r: x.r, str: str };
                sectionID[x.c]++;
                if (t < 9) {
                    this.mwfSchedule[t].push(obj);
                }
                else {
                    this.tthSchedule[t - 9].push(obj);
                }
            }
        }
        this.qualityStr = 'Scheduled ' + gotTotal + '/' + numSections + ' sections. ' +
            'Missed ' + missedTotal + '/' + numSections + ' sections. ' +
            'Quality = ' + (missedTotal / numSections).toFixed(4) + '. ' +
            'Took: ' + elapsedTime.toFixed(3) + ' ms. Flow graph: ' + NV + ' nodes and ' + (f.m / 2) + ' edges.';
        this.missedSections = [];
        for (var i = 0; i < NC; i++) {
            var cobj = this.courses[i];
            if (missedCount[i] > 0) {
                var str = cobj.dept.toUpperCase() + cobj.id + ': missed ' + missedCount[i] + '/' + cobj.numSections + ' sections of size ' + cobj.sectionSize;
                this.missedSections.push(str);
            }
        }
    };
    SchedulerComponent.prototype.coursesSelectAll = function () {
        this.coursesSelected = [];
        for (var i = 0; i < this.courses.length; i++) {
            this.coursesSelected[i] = true;
        }
    };
    SchedulerComponent.prototype.coursesDeselectAll = function () {
        this.coursesSelected = [];
    };
    SchedulerComponent.prototype.coursesDeleteSelected = function () {
        var n = this.courses.length;
        for (var i = 0; i < n; i++) {
            if (this.coursesSelected[i]) {
                this.coursesSelected.splice(i, 1);
                this.courses.splice(i, 1);
                i--;
                n--;
            }
        }
    };
    SchedulerComponent.prototype.roomsSelectAll = function () {
        this.roomsSelected = [];
        for (var i = 0; i < this.rooms.length; i++) {
            this.roomsSelected[i] = true;
        }
    };
    SchedulerComponent.prototype.roomsDeselectAll = function () {
        this.roomsSelected = [];
    };
    SchedulerComponent.prototype.roomsDeleteSelected = function () {
        var n = this.rooms.length;
        for (var i = 0; i < n; i++) {
            if (this.roomsSelected[i]) {
                this.roomsSelected.splice(i, 1);
                this.rooms.splice(i, 1);
                i--;
                n--;
            }
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SchedulerComponent.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SchedulerComponent.prototype, "courses", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SchedulerComponent.prototype, "rooms", void 0);
    SchedulerComponent = __decorate([
        core_1.Component({
            selector: 'scheduler',
            template: "\n    <h1>Course Scheduler</h1>\n    <div style=\"float: right; width: 50%\">\n    <div class=\"results round_box\">\n        <h2>\n            Rooms ({{rooms.length}})\n            <button (click)=\"roomsSelectAll()\">Select All</button>\n            <button (click)=\"roomsDeselectAll()\">Deselect All</button>\n            <button (click)=\"roomsDeleteSelected()\">Remove Selected</button>\n        </h2>\n        <div *ngIf=\"rooms && rooms.length > 0\"\n            style=\"max-height: 400px; overflow-y: scroll\">\n        <table>\n        <tr>\n            <th>V</th>\n            <th *ngFor=\"let col of roomsFields\">\n                {{col.display}}\n            </th>\n        </tr>\n        <tr *ngFor=\"let row of rooms; let i = index;\" [class.active]=\"roomsSelected[i]\">\n            <td><input type=\"checkbox\" [(ngModel)]=\"roomsSelected[i]\"></td>\n            <td *ngFor=\"let col of roomsFields\">\n                {{row[col.key]}}\n            </td>\n        </tr>\n        </table>\n        </div>\n    </div>\n    </div>\n\n    <div style=\"margin-right: 50%\">\n    <div class=\"results round_box\">\n        <h2>\n            Courses ({{courses.length}})\n            <button (click)=\"coursesSelectAll()\">Select All</button>\n            <button (click)=\"coursesDeselectAll()\">Deselect All</button>\n            <button (click)=\"coursesDeleteSelected()\">Remove Selected</button>\n        </h2>\n        <div *ngIf=\"courses && courses.length > 0\"\n            style=\"max-height: 400px; overflow-y: scroll\">\n        <table>\n        <tr>\n            <th>V</th>\n            <th *ngFor=\"let col of coursesFields\">\n                {{col.display}}\n            </th>\n        </tr>\n        <tr *ngFor=\"let row of courses; let i = index;\" [class.active]=\"coursesSelected[i]\">\n            <td><input type=\"checkbox\" [(ngModel)]=\"coursesSelected[i]\"></td>\n            <td *ngFor=\"let col of coursesFields\">\n                {{row[col.key]}}\n            </td>\n        </tr>\n        </table>\n        </div>\n    </div>\n    </div>\n\n    <div style=\"clear: both\"></div>\n\n    <div><button (click)=\"scheduleClick()\">Schedule these courses and rooms!</button> (WARNING: may take up to 15-20 seconds for large number of courses)</div>\n    <div>\n        <p>{{qualityStr}}</p>\n        <p *ngIf=\"missedSections.length > 0\">Missed sections:</p>\n        <ul *ngIf=\"missedSections.length > 0\">\n            <li *ngFor=\"let str of missedSections\">{{str}}</li>\n        </ul>\n    </div>\n\n    <div style=\"float: right; width: 50%\">\n    <div class=\"results round_box schedule\">\n        <h2>Tue / Thu Schedule</h2>\n        <table>\n        <tr><th>Time</th><th>Classes</th></tr>\n        <tr *ngFor=\"let row of tthSchedule; let i = index;\">\n            <td>{{tthLabel[i]}} ~ {{tthLabel[i+1]}}</td>\n            <td><div class=\"tdbox\"><div *ngFor=\"let obj of row\" [class.active]=\"coursesSelected[obj.c] || roomsSelected[obj.r]\">{{obj.str}}</div></div></td>\n        </tr>\n        </table>\n    </div>\n    </div>\n\n    <div style=\"margin-right: 50%\">\n    <div class=\"results round_box schedule\">\n        <h2>Mon / Wed / Fri Schedule</h2>\n        <table>\n        <tr><th>Time</th><th>Classes</th></tr>\n        <tr *ngFor=\"let row of mwfSchedule; let i = index;\">\n            <td>{{mwfLabel[i]}} ~ {{mwfLabel[i+1]}}</td>\n            <td><div class=\"tdbox\"><div *ngFor=\"let obj of row\" [class.active]=\"coursesSelected[obj.c] || roomsSelected[obj.r]\">{{obj.str}}</div></div></td>\n        </tr>\n        </table>\n    </div>\n    </div>\n\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], SchedulerComponent);
    return SchedulerComponent;
}());
exports.SchedulerComponent = SchedulerComponent;
//# sourceMappingURL=scheduler.component.js.map