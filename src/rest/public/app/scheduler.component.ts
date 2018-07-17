/**
 * Created by Jason on 2016-11-25.
 */
import { Component, Input } from '@angular/core';

class ArrayQueue {
    arr: Array<number>;
    q1: number;
    q2: number;

    constructor() {
        this.arr = [];
        this.q1 = 0;
        this.q2 = 0;
    }

    push(x: number): void {
        this.arr[this.q2] = x;
        this.q2++;
    }

    front(): number {
        return this.arr[this.q1];
    }

    pop(): void {
        this.q1++;
        if (this.q1 == this.q2) {
            this.q1 = 0;
            this.q2 = 0;
        }
    }

    empty(): boolean {
        return this.q1 == this.q2;
    }
}

class MaximumFlow {

    // UBC's secret weapon, from http://tinyurl.com/ubccodearchive
    // translated from c++

    N: number;
    M: number;

    //int par[N], first[N], nxt[2*M], ep[2*M], m;
    //ll flo[2*M], cap[2*M], cost[2*M];

    INF = 1000000000;

    par: Array<number> = [];
    first: Array<number> = [];
    nxt: Array<number> = [];
    ep: Array<number> = [];
    m: number;

    flo: Array<number> = [];
    cap: Array<number> = [];
    //cost: Array<number> = [];

    //void init() { m = 0; memset(first,-1,sizeof first); memset(flo,0,sizeof flo); }

    constructor(N: number) {
        this.N = N;
        this.m = 0;
        for (let i = 0; i < this.N; i++) {
            this.first[i] = -1;
            this.par[i] = 0;
            this.L[i] = 0;
            this.cur[i] = 0;
        }
    }

    prepForFlow() {
        this.M = this.m;
        for (let i = 0; i < this.M*2; i++) {
            this.flo[i] = 0;
            /*
            this.nxt[i] = 0;
            this.ep[i] = 0;
            this.cap[i] = 0;
            this.cost[i] = 0;
            */
        }
    }

    //void add_edge(int a, int b, ll c=1, ll p=0) { //a,b - nodes, c, p - cap, price
    //    nxt[m] = first[ep[m]=a], first[ep[m]] = m, cap[m] = c, cost[m] =  p, ++m;
    //    nxt[m] = first[ep[m]=b], first[ep[m]] = m, cap[m] = 0, cost[m] = -p, ++m; }

    add_edge(a: number, b: number, c: number, p: number): void {
        this.ep[this.m] = a;
        this.nxt[this.m] = this.first[this.ep[this.m]];
        this.first[this.ep[this.m]] = this.m;
        this.cap[this.m] = c;
        //this.cost[this.m] = p;
        this.m++;

        this.ep[this.m] = b;
        this.nxt[this.m] = this.first[this.ep[this.m]];
        this.first[this.ep[this.m]] = this.m;
        this.cap[this.m] = 0;
        //this.cost[this.m] = -p;
        this.m++;
    }


    // Dinic's fast maximum flow: tested on NAIPC 2015 F but not theoretically
    // proven to be floating-point-safe.
    // USAGE: 1) init(); 2) add edges
    // 3) ll flow=0; while (bfs(S, T)) flow += dfs(S, T, INF);
    // V^2E in general, min(V^(2/3),sqrt(E))E on unit caps, sqrt(V)E on bipartite

    getFlow(S: number, T: number): number {
        let flow = 0;
        while (this.bfs(S, T)) {
            flow += this.dfs(S, T, this.INF);
        }
        return flow;
    }

    //int L[N], cur[N];
    L: Array<number> = [];
    cur: Array<number> = [];

    //bool bfs(int s, int t) {
    //    memset(L, INF, sizeof L);
    //    queue<int> q; q.push(s); L[s] = 0;
    //    while (!q.empty()) { int u = q.front(); q.pop();
    //        for (int v, e = cur[u] = first[u]; e != -1; e = nxt[e])
    //        if (L[v=ep[e^1]] == INF && flo[e] < cap[e])
    //            q.push(v), L[v] = L[u]+1;
    //    } return L[t] < INF; }

