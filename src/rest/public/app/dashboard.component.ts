/**
 * Created by Daniel on 2016-11-17.
 */
import { Component } from '@angular/core';

@Component({
    selector: 'my-dashboard',
    template: `
    <h1>Dashboard</h1>
    <p>Welcome to UBC Scheduler!</p>
    <p>You can search for courses in Course Explorer and search for rooms in Room Explorer</p>
    <p>After adding courses from Course Explorer and rooms from Room Explorer, you can schedule the courses into the rooms in the Course Scheduler.</p>
    <p>Some tips and advanced features:</p>
    <ul>
        <li><b>The UI cannot handle drawing large results</b> (say > 4000 rows), so try not to e.g. query all sections with no filter or aggregation</li>
        <li>To add a child filter to an AND/OR/NOT, you should make sure it is selected before adding. By default, adding an AND/OR/NOT will create a node that is parent to the currently selected node, and the focus is always on the last node added in the tree. The filter supports arbitrary depth tree within reason.</li>
        <li>When adding courses to scheduler, it will not add the same course multiple times, nor will it add any course with only sections in year 1900. Similarly, it will not add the same rooms multiple times.</li>
        <li>Selecting a course and/or a room in the scheduler page will highlight it in the timetable below (does NOT work if you have deleted items after you click schedule)</li>
        <li>One can add custom columns defined by a mathematical expression or some functions. Make sure you put a space before and after all arithmetic operators. This is also how some features like "distance to building" is implemented. Once you add a column you can use it anywhere in your query.</li>
        <li>Example: you can add expression "roundN(courses_pass / (courses_pass + courses_fail) * 100, 3)" as "passRate"</li>
        <li>For the adventurous, it is possible to type JSON in the Raw Query box, and the UI will adjust to what you have typed (as much as possible) in real time, while reporting JSON syntax errors. This feature is supported on a "best effort" basis and may have bugs.</li>
    </ul>
    <p>The scheduling algorithm is based on transforming it into an instance of the <a href="https://en.wikipedia.org/wiki/Maximum_flow_problem">Maximum Flow problem</a> and then applying <a href="https://en.wikipedia.org/wiki/Dinic's_algorithm">Dinic's Algorithm</a>. It is guaranteed to be optimal in the quality measure; in other words, the algorithm will maximize the number of scheduled sections. I have also tried to make the scheduled sections more evenly distributed by randomizing the order in which edges are explored.</p>
    `
})
export class DashboardComponent { }

