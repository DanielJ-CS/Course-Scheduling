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
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require("@angular/forms");
var http_1 = require('@angular/http');
var app_component_1 = require('./app.component');
var dashboard_component_1 = require("./dashboard.component");
var courses_component_1 = require("./courses.component");
var rooms_component_1 = require("./rooms.component");
var scheduler_component_1 = require('./scheduler.component');
var column_selector_component_1 = require("./column-selector.component");
var filter_creator_component_1 = require("./filter-creator.component");
var tree_view_component_1 = require("./tree-view.component");
var aggregator_component_1 = require("./aggregator.component");
var order_selector_component_1 = require("./order-selector.component");
var input_suggest_component_1 = require("./input-suggest.component");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, http_1.HttpModule, http_1.JsonpModule],
            declarations: [app_component_1.AppComponent,
                dashboard_component_1.DashboardComponent, courses_component_1.CourseComponent, rooms_component_1.RoomComponent, scheduler_component_1.SchedulerComponent,
                column_selector_component_1.ColumnSelectorComponent, filter_creator_component_1.FilterCreatorComponent, tree_view_component_1.TreeViewComponent,
                aggregator_component_1.AggregatorComponent, order_selector_component_1.OrderSelectorComponent, input_suggest_component_1.InputSuggestComponent],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map