    bfs(s: number, t: number): boolean {
        for (let i = 0; i < this.N; i++) {
            this.L[i] = this.INF;
        }
        let q: ArrayQueue = new ArrayQueue();
        q.push(s);
        this.L[s] = 0;
        while (!q.empty()) {
            let u = q.front();
            q.pop();

            let v: number;
            this.cur[u] = this.first[u];
            let e = this.cur[u];
            while (e != -1) {
                v = this.ep[e^1];
                if (this.L[v] == this.INF && this.flo[e] < this.cap[e]) {
                    q.push(v);
                    this.L[v] = this.L[u]+1;
                }
                e = this.nxt[e];
            }
        }
        return this.L[t] < this.INF;
    }

    //ll dfs(int u, int t, ll f) {
    //    if (u == t) return f;
    //    ll cf, df = 0;
    //    for (int v, e = cur[u]; e != -1 && df < f; cur[u] = e = nxt[e])
    //    if (flo[e] < cap[e] && L[v=ep[e^1]] == L[u]+1) {
    //        cf = dfs(v, t, min(cap[e]-flo[e], f-df));
    //        flo[e] += cf; flo[e^1] -= cf; df += cf;
    //    } return df; }

    dfs(u: number, t: number, f: number): number {
        if (u == t) return f;
        let cf: number;
        let df = 0;

        let v: number;
        let e = this.cur[u];
        while (e != -1 && df < f) {
            v = this.ep[e^1];
            if (this.flo[e] < this.cap[e] && this.L[v] == this.L[u]+1) {
                cf = this.dfs(v, t, Math.min(this.cap[e] - this.flo[e], f - df));
                this.flo[e] += cf;
                this.flo[e^1] -= cf;
                df += cf;
            }
            e = this.nxt[e];
            this.cur[u] = e;
        }
        return df;
    }
}

@Component({
    selector: 'scheduler',
    template: `
    <h1>Course Scheduler</h1>
    <div style="float: right; width: 50%">
    <div class="results round_box">
        <h2>
            Rooms ({{rooms.length}})
            <button (click)="roomsSelectAll()">Select All</button>
            <button (click)="roomsDeselectAll()">Deselect All</button>
            <button (click)="roomsDeleteSelected()">Remove Selected</button>
        </h2>
        <div *ngIf="rooms && rooms.length > 0"
            style="max-height: 400px; overflow-y: scroll">
        <table>
        <tr>
            <th>V</th>
            <th *ngFor="let col of roomsFields">
                {{col.display}}
            </th>
        </tr>
        <tr *ngFor="let row of rooms; let i = index;" [class.active]="roomsSelected[i]">
            <td><input type="checkbox" [(ngModel)]="roomsSelected[i]"></td>
            <td *ngFor="let col of roomsFields">
                {{row[col.key]}}
            </td>
        </tr>
        </table>
        </div>
    </div>
    </div>

    <div style="margin-right: 50%">
    <div class="results round_box">
        <h2>
            Courses ({{courses.length}})
            <button (click)="coursesSelectAll()">Select All</button>
            <button (click)="coursesDeselectAll()">Deselect All</button>
            <button (click)="coursesDeleteSelected()">Remove Selected</button>
        </h2>
        <div *ngIf="courses && courses.length > 0"
            style="max-height: 400px; overflow-y: scroll">
        <table>
        <tr>
            <th>V</th>
            <th *ngFor="let col of coursesFields">
                {{col.display}}
            </th>
        </tr>
        <tr *ngFor="let row of courses; let i = index;" [class.active]="coursesSelected[i]">
            <td><input type="checkbox" [(ngModel)]="coursesSelected[i]"></td>
            <td *ngFor="let col of coursesFields">
                {{row[col.key]}}
            </td>
        </tr>
        </table>
        </div>
    </div>
    </div>

    <div style="clear: both"></div>

    <div><button (click)="scheduleClick()">Schedule these courses and rooms!</button> (WARNING: may take up to 15-20 seconds for large number of courses)</div>
    <div>
        <p>{{qualityStr}}</p>
        <p *ngIf="missedSections.length > 0">Missed sections:</p>
        <ul *ngIf="missedSections.length > 0">
            <li *ngFor="let str of missedSections">{{str}}</li>
        </ul>
    </div>

    <div style="float: right; width: 50%">
    <div class="results round_box schedule">
        <h2>Tue / Thu Schedule</h2>
        <table>
        <tr><th>Time</th><th>Classes</th></tr>
        <tr *ngFor="let row of tthSchedule; let i = index;">
            <td>{{tthLabel[i]}} ~ {{tthLabel[i+1]}}</td>
            <td><div class="tdbox"><div *ngFor="let obj of row" [class.active]="coursesSelected[obj.c] || roomsSelected[obj.r]">{{obj.str}}</div></div></td>
        </tr>
        </table>
    </div>
    </div>

    <div style="margin-right: 50%">
    <div class="results round_box schedule">
        <h2>Mon / Wed / Fri Schedule</h2>
        <table>
        <tr><th>Time</th><th>Classes</th></tr>
        <tr *ngFor="let row of mwfSchedule; let i = index;">
            <td>{{mwfLabel[i]}} ~ {{mwfLabel[i+1]}}</td>
            <td><div class="tdbox"><div *ngFor="let obj of row" [class.active]="coursesSelected[obj.c] || roomsSelected[obj.r]">{{obj.str}}</div></div></td>
        </tr>
        </table>
    </div>
    </div>

    `
})

