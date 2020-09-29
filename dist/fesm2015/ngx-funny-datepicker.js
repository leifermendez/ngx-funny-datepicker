import { ɵɵdefineInjectable, Injectable, EventEmitter, Component, Output, Input, forwardRef, ViewChild, Directive, ElementRef, HostListener, NgModule } from '@angular/core';
import * as moment$1 from 'moment';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

class NgxFunnyDatepickerService {
    constructor() { }
}
NgxFunnyDatepickerService.ɵprov = ɵɵdefineInjectable({ factory: function NgxFunnyDatepickerService_Factory() { return new NgxFunnyDatepickerService(); }, token: NgxFunnyDatepickerService, providedIn: "root" });
NgxFunnyDatepickerService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
NgxFunnyDatepickerService.ctorParameters = () => [];

class NgxFunnyDatepickerComponent {
    constructor() {
        this.valueDate = new EventEmitter();
        this.startDate = moment$1();
        this.locale = 'en';
        this.rangeLabel = 'Range';
        this.timeLabel = 'Time';
        this.clearLabel = 'Clear';
        this.emitValue = (data) => this.valueDate.emit(data);
    }
    ngOnInit() {
    }
}
NgxFunnyDatepickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-funny-datepicker-dummy',
                template: `
    Please use ngx-funny-datepicker
  `
            },] }
];
NgxFunnyDatepickerComponent.ctorParameters = () => [];
NgxFunnyDatepickerComponent.propDecorators = {
    valueDate: [{ type: Output }],
    isRange: [{ type: Input }],
    hasTime: [{ type: Input }],
    startDate: [{ type: Input }],
    endDate: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    locale: [{ type: Input }],
    rangeLabel: [{ type: Input }],
    timeLabel: [{ type: Input }],
    clearLabel: [{ type: Input }],
    classInput: [{ type: Input }]
};

