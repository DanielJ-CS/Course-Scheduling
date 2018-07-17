/**
 * Created by Jason on 2016-11-25.
 */
import {Component, ViewChild, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'input-suggest',
    template: `
    <div class="input-suggest">
        <label>{{txtLabel}}</label>
        <span class="input-suggest-wrap-txt">
        <input #inputEl [(ngModel)]="inputVal" class="simple_input_text" (keydown)="preventTab($event)" (keypress)="preventTab($event)" (keyup)="handleKeyUp($event)">
        <button *ngIf="addBtnLabel && addBtnLabel.length > 0" (click)="addBtnClick()">{{addBtnLabel}}</button>
        <button *ngIf="cancelBtnLabel && cancelBtnLabel.length > 0" (click)="cancelBtnClick()">{{cancelBtnLabel}}</button>
        <ul class="input-suggest-dropdown" *ngIf="filteredSuggestions.length > 0">
        <li *ngFor="let str of filteredSuggestions">
            <a (click)="suggestionClick(str)">{{str}}</a>
        </li>
        </ul>
        </span>
    </div>
    `
})

export class InputSuggestComponent  {

    constructor(){}

    @ViewChild('inputEl') inputEl: any;

    @Input() eager: boolean;
    @Input() matchMode: string;
    @Input() suggestions: Array<string>;

    @Input() txtLabel: string;
    @Input() addBtnLabel: string;
    @Input() cancelBtnLabel: string;

    @Output() select: EventEmitter<string> = new EventEmitter<string>();
    @Output() cancel: EventEmitter<string> = new EventEmitter<string>();

    filteredSuggestions: Array<string> = [];
    inputVal: string = '';

    ngOnInit() {
        this.inputEl.nativeElement.focus();
    }

    preventTab(event: any) {
        if (event.code == 'Tab') return false;
        return true;
    }

    handleKeyUp(event: any) {
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
    }

    addBtnClick() {
        if (this.eager && this.filteredSuggestions.length > 0) {
            this.setInputVal(this.filteredSuggestions[0]);
        }
        this.sendSelectEvent();
    }

    cancelBtnClick() {
        this.sendCancelEvent();
    }

    suggestionClick(str: string) {
        this.setInputVal(str);
        if (this.eager) {
            this.sendSelectEvent();
        } else {
            this.inputEl.nativeElement.focus();
        }
    }

    isMatch(str: string, sugg: string) {
        let z = str.length;
        if (this.matchMode == 'prefix') {
            return z > 0 && sugg.length >= z && str == sugg.substring(0, z);
        } else if (this.matchMode == 'substr') {
            return z > 0 && sugg.indexOf(str) >= 0;
        }
        return false;
    }

    setInputVal(str: string) {
        this.inputVal = str;
        this.filteredSuggestions = [];
        for (let i = 0; i < this.suggestions.length; i++) {
            if (this.isMatch(this.inputVal, this.suggestions[i])) {
                this.filteredSuggestions.push(this.suggestions[i]);
            }
        }
    }

    sendSelectEvent() {
        if (this.inputVal.length == 0) return;
        this.select.emit(this.inputVal);
        this.setInputVal('');
        this.inputEl.nativeElement.focus();
    }

    sendCancelEvent() {
        this.cancel.emit(this.inputVal);
        this.setInputVal('');
    }
}