export class SchedulerComponent {

    @Input() id: string;
    @Input() courses: Array<any>;
    @Input() rooms: Array<any>;

    coursesFields: Array<any> = [
        {key: 'dept', display: 'Department'},
        {key: 'id', display: 'Number'},
        {key: 'title', display: 'Title'},
        {key: 'sectionSize', display: 'Max Section Size'},
        {key: 'numSections', display: 'Number of Sections'}
    ];

    roomsFields: Array<any> = [
        {key: 'building', display: 'Building'},
        {key: 'room', display: 'Room Number'},
        {key: 'seats', display: 'Capacity'},
        {key: 'type', display: 'Type'},
        {key: 'furniture', display: 'Furniture'},
    ];

    coursesSelected: Array<boolean> = [];
    roomsSelected: Array<boolean> = [];

    mwfSchedule: Array<Array<any>> = [];
    tthSchedule: Array<Array<any>> = [];

    mwfLabel: Array<string> = [ '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00' ];
    tthLabel: Array<string> = [ '08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00' ]

    qualityStr: string = "";
    missedSections: Array<string> = [];

    shuffleArray(arr: Array<any>): void {
        let n = arr.length;
        for (let t = 0; t < n; t++) {
            let t2 = t + Math.floor(Math.random() * (n-t));
            let tmp = arr[t];
            arr[t] = arr[t2];
            arr[t2] = tmp;
        }
    }

