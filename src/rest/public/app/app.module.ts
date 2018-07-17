/**
 * Created by Daniel on 2016-11-16.
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from "./dashboard.component";
import { CourseComponent } from "./courses.component";
import { RoomComponent } from "./rooms.component";
import { SchedulerComponent } from './scheduler.component';

import { ColumnSelectorComponent } from "./column-selector.component";
import { FilterCreatorComponent } from "./filter-creator.component";
import { TreeViewComponent } from "./tree-view.component";
import { AggregatorComponent } from "./aggregator.component";
import { OrderSelectorComponent } from "./order-selector.component";
import { InputSuggestComponent } from "./input-suggest.component";

import { CourseService } from "./courses.service";


@NgModule({
    imports: [ BrowserModule, FormsModule, HttpModule, JsonpModule ],
    declarations: [ AppComponent,
                    DashboardComponent, CourseComponent, RoomComponent, SchedulerComponent,
                    ColumnSelectorComponent, FilterCreatorComponent, TreeViewComponent,
                    AggregatorComponent, OrderSelectorComponent, InputSuggestComponent ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
