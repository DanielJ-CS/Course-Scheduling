import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { CourseComponent } from './courses.component';
import { RoomComponent } from './rooms.component';
import { SchedulerComponent } from './scheduler.component';

@Component({
    selector: 'my-app',
    template: `
    <nav>
        <table class="nav-title"><tr>
        <td><img src="logo.png"></td>
        <td>{{title}}</td>
        </tr></table>
        <ul>
            <li><a (click)="currPage = 'my-dashboard'" [class.active]="currPage == 'my-dashboard'">Dashboard</a></li>
            <li><a (click)="currPage = 'courses'"      [class.active]="currPage == 'courses'"     >Course Explorer</a></li>
            <li><a (click)="currPage = 'rooms'"        [class.active]="currPage == 'rooms'"       >Room Explorer</a></li>
            <li><a (click)="currPage = 'scheduler'"    [class.active]="currPage == 'scheduler'"   >Course Scheduler</a></li>
        </ul>
    </nav>
    <div id="content">
        <div [style.display]="currPage == 'my-dashboard' ? 'block' : 'none'"><my-dashboard></my-dashboard></div>
        <div [style.display]="currPage == 'courses'      ? 'block' : 'none'"><courses id="course-explorer" (addCourses)="addCourses($event)"></courses></div>
        <div [style.display]="currPage == 'rooms'        ? 'block' : 'none'"><rooms id="room-explorer" (addRooms)="addRooms($event)"></rooms></div>
        <div [style.display]="currPage == 'scheduler'    ? 'block' : 'none'"><scheduler id="course-scheduler" [courses]="currCourses" [rooms]="currRooms"></scheduler></div>
    </div>
    `
})

export class AppComponent {

    constructor() {}

    title = 'UBC Scheduler';
    currPage = 'my-dashboard';

    currCourses: Array<any> = [];
    currRooms: Array<any> = [];

    addCourses(arr: Array<any>) {
        let seen: any = {};
        for (let y of this.currCourses) {
            seen[y.dept+y.id] = true;
        }

        let numInserted = 0;
        for (let x of arr) {
            if (!seen[x.dept+x.id]) {
                seen[x.dept+x.id] = true;
                this.currCourses.push(x);
                numInserted++;
            }
        }
        alert('Added ' + numInserted + ' new courses out of ' + arr.length + ' unique courses selected');
    }

    addRooms(arr: Array<any>) {
        let seen: any = {};
        for (let y of this.currRooms) {
            seen[y.building+y.room] = true;
        }

        let numInserted = 0;
        for (let x of arr) {
            if (!seen[x.building+x.room]) {
                seen[x.building+x.room] = true;
                this.currRooms.push(x);
                numInserted++;
            }
        }
        alert('Added ' + numInserted + ' new rooms out of ' + arr.length + ' unique rooms selected');
    }
}