    scheduleClick() {
        let NC = this.courses.length;
        let NR = this.rooms.length;
        let NT = 15;

        let NV = NT*(NC+NR) + NC + 2;
        let NE = NT*NC*NR + NT*(NC+NR) + NC;

        // Run maximum flow to optain optimal schedule
        let startTime = window.performance.now();
        let f = new MaximumFlow(NV);

        let S = 0;
        let T = 1;
        let B1 = 2;
        let B2 = B1 + NC;
        let NCR = NC+NR;

        // used shuffled time slot order when adding edges to make schedule more even
        let tArr: Array<number> = [];
        for (let t = 0; t < NT; t++) {
            tArr.push(t);
        }
        // src => each course, cap = # sections
        for (let i = 0; i < NC; i++) {
            f.add_edge(S, B1+i, this.courses[i].numSections, 0);
        }
        // each course => time slots, cap = 1
        for (let i = 0; i < NC; i++) {
            this.shuffleArray(tArr);
            for (let t of tArr) {
                f.add_edge(B1+i, B2+t*NCR+i, 1, 0);
            }
        }
        // for every (course, room) pair in each time slot
        // if course size <= room size then add
        //     course => room, cap = 1
        for (let i = 0; i < NC; i++) {
            for (let j = 0; j < NR; j++) {
                if (this.courses[i].sectionSize <= this.rooms[j].seats) {
                    this.shuffleArray(tArr);
                    for (let t of tArr) {
                        f.add_edge(B2+t*NCR+i, B2+t*NCR+NC+j, 1, 0);
                    }
                }
            }
        }
        // for each time slot, room => sink
        for (let j = 0; j < NR; j++) {
            this.shuffleArray(tArr);
            for (let t of tArr) {
                f.add_edge(B2+t*NCR+NC+j, T, 1, 0);
            }
        }
        f.prepForFlow();
        // run super fast Dinic's Algorithm for maximum flow
        let flow = f.getFlow(S, T);
        let elapsedTime = window.performance.now() - startTime;

        // collect results and missing sections
        let schedule: Array<Array<any>> = [];
        for (let t = 0; t < NT; t++) {
            schedule[t] = [];
        }

        let numSections = 0;
        let missedCount: Array<number> = [];
        for (let i = 0; i < NC; i++) {
            numSections += this.courses[i].numSections;
            missedCount[i] = this.courses[i].numSections;
        }
        let missedTotal = numSections;

        for (let e = 0; e < f.m; e += 2) {
            if (f.flo[e] != 0) {
                let a = f.ep[e];
                let b = f.ep[e^1];
                if (B2 <= a && b != T) {
                    let cc = (a - B2)%NCR;
                    let rr = ((b - B2)%NCR) - NC;
                    let tt = (a - cc - B2)/NCR;
                    schedule[tt].push({c: cc, r: rr});
                    missedCount[cc]--;
                    missedTotal--;
                }
            }
        }
        let gotTotal = numSections - missedTotal;

        // display the result by updating bindings
        let sectionID: Array<number> = [];
        for (let i = 0; i < NC; i++) {
            sectionID[i] = 100;
        }
        for (let t = 0; t < NT; t++) {
            if (t < 9) {
                this.mwfSchedule[t] = [];
            } else {
                this.tthSchedule[t-9] = [];
            }
            for (let x of schedule[t]) {
                let cobj: any = this.courses[x.c];
                let robj: any = this.rooms[x.r];

                let cstr: string = cobj.dept.toUpperCase() + cobj.id;
                while (cstr.length < 7) cstr += ' ';
                cstr += ' ' + sectionID[x.c];

                let rstr: string = robj.building + robj.room;
                while (rstr.length < 8) rstr += ' ';

                let str = cstr + ' at ' + rstr + ' (' + cobj.sectionSize + '/' + robj.seats + ' seats used)';
                let obj = {c: x.c, r: x.r, str: str};

                sectionID[x.c]++;

                if (t < 9) {
                    this.mwfSchedule[t].push(obj);
                } else {
                    this.tthSchedule[t-9].push(obj);
                }
            }
        }
        this.qualityStr = 'Scheduled ' + gotTotal + '/' + numSections + ' sections. ' +
            'Missed ' + missedTotal + '/' + numSections + ' sections. ' +
            'Quality = ' + (missedTotal / numSections).toFixed(4) + '. ' +
            'Took: ' + elapsedTime.toFixed(3) + ' ms. Flow graph: ' + NV + ' nodes and ' + (f.m/2) + ' edges.';

        this.missedSections = [];
        for (let i = 0; i < NC; i++) {
            let cobj: any = this.courses[i];
            if (missedCount[i] > 0) {
                let str = cobj.dept.toUpperCase() + cobj.id + ': missed ' + missedCount[i] + '/' + cobj.numSections + ' sections of size ' + cobj.sectionSize;
                this.missedSections.push(str);
            }
        }
    }

    coursesSelectAll() {
        this.coursesSelected = [];
        for (let i = 0; i < this.courses.length; i++) {
            this.coursesSelected[i] = true;
        }
    }

    coursesDeselectAll() {
        this.coursesSelected = [];
    }

    coursesDeleteSelected() {
        let n = this.courses.length;
        for (let i = 0; i < n; i++) {
            if (this.coursesSelected[i]) {
                this.coursesSelected.splice(i, 1);
                this.courses.splice(i, 1);
                i--;
                n--;
            }
        }
    }

    roomsSelectAll() {
        this.roomsSelected = [];
        for (let i = 0; i < this.rooms.length; i++) {
            this.roomsSelected[i] = true;
        }
    }

    roomsDeselectAll() {
        this.roomsSelected = [];
    }

    roomsDeleteSelected() {
        let n = this.rooms.length;
        for (let i = 0; i < n; i++) {
            if (this.roomsSelected[i]) {
                this.roomsSelected.splice(i, 1);
                this.rooms.splice(i, 1);
                i--;
                n--;
            }
        }
    }
}