const moment = moment$1;
class DatepickerComponent {
    constructor() {
        this.value = '';
        this.locale = 'en';
        this.rangeLabel = 'Range';
        this.timeLabel = 'Time';
        this.clearLabel = 'Clear';
        this.emitSelected = new EventEmitter();
        this.weekDaysHeaderArr = [];
        this.gridArr = {};
        this.canAccessPrevious = true;
        this.canAccessNext = true;
        this.todayDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        this.mode = 'end';
        this.isInvalid = false;
        this.formatInputDate = 'D MMM, YYYY';
        this.onChange = (_) => { };
        this.onTouch = () => {
            this.onTouched = true;
        };
        this.concatValueInput = () => {
            const concatValue = [
                this.startDate.format(this.formatInputDate),
                (this.endDate) ? '  -  ' : '',
                (this.endDate) ? this.endDate.format(this.formatInputDate) : ''
            ];
            this.value = concatValue.join('');
            this.isInvalid = !(this.value.length);
        };
        this.reFormatInput = () => {
            this.concatValueInput();
            this.formatInputDate = (this.includeTime) ? 'D MMM, YYYY h:mm A' : 'D MMM, YYYY';
        };
        this.simulateClick = (date) => {
            try {
                setTimeout(() => {
                    const getDayNext = document.querySelector(`.calendar-day-not-range-${date} > button`);
                    if (getDayNext) {
                        getDayNext.click();
                    }
                }, 50);
            }
            catch (e) {
                return null;
            }
        };
    }
    ngOnInit() {
        this.setOptions();
        moment.locale(this.locale);
        if (!this.startDate) {
            this.startDate = moment();
        }
        this.navDate = moment();
        this.makeHeader();
        this.currentMonth = this.navDate.month();
        this.currentYear = this.navDate.year();
        this.makeGrid(this.currentYear, this.currentMonth);
        this.isInvalid = !(this.value.length);
        // this.concatValueInput();
    }
    /**
     *
     * controlValueAccessor
     */
    onInput(value) {
        this.value = value;
        this.onTouch();
        this.onChange(this.value);
    }
    writeValue(value) {
        if (value) {
            this.value = value || '';
        }
        else {
            this.value = '';
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouch = fn;
    }
    setDisabledState(isDisabled) {
        this.isDisabled = isDisabled;
    }
    /**
     *
     * @param value
     */
    setOptions() {
        this.includeEndDate = false;
        this.includeTime = false;
    }
    setAccess() {
        this.canAccessPrevious = this.canChangeNavMonth(-1);
        this.canAccessNext = this.canChangeNavMonth(1);
    }
    changeNavMonth(num) {
        if (this.canChangeNavMonth(num)) {
            this.navDate.add(num, 'month');
            this.currentMonth = this.navDate.month();
            this.currentYear = this.navDate.year();
            this.makeGrid(this.currentYear, this.currentMonth);
        }
    }
    canChangeNavMonth(num) {
        const clonedDate = moment(this.navDate);
        return this.canChangeNavMonthLogic(num, clonedDate);
    }
    makeHeader() {
        const weekDaysArr = [0, 1, 2, 3, 4, 5, 6];
        weekDaysArr.forEach(day => this.weekDaysHeaderArr.push(moment().weekday(day).format('ddd')));
    }
    getDimensions(date) {
        const firstDayDate = moment(date).startOf('month');
        this.initialEmptyCells = firstDayDate.weekday();
        const lastDayDate = moment(date).endOf('month');
        this.lastEmptyCells = 6 - lastDayDate.weekday();
        this.arrayLength = this.initialEmptyCells + this.lastEmptyCells + date.daysInMonth();
    }
    makeGrid(year, month) {
        if (!this.gridArr.hasOwnProperty(year)) {
            this.gridArr[year] = {};
        }
        if (!this.gridArr[year].hasOwnProperty(month)) {
            this.gridArr[year][month] = [];
            this.getDimensions(this.navDate);
            for (let i = 0; i < this.arrayLength; i++) {
                const obj = {};
                if (i < this.initialEmptyCells || i > this.initialEmptyCells + this.navDate.daysInMonth() - 1) {
                    obj.value = 0;
                    obj.available = false;
                    obj.isToday = false;
                }
                else {
                    obj.value = i - this.initialEmptyCells + 1;
                    obj.available = this.isAvailable(i - this.initialEmptyCells + 1);
                    obj.isToday = this.isToday(i - this.initialEmptyCells + 1, month, year);
                    obj.month = month;
                    obj.date = this.navDate;
                    obj.year = year;
                    obj.isActive = false;
                    if (this.dateFromDayAndMonthAndYear(obj.value, month, year).isSame(this.startDate)) {
                        this.startDay = obj;
                    }
                    if (this.dateFromDayAndMonthAndYear(obj.value, month, year).isSame(this.endDate)) {
                        this.endDay = obj;
                    }
                    if (obj.isToday && !this.startDay && !this.endDay) {
                        this.startDay = obj;
                        this.endDay = obj;
                        obj.isActive = true;
                    }
                }
                obj.inRange = false;
                this.gridArr[year][month].push(obj);
            }
        }
        this.setAccess();
    }
    isAvailable(num) {
        const dateToCheck = this.dateFromNum(num, this.navDate);
        return this.isAvailableLogic(dateToCheck);
    }
    isToday(num, month, year) {
        const dateToCheck = moment(this.dateFromDayAndMonthAndYear(num, month, year));
        return dateToCheck.isSame(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }));
    }
    dateFromNum(num, referenceDate) {
        const returnDate = moment(referenceDate);
        return returnDate.date(num);
    }
    selectDay(day) {
        if (day.available) {
            this.selectedDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
            if (this.includeEndDate) {
                const currDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
                switch (this.mode) {
                    case 'end':
                        if (currDate.isSame(moment(this.startDate).startOf('day'))) {
                            this.mode = 'start';
                        }
                        else if (currDate.isSameOrBefore(this.startDate)) {
                            this.endDay = this.startDay;
                            this.startDay = day;
                            this.mode = 'start';
                        }
                        else {
                            this.endDay = day;
                        }
                        break;
                    case 'start':
                        if (currDate.isSame(moment(this.endDate).startOf('day'))) {
                            this.mode = 'end';
                        }
                        else if (currDate.isSameOrAfter(this.endDate)) {
                            this.startDay = this.endDay;
                            this.endDay = day;
                            this.mode = 'end';
                        }
                        else {
                            this.startDay = day;
                        }
                        break;
                }
                this.startDate = this.generateDate(this.startDay, this.startDate);
                this.endDate = this.generateDate(this.endDay, this.endDate);
                this.applyRange();
                this.startDay.isActive = true;
                this.endDay.isActive = true;
                this.selected = {
                    startDate: this.startDate,
                    endDate: this.endDate
                };
            }
            else {
                this.resetActivity();
                this.startDate = this.selectedDate;
                this.startDay = day;
                this.startDay.isActive = true;
                this.selected = {
                    startDate: this.startDate
                };
                this.emitSelected.emit(this.selected);
            }
            if (this.startDate && this.endDate) {
                this.emitSelected.emit(this.selected);
            }
            this.reFormatInput();
        }
    }
    generateDate(day, date) {
        let generatedDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
        if (date) {
            generatedDate = generatedDate.set({ hour: date.hour(), minute: date.minute() });
        }
        return generatedDate;
    }
    resetRange() {
        Object.keys(this.gridArr).forEach(year => {
            Object.keys(this.gridArr[year]).forEach(month => {
                this.gridArr[year][month].map(day => {
                    day.inRange = false;
                    day.isActive = false;
                });
            });
        });
    }
    resetActivity() {
        Object.keys(this.gridArr).forEach(year => {
            Object.keys(this.gridArr[year]).forEach(month => {
                this.gridArr[year][month].map(day => {
                    day.isActive = false;
                });
            });
        });
    }
    dateFromDayAndMonthAndYear(day, month, year) {
        let timeObject = { hour: 0, minute: 0, second: 0, millisecond: 0 };
        if (this.includeTime) {
            timeObject = { hour: this.startDate.hour(), minute: this.startDate.minute(), second: 0, millisecond: 0 };
            this.startDate.format('h:mm A');
        }
        return moment([year, month, day]).set(timeObject);
    }
    applyRange() {
        this.getDimensions(this.startDate);
        const start = this.initialEmptyCells + this.startDay.value - 1;
        const startMonthLength = this.arrayLength;
        this.getDimensions(this.endDate);
        const endMonthLength = this.arrayLength;
        const end = this.initialEmptyCells + this.endDay.value - 1;
        this.resetRange();
        if (this.startDay.month !== this.endDay.month || this.startDay.year !== this.endDay.year) {
            Object.keys(this.gridArr).forEach(year => {
                const calendar = this.gridArr[year];
                Object.keys(calendar).forEach(month => {
                    const days = this.gridArr[year][month];
                    if (month == this.startDay.month && year == this.startDay.year) {
                        for (let i = 0; i < start; i++) {
                            days[i].inRange = false;
                        }
                        for (let i = start; i < startMonthLength; i++) {
                            days[i].inRange = true;
                        }
                    }
                    else if (month == this.endDay.month && year == this.endDay.year) {
                        for (let i = 0; i <= end; i++) {
                            days[i].inRange = true;
                        }
                        for (let i = end + 1; i < endMonthLength; i++) {
                            days[i].inRange = false;
                        }
                    }
                    else if ((month > this.startDay.month || year > this.startDay.year) && (month < this.endDay.month || year < this.endDay.year)) {
                        days.forEach(day => day.inRange = true);
                    }
                });
            });
        }
        else {
            const month = this.startDay.month;
            const year = this.startDay.year;
            for (let i = 0; i < start; i++) {
                this.gridArr[year][month][i].inRange = false;
            }
            for (let i = start; i <= end; i++) {
                this.gridArr[year][month][i].inRange = true;
            }
            for (let i = end + 1; i < this.arrayLength; i++) {
                this.gridArr[year][month][i].inRange = false;
            }
        }
    }
    isAvailableLogic(dateToCheck) {
        if (this.minDate || this.maxDate) {
            return !(dateToCheck.isBefore(this.minDate) || dateToCheck.isAfter(this.maxDate));
        }
        else {
            return !dateToCheck.isBefore(moment(), 'day');
        }
    }
    canChangeNavMonthLogic(num, currentDate) {
        currentDate.add(num, 'month');
        const minDate = this.minDate ? this.minDate : moment().add(-1, 'month');
        const maxDate = this.maxDate ? this.maxDate : moment().add(1, 'year');
        return currentDate.isBetween(minDate, maxDate);
    }
    toggleCalendar() {
        this.isOpen = !this.isOpen;
    }
    openCalendar() {
        this.isOpen = true;
        this.onTouch();
    }
    closeCalendar() {
        this.isOpen = false;
        this.emitSelected.emit(this.selected);
    }
    changeMode(mode) {
        this.mode = mode;
        this.onTouch();
    }
    clear() {
        this.resetRange();
        this.startDate = moment();
        this.endDate = null;
        this.navDate = this.todayDate;
        this.currentMonth = this.navDate.month();
        this.currentYear = this.navDate.year();
        this.includeEndDate = false;
        this.includeTime = false;
        this.startTime = null;
        this.endTime = null;
        this.mode = 'start';
        this.makeGrid(this.currentYear, this.currentMonth);
        this.reFormatInput();
    }
    setTime(moment, hour = 0, minute = 0) {
        return moment.set({ hour, minute, second: 0, millisecond: 0 });
    }
    handleModeChange() {
        this.resetRange();
        this.mode = 'end';
        if (this.startDay) {
            this.startDay.isActive = true;
        }
        if (!this.includeEndDate) {
            this.endDate = null;
            this.mode = 'start';
            this.startDay.isActive = false;
            this.endDay.isActive = false;
        }
        else {
            const tmpStartDate = this.startDate.clone();
            const nextDay = tmpStartDate.add(2, 'days').format(`YYYY-${tmpStartDate.format('M') - 1}-D`);
            this.simulateClick(nextDay);
        }
    }
    setStartTime(time) {
        this.startTime = time;
    }
    setEndTime(time) {
        this.endTime = time;
    }
    // tslint:disable-next-line:no-shadowed-variable
    handleTimeChange(time, moment, mode) {
        this.reFormatInput();
        if (!time) {
            return;
        }
        time = time.replace(/[^a-zA-Z0-9]/g, '');
        moment.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        let lastTwo = time.substr(time.length - 2).toUpperCase();
        let last = time.substr(time.length - 1).toUpperCase();
        const hasLastTwo = ['AM', 'PM'].includes(lastTwo);
        const hasLast = ['A', 'P'].includes(last);
        let isAm = true;
        let isPm = false;
        if (hasLast || hasLastTwo) {
            isAm = last === 'A' || lastTwo === 'AM';
            isPm = last === 'P' || lastTwo === 'PM';
        }
        time = time.replace(/[^0-9]/g, '');
        lastTwo = time.substr(time.length - 2);
        last = time.substr(time.length - 1);
        time = time.substr(0, 4);
        this.isInvalid = false;
        switch (time.length) {
            case 1:
                moment
                    = isAm ? this.setTime(moment, Number(time)) :
                        this.setTime(moment, Number(time) + 12);
                break;
            case 2:
                if (last >= 6) {
                    this.isInvalid = true;
                    break;
                }
                if (time === 12) {
                    moment
                        = isAm ? this.setTime(moment, 0) :
                            this.setTime(moment, 12);
                }
                else if (time < 12) {
                    moment
                        = isAm ? this.setTime(moment, Number(time)) :
                            this.setTime(moment, Number(time) + 12);
                }
                else {
                    moment
                        = isAm ? this.setTime(moment, Number(time[0]), Number(last)) :
                            this.setTime(moment, Number(time[0]) + 12, Number(last));
                }
                break;
            case 3:
                if (lastTwo >= 60) {
                    this.isInvalid = true;
                    break;
                }
                else {
                    moment
                        = isAm ? this.setTime(moment, Number(time[0]), Number(lastTwo)) :
                            this.setTime(moment, Number(time[0]) + 12, Number(lastTwo));
                }
                break;
            case 4:
                if (lastTwo >= 60) {
                    this.isInvalid = true;
                    break;
                }
                moment = this.setTime(moment, Number(time.substr(0, 2)), Number(lastTwo));
                break;
            default:
                this.isInvalid = true;
                break;
        }
        console.log('--', this.isInvalid);
        this.emitSelected.emit(this.selected);
        if (mode === 'start') {
            this.startDate = moment;
            this.startTimePicker.nativeElement.blur();
        }
        else {
            this.endDate = moment;
            this.endTimePicker.nativeElement.blur();
        }
    }
}
DatepickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-funny-datepicker',
                template: "<!-- ********* INPUT FROM DATE Collaborator https://github.com/leifermendez ***************** --->\n\n<input (click)=\"openCalendar()\" readonly spellcheck=\"false\" class=\"omit-trigger-outside input-date-funny {{classInput}}\"\n  autocomplete=\"nope\" [value]=\"value\" [disabled]=\"isDisabled\" (input)=\"onInput($event.target.value)\" [ngClass]=\"{\n    'date-picker-valid ng-valid': !isInvalid,\n     'date-picker-invalid ng-invalid': isInvalid,\n     'funny-range':includeEndDate,\n     'ng-opened': isOpen,\n     'ng-touched': onTouched,\n     'ng-untouched': !onTouched\n    }\" type=\"text\">\n\n<!--- *************** CALENDAR ELEMENTS Author https://github.com/mokshithpyla ************* --->\n<div (clickOutside)=\"closeCalendar()\" class=\"calendar\" *ngIf=\"isOpen\">\n  <form (keydown.enter)=\"$event.preventDefault()\"></form>\n  <div class=\"calendar-nav\">\n    <div class=\"calendar-nav-previous-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(-1)\" [disabled]=\"!canAccessPrevious\">\n        <i class=\"fa fa-chevron-left\"></i>\n      </button>\n    </div>\n    <div>{{navDate.format('MMMM YYYY')}}</div>\n    <div class=\"calendar-nav-next-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(1)\" [disabled]=\"!canAccessNext\">\n        <i class=\"fa fa-chevron-right\"></i>\n      </button>\n    </div>\n  </div>\n  <div class=\"calendar-container\">\n    <div class=\"calendar-header\">\n      <div class=\"calendar-date\" *ngFor=\"let day of weekDaysHeaderArr\">\n        {{day}}\n      </div>\n    </div>\n    <div class=\"calendar-body\" *ngIf=\"includeEndDate; else notRange\">\n      <ng-container *ngIf=\"gridArr\">\n        <div *ngFor=\"let day of gridArr[currentYear][currentMonth]\"\n          class=\"calendar-date calendar-day-not-range-{{currentYear}}-{{currentMonth}}-{{day?.value}}\"\n          [ngClass]=\"{\n          'is-disabled': !day.available,\n          'calendar-range': day.inRange,\n          'calendar-range-start': day.value === startDay?.value &&  day.month === startDay?.month && day.year === startDay?.year ,\n          'calendar-range-end': day.value === endDay?.value && day.month === endDay?.month && day.year === endDay?.year}\">\n          <button type=\"button\" *ngIf=\"day.value !== 0\" class=\"date-item\"\n            [ngClass]=\"{'is-active': day.isActive, 'is-today': day.isToday}\" (click)=\"selectDay(day)\">\n            {{day.value}}</button>\n          <button type=\"button\" *ngIf=\"day.value === 0\" class=\"date-item\"></button>\n        </div>\n      </ng-container>\n    </div>\n    <ng-template #notRange>\n      <div class=\"calendar-body\">\n        <div *ngFor=\"let day of gridArr[currentYear][currentMonth]\"\n          class=\"calendar-date calendar-day-range-{{currentYear}}-{{currentMonth}}-{{day?.value}}\"\n          [ngClass]=\"{'is-disabled': !day.available }\">\n          <button type=\"button\" *ngIf=\"day.value !== 0\" class=\"date-item\"\n            [ngClass]=\"{'is-active': day.isActive, 'is-today': day.isToday}\"\n            (click)=\"selectDay(day)\">{{day.value}}</button>\n          <button type=\"button\" *ngIf=\"day.value === 0\" class=\"date-item\"></button>\n        </div>\n      </div>\n    </ng-template>\n    <div class=\"footer-calendar\">\n      <div class=\"flex justify-content-between options-bar divider\">\n        <div class=\"flex\">\n          <div class=\"label-placeholder label-option pr-25\">\n            <input type=\"checkbox\" [(ngModel)]=\"includeEndDate\" (change)=\"handleModeChange()\">\n            <small>{{rangeLabel}}</small>\n          </div>\n          <div class=\"label-placeholder label-option pr-25\">\n            <input\n              (change)=\"reFormatInput();handleTimeChange(startTime, startDate, 'start');handleTimeChange(endTime, endDate, 'end')\"\n              [(ngModel)]=\"includeTime\" type=\"checkbox\">\n            <small>{{timeLabel}}</small>\n          </div>\n        </div>\n        <div class=\"label-placeholder label-option pr-25\">\n          <div (click)=\"clear()\">{{clearLabel}}</div>\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{startDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{startDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{startDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <input #startTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"\n            [ngModel]=\"startDate.format('h:mm A')\" *ngIf=\"startDate && includeTime\"\n            (ngModelChange)=\"setStartTime($event)\" (blur)=\"handleTimeChange(startTime, startDate, 'start')\"\n            (keyup.enter)=\"handleTimeChange(startTime, startDate, 'start')\">\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\" *ngIf=\"includeEndDate\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{endDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{endDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{endDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n\n          <ng-container *ngIf=\"endDate\">\n            <input #endTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"\n              [ngModel]=\"endDate.format('h:mm A')\" (ngModelChange)=\"setEndTime($event)\" *ngIf=\"includeTime\"\n              (blur)=\"handleTimeChange(endTime, endDate, 'end')\"\n              (keyup.enter)=\"handleTimeChange(endTime, endDate, 'end')\">\n          </ng-container>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n",
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => DatepickerComponent),
                        multi: true
                    }
                ],
                styles: [".datetimepicker-footer{display:flex;flex:1;justify-content:space-evenly;margin:0}.datetimepicker-selection-start{align-items:center;background:rgba(242,241,238,.6);border-radius:3px;box-shadow:inset 0 0 0 1px rgba(15,15,15,.1),inset 0 1px 1px rgba(15,15,15,.1);display:flex;flex-basis:50%;flex-grow:1;font-size:14px;height:28px;line-height:1.2;padding-left:8px;padding-right:8px}.slider{background-color:#ccc;bottom:0;cursor:pointer;left:0;right:0;top:0}.slider,.slider:before{position:absolute;transition:.4s}.slider:before{background-color:#fff;bottom:4px;content:\"\";height:26px;left:4px;width:26px}input:checked+.slider{background-color:#00d1b2}input:focus+.slider{box-shadow:0 0 1px #00d1b2}input:checked+.slider:before{transform:translateX(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}.pb10{padding-bottom:10px}.flex{display:flex}.w33p{width:33.33%}.align-right{text-align:right}.w56p{width:56.33%}.align-left{text-align:left}.pl10{padding-left:10px}.calendar-nav-next-month>button,.calendar-nav-previous-month>button{background-size:100%;height:25px}.calendar-nav>div{align-items:center;display:flex;height:25px}"]
            },] }
];
DatepickerComponent.ctorParameters = () => [];
DatepickerComponent.propDecorators = {
    value: [{ type: Input }],
    startTimePicker: [{ type: ViewChild, args: ['startTimePicker',] }],
    endTimePicker: [{ type: ViewChild, args: ['endTimePicker',] }],
    isRange: [{ type: Input }],
    hasTime: [{ type: Input }],
    startDate: [{ type: Input }],
    endDate: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    classInput: [{ type: Input }],
    locale: [{ type: Input }],
    rangeLabel: [{ type: Input }],
    timeLabel: [{ type: Input }],
    clearLabel: [{ type: Input }],
    emitSelected: [{ type: Output }]
};

class OutSideDirective {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.clickOutside = new EventEmitter();
    }
    onClick(target) {
        const classElement = target.classList || [];
        if (!Array.from(classElement).includes('omit-trigger-outside')) {
            const clickedInside = this.elementRef.nativeElement.contains(target);
            if (!clickedInside) {
                this.clickOutside.emit();
            }
        }
    }
}
OutSideDirective.decorators = [
    { type: Directive, args: [{
                selector: '[clickOutside]'
            },] }
];
OutSideDirective.ctorParameters = () => [
    { type: ElementRef }
];
OutSideDirective.propDecorators = {
    clickOutside: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['document:click', ['$event.target'],] }]
};

class NgxFunnyDatepickerModule {
}
NgxFunnyDatepickerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgxFunnyDatepickerComponent, DatepickerComponent, OutSideDirective],
                imports: [
                    CommonModule,
                    FormsModule
                ],
                exports: [DatepickerComponent]
            },] }
];

/*
 * Public API Surface of ngx-funny-datepicker
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DatepickerComponent, NgxFunnyDatepickerComponent, NgxFunnyDatepickerModule, NgxFunnyDatepickerService, OutSideDirective as ɵa };
//# sourceMappingURL=ngx-funny-datepicker.js.map
