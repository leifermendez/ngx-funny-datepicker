// tslint:disable-next-line: radix
import { Renderer2 } from '@angular/core';
import { Component, Input, Output, EventEmitter, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment_ from 'moment';
const moment = moment_;
export class DatepickerComponent {
    constructor(renderer) {
        this.renderer = renderer;
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
        this.renderedFlag = true;
        this.mode = 'end';
        this.isInvalid = false;
        this.formatInputDate = 'D MMM, YYYY';
        this.onChange = (_) => { };
        this.onTouch = () => {
            this.onTouched = true;
        };
        /**
         * Concat values date to string format for show in input
         */
        this.concatValueInput = () => {
            const concatValue = [
                this.startDate.format(this.formatInputDate),
                (this.endDate) ? '  -  ' : '',
                (this.endDate) ? this.endDate.format(this.formatInputDate) : ''
            ];
            this.value = concatValue.join('');
            this.isInvalid = !(this.value.length);
        };
        this.generateAllYear = () => {
            this.currentYear = this.navDate.year();
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(a => {
                this.navDate = moment(`${this.navDate.year()}-${a}-${this.navDate.days()}`, 'YYYY-M-DD');
                this.makeGrid(this.currentYear, a);
            });
        };
        this.reFormatInput = () => {
            this.concatValueInput();
            this.formatInputDate = (this.includeTime) ? 'D MMM, YYYY h:mm A' : 'D MMM, YYYY';
        };
        this.simulateClicks = () => {
            if (this.startDate && !this.endDate) {
                const tmpStartDate = this.startDate.clone();
                const nextDay = tmpStartDate.format(`YYYY-${tmpStartDate.format('M') - 1}-D`);
                this.simulateClick(nextDay, 'calendar-day-range');
            }
            if (this.startDate && this.endDate) {
                const tmpEndDate = this.endDate.clone();
                const nextDayEnd = tmpEndDate.format(`YYYY-${tmpEndDate.format('M') - 1}-D`);
                this.simulateClick(nextDayEnd, 'calendar-day-not-range', true);
                this.changeNavMonth(tmpEndDate.format('M'), 'fix');
            }
        };
        this.simulateClick = (date, mode = 'calendar-day-range', infinity = false) => {
            try {
                setTimeout(() => {
                    const getDayNext = document.querySelector(`.${mode}-${date} > button`);
                    if (getDayNext) {
                        getDayNext.click();
                    }
                    if (!getDayNext && infinity) {
                        const endDate = this.endDate.clone();
                        const obj = {
                            available: true,
                            inRange: true,
                            isActive: false,
                            date: this.navDate,
                            isToday: false,
                            month: parseInt(endDate.format('M')) - 1,
                            value: parseInt(endDate.format('D')),
                            year: parseInt(endDate.format('YYYY'))
                        };
                        this.selectDay(obj);
                        const tmpGrid = this.gridArr;
                        this.gridArr = false;
                        this.gridArr = tmpGrid;
                        const startDate = this.startDate.clone();
                        const nextDay = startDate.format(`YYYY-${startDate.format('M') - 1}-D`);
                        const getFixClick = document.querySelector(`.calendar-day-not-range-${nextDay} > button`);
                        // getFixClick.click();
                    }
                }, 1);
            }
            catch (e) {
                return null;
            }
        };
    }
    ngOnInit() {
        this.setOptions();
        /**
         * Set startDate and parse
         */
        if (this.startDate && moment(this.startDate).isValid()) {
            this.startDate = moment(this.startDate);
        }
        else {
            this.startDate = moment();
        }
        /**
         * Set endDate and parse
         */
        if (this.endDate && moment(this.endDate).isValid()) {
            this.endDate = moment(this.endDate);
            this.includeEndDate = true;
        }
        else {
            this.endDate = null;
        }
        this.concatValueInput();
        this.navDate = this.startDate;
        this.makeHeader();
        this.currentMonth = this.navDate.month();
        this.currentYear = this.navDate.year();
        // this.generateAllYear();
        this.makeGrid(this.currentYear, this.currentMonth);
        this.isInvalid = !(this.value.length);
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
        moment.locale(this.locale);
        this.includeEndDate = false;
        this.includeTime = false;
    }
    setAccess() {
        this.canAccessPrevious = this.canChangeNavMonth(-1);
        this.canAccessNext = this.canChangeNavMonth(1);
    }
    changeNavMonth(num, mode = 'next') {
        if (this.canChangeNavMonth(num)) {
            if (mode === 'next') {
                this.navDate.add(num, 'month');
            }
            else {
                console.log(num);
                this.navDate = moment(`${this.navDate.year()}-${num}-${this.navDate.days()}`, 'YYYY-MM-DD');
            }
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
        console.log(month, year);
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
        console.log(day);
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
        this.simulateClicks();
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
            this.simulateClick(nextDay, 'calendar-day-not-range');
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
                template: "<!-- ********* INPUT FROM DATE Collaborator https://github.com/leifermendez ***************** --->\n\n<input (click)=\"openCalendar()\" readonly spellcheck=\"false\" class=\"omit-trigger-outside input-date-funny {{classInput}}\"\n  autocomplete=\"nope\" [value]=\"value\" [disabled]=\"isDisabled\" (input)=\"onInput($event.target.value)\" [ngClass]=\"{\n    'date-picker-valid ng-valid': !isInvalid,\n     'date-picker-invalid ng-invalid': isInvalid,\n     'funny-range':includeEndDate,\n     'ng-opened': isOpen,\n     'ng-touched': onTouched,\n     'ng-untouched': !onTouched\n    }\" type=\"text\">\n\n<!--- *************** CALENDAR ELEMENTS Author https://github.com/mokshithpyla ************* --->\n<div (clickOutside)=\"closeCalendar()\" class=\"calendar\" *ngIf=\"isOpen\">\n\n  <!-- **** CALENDAR NAVIGATION ****-->\n  <div class=\"calendar-nav\">\n    <div class=\"calendar-nav-previous-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(-1)\" [disabled]=\"!canAccessPrevious\">\n        <i class=\"fa fa-chevron-left\"></i>\n      </button>\n    </div>\n    <div>{{navDate.format('MMMM YYYY')}}</div>\n    <div class=\"calendar-nav-next-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(1)\" [disabled]=\"!canAccessNext\">\n        <i class=\"fa fa-chevron-right\"></i>\n      </button>\n    </div>\n  </div>\n\n  <!--- **** CALENDAR CONTAINER ****-->\n\n\n  <div class=\"calendar-container\">\n    <div class=\"calendar-header\">\n      <div class=\"calendar-date\" *ngFor=\"let day of weekDaysHeaderArr\">\n        {{day}}\n      </div>\n    </div>\n    <div class=\"calendar-body\" *ngIf=\"includeEndDate; else notRange\">\n      <ng-container *ngIf=\"gridArr\">\n        <div *ngFor=\"let day of gridArr[currentYear][currentMonth]\"\n          class=\"calendar-date calendar-day-not-range-{{currentYear}}-{{currentMonth}}-{{day?.value}}\"\n          [ngClass]=\"{\n          'is-disabled': !day.available,\n          'calendar-range': day.inRange,\n          'calendar-range-start': day.value === startDay?.value &&  day.month === startDay?.month && day.year === startDay?.year ,\n          'calendar-range-end': day.value === endDay?.value && day.month === endDay?.month && day.year === endDay?.year}\">\n          <button type=\"button\" *ngIf=\"day.value !== 0\" class=\"date-item\"\n            [ngClass]=\"{'is-active': day.isActive, 'is-today': day.isToday}\" (click)=\"selectDay(day)\">\n            {{day.value}}</button>\n          <button type=\"button\" *ngIf=\"day.value === 0\" class=\"date-item\"></button>\n        </div>\n      </ng-container>\n    </div>\n    <ng-template #notRange>\n      <div class=\"calendar-body\">\n        <div *ngFor=\"let day of gridArr[currentYear][currentMonth]\"\n          class=\"calendar-date calendar-day-range-{{currentYear}}-{{currentMonth}}-{{day?.value}}\"\n          [ngClass]=\"{'is-disabled': !day.available }\">\n          <button type=\"button\" *ngIf=\"day.value !== 0\" class=\"date-item\"\n            [ngClass]=\"{'is-active': day.isActive, 'is-today': day.isToday}\"\n            (click)=\"selectDay(day)\">{{day.value}}</button>\n          <button type=\"button\" *ngIf=\"day.value === 0\" class=\"date-item\"></button>\n        </div>\n      </div>\n    </ng-template>\n    <div class=\"footer-calendar\">\n      <div class=\"flex justify-content-between options-bar divider\">\n        <div class=\"flex\">\n          <div class=\"label-placeholder label-option pr-25\">\n            <input type=\"checkbox\" [(ngModel)]=\"includeEndDate\" (change)=\"handleModeChange()\">\n            <small>{{rangeLabel}}</small>\n          </div>\n          <div class=\"label-placeholder label-option pr-25\">\n            <input\n              (change)=\"reFormatInput();handleTimeChange(startTime, startDate, 'start');handleTimeChange(endTime, endDate, 'end')\"\n              [(ngModel)]=\"includeTime\" type=\"checkbox\">\n            <small>{{timeLabel}}</small>\n          </div>\n        </div>\n        <div class=\"label-placeholder label-option pr-25\">\n          <div (click)=\"clear()\">{{clearLabel}}</div>\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{startDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{startDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{startDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <input #startTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"\n            [ngModel]=\"startDate.format('h:mm A')\" *ngIf=\"startDate && includeTime\"\n            (ngModelChange)=\"setStartTime($event)\" (blur)=\"handleTimeChange(startTime, startDate, 'start')\"\n            (keyup.enter)=\"handleTimeChange(startTime, startDate, 'start')\">\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\" *ngIf=\"includeEndDate\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{endDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{endDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{endDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n\n          <ng-container *ngIf=\"endDate\">\n            <input #endTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"\n              [ngModel]=\"endDate.format('h:mm A')\" (ngModelChange)=\"setEndTime($event)\" *ngIf=\"includeTime\"\n              (blur)=\"handleTimeChange(endTime, endDate, 'end')\"\n              (keyup.enter)=\"handleTimeChange(endTime, endDate, 'end')\">\n          </ng-container>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n",
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
DatepickerComponent.ctorParameters = () => [
    { type: Renderer2 }
];
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
    includeEndDate: [{ type: Input }],
    emitSelected: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvTGVpZmVyL1dlYnN0b3JtUHJvamVjdHMvZXhhbXBsZS1saWIvcHJvamVjdHMvbmd4LWZ1bm55LWRhdGVwaWNrZXIvc3JjLyIsInNvdXJjZXMiOlsibGliL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsa0NBQWtDO0FBQ2xDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQWMsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xILE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUNsQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFjdkIsTUFBTSxPQUFPLG1CQUFtQjtJQW9EOUIsWUFBb0IsUUFBbUI7UUFBbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQW5EOUIsVUFBSyxHQUFRLEVBQUUsQ0FBQztRQVloQixXQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2QsZUFBVSxHQUFHLE9BQU8sQ0FBQztRQUNyQixjQUFTLEdBQUcsTUFBTSxDQUFDO1FBQ25CLGVBQVUsR0FBRyxPQUFPLENBQUM7UUFFcEIsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBR2pELHNCQUFpQixHQUFrQixFQUFFLENBQUM7UUFDdEMsWUFBTyxHQUFRLEVBQUUsQ0FBQztRQUVsQixzQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsa0JBQWEsR0FBRyxJQUFJLENBQUM7UUFDckIsY0FBUyxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMs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QyxJQUFJLEVBQUUsQ0FBQztTQUMzQzthQUFNO1lBQ0wsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDekM7SUFDSCxDQUFDOzs7WUF4bUJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyx1MkxBQTBDO2dCQUUxQyxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjt3QkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQzt3QkFDbEQsS0FBSyxFQUFFLElBQUk7cUJBQ1o7aUJBQ0Y7O2FBQ0Y7OztZQWpCUSxTQUFTOzs7b0JBbUJmLEtBQUs7OEJBRUwsU0FBUyxTQUFDLGlCQUFpQjs0QkFFM0IsU0FBUyxTQUFDLGVBQWU7c0JBQ3pCLEtBQUs7c0JBQ0wsS0FBSzt3QkFDTCxLQUFLO3NCQUNMLEtBQUs7c0JBQ0wsS0FBSztzQkFDTCxLQUFLO3lCQUNMLEtBQUs7cUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3dCQUNMLEtBQUs7eUJBQ0wsS0FBSzs2QkFDTCxLQUFLOzJCQUNMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHJhZGl4XG5pbXBvcnQgeyBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0ICogYXMgbW9tZW50XyBmcm9tICdtb21lbnQnO1xuY29uc3QgbW9tZW50ID0gbW9tZW50XztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWZ1bm55LWRhdGVwaWNrZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0ZXBpY2tlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2RhdGVwaWNrZXIuY29tcG9uZW50LmNzcyddLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVwaWNrZXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgRGF0ZXBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICBASW5wdXQoKSB2YWx1ZTogYW55ID0gJyc7XG4gIC8vIEB0cy1pZ25vcmVcbiAgQFZpZXdDaGlsZCgnc3RhcnRUaW1lUGlja2VyJykgc3RhcnRUaW1lUGlja2VyOiBFbGVtZW50UmVmO1xuICAvLyBAdHMtaWdub3JlXG4gIEBWaWV3Q2hpbGQoJ2VuZFRpbWVQaWNrZXInKSBlbmRUaW1lUGlja2VyOiBFbGVtZW50UmVmO1xuICBASW5wdXQoKSBpc1JhbmdlOiBib29sZWFuO1xuICBASW5wdXQoKSBoYXNUaW1lOiBib29sZWFuO1xuICBASW5wdXQoKSBzdGFydERhdGU6IGFueTtcbiAgQElucHV0KCkgZW5kRGF0ZTogYW55O1xuICBASW5wdXQoKSBtaW5EYXRlOiBhbnk7XG4gIEBJbnB1dCgpIG1heERhdGU6IGFueTtcbiAgQElucHV0KCkgY2xhc3NJbnB1dDogc3RyaW5nO1xuICBASW5wdXQoKSBsb2NhbGUgPSAnZW4nO1xuICBASW5wdXQoKSByYW5nZUxhYmVsID0gJ1JhbmdlJztcbiAgQElucHV0KCkgdGltZUxhYmVsID0gJ1RpbWUnO1xuICBASW5wdXQoKSBjbGVhckxhYmVsID0gJ0NsZWFyJztcbiAgQElucHV0KCkgaW5jbHVkZUVuZERhdGU6IGJvb2xlYW47XG4gIEBPdXRwdXQoKSBlbWl0U2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgaXNPcGVuOiBib29sZWFuO1xuICBuYXZEYXRlOiBhbnk7XG4gIHdlZWtEYXlzSGVhZGVyQXJyOiBBcnJheTxzdHJpbmc+ID0gW107XG4gIGdyaWRBcnI6IGFueSA9IHt9O1xuICBzZWxlY3RlZERhdGU6IGFueTtcbiAgY2FuQWNjZXNzUHJldmlvdXMgPSB0cnVlO1xuICBjYW5BY2Nlc3NOZXh0ID0gdHJ1ZTtcbiAgdG9kYXlEYXRlID0gbW9tZW50KCkuc2V0KHsgaG91cjogMCwgbWludXRlOiAwLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICBzdGFydERheTogYW55O1xuICBlbmREYXk6IGFueTtcbiAgcmVuZGVyZWRGbGFnID0gdHJ1ZTtcbiAgbW9kZSA9ICdlbmQnO1xuICBpbml0aWFsRW1wdHlDZWxsczogbnVtYmVyO1xuICBsYXN0RW1wdHlDZWxsczogbnVtYmVyO1xuICBhcnJheUxlbmd0aDogbnVtYmVyO1xuICBjdXJyZW50TW9udGg6IG51bWJlcjtcbiAgY3VycmVudFllYXI6IG51bWJlcjtcbiAgc2VsZWN0ZWQ6IGFueTtcbiAgc3RhcnRUaW1lOiBhbnk7XG4gIGVuZFRpbWU6IGFueTtcbiAgaXNJbnZhbGlkID0gZmFsc2U7XG4gIGluY2x1ZGVUaW1lOiBib29sZWFuO1xuICBmb3JtYXRJbnB1dERhdGUgPSAnRCBNTU0sIFlZWVknO1xuICAvKipcbiAgICogQ29udHJvbEFjY2Vzc29yXG4gICAqL1xuICBvblRvdWNoZWQ6IGJvb2xlYW47XG4gIGlzRGlzYWJsZWQ6IGJvb2xlYW47XG4gIG9uQ2hhbmdlID0gKF86IGFueSkgPT4geyB9O1xuICBvblRvdWNoID0gKCkgPT4ge1xuICAgIHRoaXMub25Ub3VjaGVkID0gdHJ1ZVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuXG5cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc2V0T3B0aW9ucygpO1xuICAgIC8qKlxuICAgICAqIFNldCBzdGFydERhdGUgYW5kIHBhcnNlXG4gICAgICovXG5cbiAgICBpZiAodGhpcy5zdGFydERhdGUgJiYgbW9tZW50KHRoaXMuc3RhcnREYXRlKS5pc1ZhbGlkKCkpIHtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gbW9tZW50KHRoaXMuc3RhcnREYXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgZW5kRGF0ZSBhbmQgcGFyc2VcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLmVuZERhdGUgJiYgbW9tZW50KHRoaXMuZW5kRGF0ZSkuaXNWYWxpZCgpKSB7XG4gICAgICB0aGlzLmVuZERhdGUgPSBtb21lbnQodGhpcy5lbmREYXRlKTtcbiAgICAgIHRoaXMuaW5jbHVkZUVuZERhdGUgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVuZERhdGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuY29uY2F0VmFsdWVJbnB1dCgpO1xuICAgIHRoaXMubmF2RGF0ZSA9IHRoaXMuc3RhcnREYXRlO1xuICAgIHRoaXMubWFrZUhlYWRlcigpO1xuICAgIHRoaXMuY3VycmVudE1vbnRoID0gdGhpcy5uYXZEYXRlLm1vbnRoKCk7XG4gICAgdGhpcy5jdXJyZW50WWVhciA9IHRoaXMubmF2RGF0ZS55ZWFyKCk7XG4gICAgLy8gdGhpcy5nZW5lcmF0ZUFsbFllYXIoKTtcbiAgICB0aGlzLm1ha2VHcmlkKHRoaXMuY3VycmVudFllYXIsIHRoaXMuY3VycmVudE1vbnRoKTtcbiAgICB0aGlzLmlzSW52YWxpZCA9ICEodGhpcy52YWx1ZS5sZW5ndGgpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIGNvbnRyb2xWYWx1ZUFjY2Vzc29yXG4gICAqL1xuICBvbklucHV0KHZhbHVlKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMub25Ub3VjaCgpO1xuICAgIHRoaXMub25DaGFuZ2UodGhpcy52YWx1ZSk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZSB8fCAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52YWx1ZSA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoID0gZm47XG4gIH1cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5pc0Rpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG5cblxuICBzZXRPcHRpb25zKCkge1xuICAgIG1vbWVudC5sb2NhbGUodGhpcy5sb2NhbGUpO1xuICAgIHRoaXMuaW5jbHVkZUVuZERhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmluY2x1ZGVUaW1lID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ29uY2F0IHZhbHVlcyBkYXRlIHRvIHN0cmluZyBmb3JtYXQgZm9yIHNob3cgaW4gaW5wdXRcbiAgICovXG4gIGNvbmNhdFZhbHVlSW5wdXQgPSAoKSA9PiB7XG4gICAgY29uc3QgY29uY2F0VmFsdWUgPSBbXG4gICAgICB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQodGhpcy5mb3JtYXRJbnB1dERhdGUpLFxuICAgICAgKHRoaXMuZW5kRGF0ZSkgPyAnICAtICAnIDogJycsXG4gICAgICAodGhpcy5lbmREYXRlKSA/IHRoaXMuZW5kRGF0ZS5mb3JtYXQodGhpcy5mb3JtYXRJbnB1dERhdGUpIDogJydcbiAgICBdO1xuICAgIHRoaXMudmFsdWUgPSBjb25jYXRWYWx1ZS5qb2luKCcnKTtcbiAgICB0aGlzLmlzSW52YWxpZCA9ICEodGhpcy52YWx1ZS5sZW5ndGgpO1xuXG4gIH1cblxuICBzZXRBY2Nlc3MoKSB7XG4gICAgdGhpcy5jYW5BY2Nlc3NQcmV2aW91cyA9IHRoaXMuY2FuQ2hhbmdlTmF2TW9udGgoLTEpO1xuICAgIHRoaXMuY2FuQWNjZXNzTmV4dCA9IHRoaXMuY2FuQ2hhbmdlTmF2TW9udGgoMSk7XG4gIH1cblxuICBjaGFuZ2VOYXZNb250aChudW06IG51bWJlciwgbW9kZSA9ICduZXh0Jykge1xuICAgIGlmICh0aGlzLmNhbkNoYW5nZU5hdk1vbnRoKG51bSkpIHtcbiAgICAgIGlmIChtb2RlID09PSAnbmV4dCcpIHtcbiAgICAgICAgdGhpcy5uYXZEYXRlLmFkZChudW0sICdtb250aCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2cobnVtKTtcblxuICAgICAgICB0aGlzLm5hdkRhdGUgPSBtb21lbnQoYCR7dGhpcy5uYXZEYXRlLnllYXIoKX0tJHtudW19LSR7dGhpcy5uYXZEYXRlLmRheXMoKX1gLCAnWVlZWS1NTS1ERCcpO1xuICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50TW9udGggPSB0aGlzLm5hdkRhdGUubW9udGgoKTtcbiAgICAgIHRoaXMuY3VycmVudFllYXIgPSB0aGlzLm5hdkRhdGUueWVhcigpO1xuICAgICAgdGhpcy5tYWtlR3JpZCh0aGlzLmN1cnJlbnRZZWFyLCB0aGlzLmN1cnJlbnRNb250aCk7XG4gICAgfVxuICB9XG5cbiAgZ2VuZXJhdGVBbGxZZWFyID0gKCkgPT4ge1xuICAgIHRoaXMuY3VycmVudFllYXIgPSB0aGlzLm5hdkRhdGUueWVhcigpO1xuICAgIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyXS5mb3JFYWNoKGEgPT4ge1xuICAgICAgdGhpcy5uYXZEYXRlID0gbW9tZW50KGAke3RoaXMubmF2RGF0ZS55ZWFyKCl9LSR7YX0tJHt0aGlzLm5hdkRhdGUuZGF5cygpfWAsICdZWVlZLU0tREQnKTtcbiAgICAgIHRoaXMubWFrZUdyaWQodGhpcy5jdXJyZW50WWVhciwgYSk7XG4gICAgfSlcblxuICB9XG5cbiAgY2FuQ2hhbmdlTmF2TW9udGgobnVtOiBudW1iZXIpIHtcbiAgICBjb25zdCBjbG9uZWREYXRlID0gbW9tZW50KHRoaXMubmF2RGF0ZSk7XG4gICAgcmV0dXJuIHRoaXMuY2FuQ2hhbmdlTmF2TW9udGhMb2dpYyhudW0sIGNsb25lZERhdGUpO1xuICB9XG5cbiAgbWFrZUhlYWRlcigpIHtcbiAgICBjb25zdCB3ZWVrRGF5c0FycjogQXJyYXk8bnVtYmVyPiA9IFswLCAxLCAyLCAzLCA0LCA1LCA2XTtcbiAgICB3ZWVrRGF5c0Fyci5mb3JFYWNoKGRheSA9PiB0aGlzLndlZWtEYXlzSGVhZGVyQXJyLnB1c2gobW9tZW50KCkud2Vla2RheShkYXkpLmZvcm1hdCgnZGRkJykpKTtcbiAgfVxuXG4gIGdldERpbWVuc2lvbnMoZGF0ZTogYW55KSB7XG4gICAgY29uc3QgZmlyc3REYXlEYXRlID0gbW9tZW50KGRhdGUpLnN0YXJ0T2YoJ21vbnRoJyk7XG4gICAgdGhpcy5pbml0aWFsRW1wdHlDZWxscyA9IGZpcnN0RGF5RGF0ZS53ZWVrZGF5KCk7XG4gICAgY29uc3QgbGFzdERheURhdGUgPSBtb21lbnQoZGF0ZSkuZW5kT2YoJ21vbnRoJyk7XG4gICAgdGhpcy5sYXN0RW1wdHlDZWxscyA9IDYgLSBsYXN0RGF5RGF0ZS53ZWVrZGF5KCk7XG4gICAgdGhpcy5hcnJheUxlbmd0aCA9IHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgKyB0aGlzLmxhc3RFbXB0eUNlbGxzICsgZGF0ZS5kYXlzSW5Nb250aCgpO1xuICB9XG5cbiAgbWFrZUdyaWQoeWVhciwgbW9udGgpIHtcbiAgICBjb25zb2xlLmxvZyhtb250aCwgeWVhcik7XG5cbiAgICBpZiAoIXRoaXMuZ3JpZEFyci5oYXNPd25Qcm9wZXJ0eSh5ZWFyKSkge1xuICAgICAgdGhpcy5ncmlkQXJyW3llYXJdID0ge307XG4gICAgfVxuICAgIGlmICghdGhpcy5ncmlkQXJyW3llYXJdLmhhc093blByb3BlcnR5KG1vbnRoKSkge1xuICAgICAgdGhpcy5ncmlkQXJyW3llYXJdW21vbnRoXSA9IFtdO1xuICAgICAgdGhpcy5nZXREaW1lbnNpb25zKHRoaXMubmF2RGF0ZSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlMZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvYmo6IGFueSA9IHt9O1xuICAgICAgICBpZiAoaSA8IHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgfHwgaSA+IHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgKyB0aGlzLm5hdkRhdGUuZGF5c0luTW9udGgoKSAtIDEpIHtcbiAgICAgICAgICBvYmoudmFsdWUgPSAwO1xuICAgICAgICAgIG9iai5hdmFpbGFibGUgPSBmYWxzZTtcbiAgICAgICAgICBvYmouaXNUb2RheSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9iai52YWx1ZSA9IGkgLSB0aGlzLmluaXRpYWxFbXB0eUNlbGxzICsgMTtcbiAgICAgICAgICBvYmouYXZhaWxhYmxlID0gdGhpcy5pc0F2YWlsYWJsZShpIC0gdGhpcy5pbml0aWFsRW1wdHlDZWxscyArIDEpO1xuICAgICAgICAgIG9iai5pc1RvZGF5ID0gdGhpcy5pc1RvZGF5KGkgLSB0aGlzLmluaXRpYWxFbXB0eUNlbGxzICsgMSwgbW9udGgsIHllYXIpO1xuICAgICAgICAgIG9iai5tb250aCA9IG1vbnRoO1xuICAgICAgICAgIG9iai5kYXRlID0gdGhpcy5uYXZEYXRlO1xuICAgICAgICAgIG9iai55ZWFyID0geWVhcjtcbiAgICAgICAgICBvYmouaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICBpZiAodGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihvYmoudmFsdWUsIG1vbnRoLCB5ZWFyKS5pc1NhbWUodGhpcy5zdGFydERhdGUpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gb2JqO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihvYmoudmFsdWUsIG1vbnRoLCB5ZWFyKS5pc1NhbWUodGhpcy5lbmREYXRlKSkge1xuICAgICAgICAgICAgdGhpcy5lbmREYXkgPSBvYmo7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvYmouaXNUb2RheSAmJiAhdGhpcy5zdGFydERheSAmJiAhdGhpcy5lbmREYXkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnREYXkgPSBvYmo7XG4gICAgICAgICAgICB0aGlzLmVuZERheSA9IG9iajtcbiAgICAgICAgICAgIG9iai5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG9iai5pblJhbmdlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ3JpZEFyclt5ZWFyXVttb250aF0ucHVzaChvYmopO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNldEFjY2VzcygpO1xuICB9XG5cbiAgaXNBdmFpbGFibGUobnVtOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCBkYXRlVG9DaGVjayA9IHRoaXMuZGF0ZUZyb21OdW0obnVtLCB0aGlzLm5hdkRhdGUpO1xuICAgIHJldHVybiB0aGlzLmlzQXZhaWxhYmxlTG9naWMoZGF0ZVRvQ2hlY2spO1xuICB9XG5cbiAgaXNUb2RheShudW06IG51bWJlciwgbW9udGg6IG51bWJlciwgeWVhcjogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZGF0ZVRvQ2hlY2sgPSBtb21lbnQodGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihudW0sIG1vbnRoLCB5ZWFyKSk7XG4gICAgcmV0dXJuIGRhdGVUb0NoZWNrLmlzU2FtZShtb21lbnQoKS5zZXQoeyBob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSkpO1xuICB9XG5cbiAgZGF0ZUZyb21OdW0obnVtOiBudW1iZXIsIHJlZmVyZW5jZURhdGU6IGFueSk6IGFueSB7XG4gICAgY29uc3QgcmV0dXJuRGF0ZSA9IG1vbWVudChyZWZlcmVuY2VEYXRlKTtcbiAgICByZXR1cm4gcmV0dXJuRGF0ZS5kYXRlKG51bSk7XG4gIH1cblxuICByZUZvcm1hdElucHV0ID0gKCkgPT4ge1xuICAgIHRoaXMuY29uY2F0VmFsdWVJbnB1dCgpO1xuICAgIHRoaXMuZm9ybWF0SW5wdXREYXRlID0gKHRoaXMuaW5jbHVkZVRpbWUpID8gJ0QgTU1NLCBZWVlZIGg6bW0gQScgOiAnRCBNTU0sIFlZWVknO1xuICB9XG5cbiAgc2VsZWN0RGF5KGRheTogYW55KSB7XG4gICAgaWYgKGRheS5hdmFpbGFibGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRlID0gdGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihkYXkudmFsdWUsIGRheS5tb250aCwgZGF5LnllYXIpO1xuICAgICAgaWYgKHRoaXMuaW5jbHVkZUVuZERhdGUpIHtcbiAgICAgICAgY29uc3QgY3VyckRhdGUgPSB0aGlzLmRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKGRheS52YWx1ZSwgZGF5Lm1vbnRoLCBkYXkueWVhcik7XG4gICAgICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgIGlmIChjdXJyRGF0ZS5pc1NhbWUobW9tZW50KHRoaXMuc3RhcnREYXRlKS5zdGFydE9mKCdkYXknKSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5tb2RlID0gJ3N0YXJ0JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyckRhdGUuaXNTYW1lT3JCZWZvcmUodGhpcy5zdGFydERhdGUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuZW5kRGF5ID0gdGhpcy5zdGFydERheTtcbiAgICAgICAgICAgICAgdGhpcy5zdGFydERheSA9IGRheTtcbiAgICAgICAgICAgICAgdGhpcy5tb2RlID0gJ3N0YXJ0JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuZW5kRGF5ID0gZGF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc3RhcnQnOlxuICAgICAgICAgICAgaWYgKGN1cnJEYXRlLmlzU2FtZShtb21lbnQodGhpcy5lbmREYXRlKS5zdGFydE9mKCdkYXknKSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5tb2RlID0gJ2VuZCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJEYXRlLmlzU2FtZU9yQWZ0ZXIodGhpcy5lbmREYXRlKSkge1xuICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gdGhpcy5lbmREYXk7XG4gICAgICAgICAgICAgIHRoaXMuZW5kRGF5ID0gZGF5O1xuICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAnZW5kJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhcnREYXkgPSBkYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuZ2VuZXJhdGVEYXRlKHRoaXMuc3RhcnREYXksIHRoaXMuc3RhcnREYXRlKTtcbiAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5nZW5lcmF0ZURhdGUodGhpcy5lbmREYXksIHRoaXMuZW5kRGF0ZSk7XG4gICAgICAgIHRoaXMuYXBwbHlSYW5nZSgpO1xuICAgICAgICB0aGlzLnN0YXJ0RGF5LmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbmREYXkuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0ge1xuICAgICAgICAgIHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsXG4gICAgICAgICAgZW5kRGF0ZTogdGhpcy5lbmREYXRlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc2V0QWN0aXZpdHkoKTtcbiAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLnNlbGVjdGVkRGF0ZTtcbiAgICAgICAgdGhpcy5zdGFydERheSA9IGRheTtcbiAgICAgICAgdGhpcy5zdGFydERheS5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB7XG4gICAgICAgICAgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVtaXRTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3RhcnREYXRlICYmIHRoaXMuZW5kRGF0ZSkge1xuICAgICAgICB0aGlzLmVtaXRTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWQpO1xuICAgICAgfVxuICAgICAgdGhpcy5yZUZvcm1hdElucHV0KCk7XG4gICAgfVxuICB9XG5cbiAgZ2VuZXJhdGVEYXRlKGRheTogYW55LCBkYXRlOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhkYXkpO1xuXG4gICAgbGV0IGdlbmVyYXRlZERhdGUgPSB0aGlzLmRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKGRheS52YWx1ZSwgZGF5Lm1vbnRoLCBkYXkueWVhcik7XG4gICAgaWYgKGRhdGUpIHtcbiAgICAgIGdlbmVyYXRlZERhdGUgPSBnZW5lcmF0ZWREYXRlLnNldCh7IGhvdXI6IGRhdGUuaG91cigpLCBtaW51dGU6IGRhdGUubWludXRlKCkgfSk7XG4gICAgfVxuICAgIHJldHVybiBnZW5lcmF0ZWREYXRlO1xuICB9XG5cbiAgcmVzZXRSYW5nZSgpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmdyaWRBcnIpLmZvckVhY2goeWVhciA9PiB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmdyaWRBcnJbeWVhcl0pLmZvckVhY2gobW9udGggPT4ge1xuICAgICAgICB0aGlzLmdyaWRBcnJbeWVhcl1bbW9udGhdLm1hcChkYXkgPT4ge1xuICAgICAgICAgIGRheS5pblJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgZGF5LmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXNldEFjdGl2aXR5KCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZ3JpZEFycikuZm9yRWFjaCh5ZWFyID0+IHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZ3JpZEFyclt5ZWFyXSkuZm9yRWFjaChtb250aCA9PiB7XG4gICAgICAgIHRoaXMuZ3JpZEFyclt5ZWFyXVttb250aF0ubWFwKGRheSA9PiB7XG4gICAgICAgICAgZGF5LmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBkYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihkYXksIG1vbnRoLCB5ZWFyKSB7XG4gICAgbGV0IHRpbWVPYmplY3QgPSB7IGhvdXI6IDAsIG1pbnV0ZTogMCwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9O1xuICAgIGlmICh0aGlzLmluY2x1ZGVUaW1lKSB7XG4gICAgICB0aW1lT2JqZWN0ID0geyBob3VyOiB0aGlzLnN0YXJ0RGF0ZS5ob3VyKCksIG1pbnV0ZTogdGhpcy5zdGFydERhdGUubWludXRlKCksIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfTtcbiAgICAgIHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnaDptbSBBJyk7XG4gICAgfVxuICAgIHJldHVybiBtb21lbnQoW3llYXIsIG1vbnRoLCBkYXldKS5zZXQodGltZU9iamVjdCk7XG4gIH1cblxuICBhcHBseVJhbmdlKCkge1xuICAgIHRoaXMuZ2V0RGltZW5zaW9ucyh0aGlzLnN0YXJ0RGF0ZSk7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmluaXRpYWxFbXB0eUNlbGxzICsgdGhpcy5zdGFydERheS52YWx1ZSAtIDE7XG4gICAgY29uc3Qgc3RhcnRNb250aExlbmd0aCA9IHRoaXMuYXJyYXlMZW5ndGg7XG4gICAgdGhpcy5nZXREaW1lbnNpb25zKHRoaXMuZW5kRGF0ZSk7XG4gICAgY29uc3QgZW5kTW9udGhMZW5ndGggPSB0aGlzLmFycmF5TGVuZ3RoO1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgKyB0aGlzLmVuZERheS52YWx1ZSAtIDE7XG4gICAgdGhpcy5yZXNldFJhbmdlKCk7XG4gICAgaWYgKHRoaXMuc3RhcnREYXkubW9udGggIT09IHRoaXMuZW5kRGF5Lm1vbnRoIHx8IHRoaXMuc3RhcnREYXkueWVhciAhPT0gdGhpcy5lbmREYXkueWVhcikge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5ncmlkQXJyKS5mb3JFYWNoKHllYXIgPT4ge1xuICAgICAgICBjb25zdCBjYWxlbmRhciA9IHRoaXMuZ3JpZEFyclt5ZWFyXTtcbiAgICAgICAgT2JqZWN0LmtleXMoY2FsZW5kYXIpLmZvckVhY2gobW9udGggPT4ge1xuICAgICAgICAgIGNvbnN0IGRheXMgPSB0aGlzLmdyaWRBcnJbeWVhcl1bbW9udGhdO1xuICAgICAgICAgIGlmIChtb250aCA9PSB0aGlzLnN0YXJ0RGF5Lm1vbnRoICYmIHllYXIgPT0gdGhpcy5zdGFydERheS55ZWFyKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJ0OyBpKyspIHtcbiAgICAgICAgICAgICAgZGF5c1tpXS5pblJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBzdGFydE1vbnRoTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgZGF5c1tpXS5pblJhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKG1vbnRoID09IHRoaXMuZW5kRGF5Lm1vbnRoICYmIHllYXIgPT0gdGhpcy5lbmREYXkueWVhcikge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gZW5kOyBpKyspIHtcbiAgICAgICAgICAgICAgZGF5c1tpXS5pblJhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBlbmQgKyAxOyBpIDwgZW5kTW9udGhMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBkYXlzW2ldLmluUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKChtb250aCA+IHRoaXMuc3RhcnREYXkubW9udGggfHwgeWVhciA+IHRoaXMuc3RhcnREYXkueWVhcikgJiYgKG1vbnRoIDwgdGhpcy5lbmREYXkubW9udGggfHwgeWVhciA8IHRoaXMuZW5kRGF5LnllYXIpKSB7XG4gICAgICAgICAgICBkYXlzLmZvckVhY2goZGF5ID0+IGRheS5pblJhbmdlID0gdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtb250aCA9IHRoaXMuc3RhcnREYXkubW9udGg7XG4gICAgICBjb25zdCB5ZWFyID0gdGhpcy5zdGFydERheS55ZWFyO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZ3JpZEFyclt5ZWFyXVttb250aF1baV0uaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZ3JpZEFyclt5ZWFyXVttb250aF1baV0uaW5SYW5nZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gZW5kICsgMTsgaSA8IHRoaXMuYXJyYXlMZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmdyaWRBcnJbeWVhcl1bbW9udGhdW2ldLmluUmFuZ2UgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc0F2YWlsYWJsZUxvZ2ljKGRhdGVUb0NoZWNrOiBhbnkpIHtcbiAgICBpZiAodGhpcy5taW5EYXRlIHx8IHRoaXMubWF4RGF0ZSkge1xuICAgICAgcmV0dXJuICEoZGF0ZVRvQ2hlY2suaXNCZWZvcmUodGhpcy5taW5EYXRlKSB8fCBkYXRlVG9DaGVjay5pc0FmdGVyKHRoaXMubWF4RGF0ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gIWRhdGVUb0NoZWNrLmlzQmVmb3JlKG1vbWVudCgpLCAnZGF5Jyk7XG4gICAgfVxuICB9XG5cbiAgY2FuQ2hhbmdlTmF2TW9udGhMb2dpYyhudW0sIGN1cnJlbnREYXRlKSB7XG4gICAgY3VycmVudERhdGUuYWRkKG51bSwgJ21vbnRoJyk7XG4gICAgY29uc3QgbWluRGF0ZSA9IHRoaXMubWluRGF0ZSA/IHRoaXMubWluRGF0ZSA6IG1vbWVudCgpLmFkZCgtMSwgJ21vbnRoJyk7XG4gICAgY29uc3QgbWF4RGF0ZSA9IHRoaXMubWF4RGF0ZSA/IHRoaXMubWF4RGF0ZSA6IG1vbWVudCgpLmFkZCgxLCAneWVhcicpO1xuICAgIHJldHVybiBjdXJyZW50RGF0ZS5pc0JldHdlZW4obWluRGF0ZSwgbWF4RGF0ZSk7XG4gIH1cblxuICB0b2dnbGVDYWxlbmRhcigpOiBhbnkge1xuICAgIHRoaXMuaXNPcGVuID0gIXRoaXMuaXNPcGVuO1xuICB9XG5cbiAgb3BlbkNhbGVuZGFyKCk6IGFueSB7XG4gICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuICAgIHRoaXMub25Ub3VjaCgpO1xuICAgIHRoaXMuc2ltdWxhdGVDbGlja3MoKTtcbiAgfVxuXG4gIHNpbXVsYXRlQ2xpY2tzID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiAhdGhpcy5lbmREYXRlKSB7XG4gICAgICBjb25zdCB0bXBTdGFydERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuICAgICAgY29uc3QgbmV4dERheSA9IHRtcFN0YXJ0RGF0ZS5mb3JtYXQoYFlZWVktJHt0bXBTdGFydERhdGUuZm9ybWF0KCdNJykgLSAxfS1EYCk7XG4gICAgICB0aGlzLnNpbXVsYXRlQ2xpY2sobmV4dERheSwgJ2NhbGVuZGFyLWRheS1yYW5nZScpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XG4gICAgICBjb25zdCB0bXBFbmREYXRlID0gdGhpcy5lbmREYXRlLmNsb25lKCk7XG4gICAgICBjb25zdCBuZXh0RGF5RW5kID0gdG1wRW5kRGF0ZS5mb3JtYXQoYFlZWVktJHt0bXBFbmREYXRlLmZvcm1hdCgnTScpIC0gMX0tRGApO1xuICAgICAgdGhpcy5zaW11bGF0ZUNsaWNrKG5leHREYXlFbmQsICdjYWxlbmRhci1kYXktbm90LXJhbmdlJywgdHJ1ZSk7XG4gICAgICB0aGlzLmNoYW5nZU5hdk1vbnRoKHRtcEVuZERhdGUuZm9ybWF0KCdNJyksICdmaXgnKTtcbiAgICB9XG4gIH1cblxuICBjbG9zZUNhbGVuZGFyKCk6IGFueSB7XG4gICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICB0aGlzLmVtaXRTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWQpO1xuICB9XG5cbiAgY2hhbmdlTW9kZShtb2RlOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgIHRoaXMub25Ub3VjaCgpO1xuICB9XG5cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLnJlc2V0UmFuZ2UoKTtcbiAgICB0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudCgpO1xuICAgIHRoaXMuZW5kRGF0ZSA9IG51bGw7XG4gICAgdGhpcy5uYXZEYXRlID0gdGhpcy50b2RheURhdGU7XG4gICAgdGhpcy5jdXJyZW50TW9udGggPSB0aGlzLm5hdkRhdGUubW9udGgoKTtcbiAgICB0aGlzLmN1cnJlbnRZZWFyID0gdGhpcy5uYXZEYXRlLnllYXIoKTtcbiAgICB0aGlzLmluY2x1ZGVFbmREYXRlID0gZmFsc2U7XG4gICAgdGhpcy5pbmNsdWRlVGltZSA9IGZhbHNlO1xuICAgIHRoaXMuc3RhcnRUaW1lID0gbnVsbDtcbiAgICB0aGlzLmVuZFRpbWUgPSBudWxsO1xuICAgIHRoaXMubW9kZSA9ICdzdGFydCc7XG4gICAgdGhpcy5tYWtlR3JpZCh0aGlzLmN1cnJlbnRZZWFyLCB0aGlzLmN1cnJlbnRNb250aCk7XG4gICAgdGhpcy5yZUZvcm1hdElucHV0KCk7XG4gIH1cblxuICBzZXRUaW1lKG1vbWVudCwgaG91cjogbnVtYmVyID0gMCwgbWludXRlOiBudW1iZXIgPSAwKSB7XG4gICAgcmV0dXJuIG1vbWVudC5zZXQoeyBob3VyLCBtaW51dGUsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSk7XG4gIH1cblxuICBoYW5kbGVNb2RlQ2hhbmdlKCkge1xuICAgIHRoaXMucmVzZXRSYW5nZSgpO1xuICAgIHRoaXMubW9kZSA9ICdlbmQnO1xuICAgIGlmICh0aGlzLnN0YXJ0RGF5KSB7XG4gICAgICB0aGlzLnN0YXJ0RGF5LmlzQWN0aXZlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmluY2x1ZGVFbmREYXRlKSB7XG4gICAgICB0aGlzLmVuZERhdGUgPSBudWxsO1xuICAgICAgdGhpcy5tb2RlID0gJ3N0YXJ0JztcbiAgICAgIHRoaXMuc3RhcnREYXkuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZW5kRGF5LmlzQWN0aXZlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRtcFN0YXJ0RGF0ZSA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG4gICAgICBjb25zdCBuZXh0RGF5ID0gdG1wU3RhcnREYXRlLmFkZCgyLCAnZGF5cycpLmZvcm1hdChgWVlZWS0ke3RtcFN0YXJ0RGF0ZS5mb3JtYXQoJ00nKSAtIDF9LURgKTtcbiAgICAgIHRoaXMuc2ltdWxhdGVDbGljayhuZXh0RGF5LCAnY2FsZW5kYXItZGF5LW5vdC1yYW5nZScpO1xuICAgIH1cblxuICB9XG5cbiAgc2ltdWxhdGVDbGljayA9IChkYXRlOiBzdHJpbmcsIG1vZGUgPSAnY2FsZW5kYXItZGF5LXJhbmdlJywgaW5maW5pdHkgPSBmYWxzZSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3QgZ2V0RGF5TmV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke21vZGV9LSR7ZGF0ZX0gPiBidXR0b25gKSBhcyBhbnk7XG4gICAgICAgIGlmIChnZXREYXlOZXh0KSB7XG4gICAgICAgICAgZ2V0RGF5TmV4dC5jbGljaygpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZ2V0RGF5TmV4dCAmJiBpbmZpbml0eSkge1xuICAgICAgICAgIGNvbnN0IGVuZERhdGUgPSB0aGlzLmVuZERhdGUuY2xvbmUoKTtcbiAgICAgICAgICBjb25zdCBvYmogPSB7XG4gICAgICAgICAgICBhdmFpbGFibGU6IHRydWUsXG4gICAgICAgICAgICBpblJhbmdlOiB0cnVlLFxuICAgICAgICAgICAgaXNBY3RpdmU6IGZhbHNlLFxuICAgICAgICAgICAgZGF0ZTogdGhpcy5uYXZEYXRlLFxuICAgICAgICAgICAgaXNUb2RheTogZmFsc2UsXG4gICAgICAgICAgICBtb250aDogcGFyc2VJbnQoZW5kRGF0ZS5mb3JtYXQoJ00nKSkgLSAxLFxuICAgICAgICAgICAgdmFsdWU6IHBhcnNlSW50KGVuZERhdGUuZm9ybWF0KCdEJykpLFxuICAgICAgICAgICAgeWVhcjogcGFyc2VJbnQoZW5kRGF0ZS5mb3JtYXQoJ1lZWVknKSlcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMuc2VsZWN0RGF5KG9iaik7XG4gICAgICAgICAgY29uc3QgdG1wR3JpZCA9IHRoaXMuZ3JpZEFycjtcbiAgICAgICAgICB0aGlzLmdyaWRBcnIgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmdyaWRBcnIgPSB0bXBHcmlkO1xuICAgICAgICAgIGNvbnN0IHN0YXJ0RGF0ZSA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG4gICAgICAgICAgY29uc3QgbmV4dERheSA9IHN0YXJ0RGF0ZS5mb3JtYXQoYFlZWVktJHtzdGFydERhdGUuZm9ybWF0KCdNJykgLSAxfS1EYCk7XG4gICAgICAgICAgY29uc3QgZ2V0Rml4Q2xpY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuY2FsZW5kYXItZGF5LW5vdC1yYW5nZS0ke25leHREYXl9ID4gYnV0dG9uYCkgYXMgYW55O1xuICAgICAgICAgIC8vIGdldEZpeENsaWNrLmNsaWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHNldFN0YXJ0VGltZSh0aW1lKSB7XG4gICAgdGhpcy5zdGFydFRpbWUgPSB0aW1lO1xuICB9XG5cbiAgc2V0RW5kVGltZSh0aW1lKSB7XG4gICAgdGhpcy5lbmRUaW1lID0gdGltZTtcbiAgfVxuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zaGFkb3dlZC12YXJpYWJsZVxuICBoYW5kbGVUaW1lQ2hhbmdlKHRpbWU6IGFueSwgbW9tZW50OiBhbnksIG1vZGU6IHN0cmluZykge1xuICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICAgIGlmICghdGltZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aW1lID0gdGltZS5yZXBsYWNlKC9bXmEtekEtWjAtOV0vZywgJycpO1xuICAgIG1vbWVudC5zZXQoeyBob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSk7XG4gICAgbGV0IGxhc3RUd28gPSB0aW1lLnN1YnN0cih0aW1lLmxlbmd0aCAtIDIpLnRvVXBwZXJDYXNlKCk7XG4gICAgbGV0IGxhc3QgPSB0aW1lLnN1YnN0cih0aW1lLmxlbmd0aCAtIDEpLnRvVXBwZXJDYXNlKCk7XG4gICAgY29uc3QgaGFzTGFzdFR3byA9IFsnQU0nLCAnUE0nXS5pbmNsdWRlcyhsYXN0VHdvKTtcbiAgICBjb25zdCBoYXNMYXN0ID0gWydBJywgJ1AnXS5pbmNsdWRlcyhsYXN0KTtcbiAgICBsZXQgaXNBbSA9IHRydWU7XG4gICAgbGV0IGlzUG0gPSBmYWxzZTtcbiAgICBpZiAoaGFzTGFzdCB8fCBoYXNMYXN0VHdvKSB7XG4gICAgICBpc0FtID0gbGFzdCA9PT0gJ0EnIHx8IGxhc3RUd28gPT09ICdBTSc7XG4gICAgICBpc1BtID0gbGFzdCA9PT0gJ1AnIHx8IGxhc3RUd28gPT09ICdQTSc7XG4gICAgfVxuICAgIHRpbWUgPSB0aW1lLnJlcGxhY2UoL1teMC05XS9nLCAnJyk7XG4gICAgbGFzdFR3byA9IHRpbWUuc3Vic3RyKHRpbWUubGVuZ3RoIC0gMik7XG4gICAgbGFzdCA9IHRpbWUuc3Vic3RyKHRpbWUubGVuZ3RoIC0gMSk7XG4gICAgdGltZSA9IHRpbWUuc3Vic3RyKDAsIDQpO1xuICAgIHRoaXMuaXNJbnZhbGlkID0gZmFsc2U7XG4gICAgc3dpdGNoICh0aW1lLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBtb21lbnRcbiAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZSkpIDpcbiAgICAgICAgICAgIHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lKSArIDEyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGlmIChsYXN0ID49IDYpIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRpbWUgPT09IDEyKSB7XG4gICAgICAgICAgbW9tZW50XG4gICAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCAwKSA6XG4gICAgICAgICAgICAgIHRoaXMuc2V0VGltZShtb21lbnQsIDEyKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aW1lIDwgMTIpIHtcbiAgICAgICAgICBtb21lbnRcbiAgICAgICAgICAgID0gaXNBbSA/IHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lKSkgOlxuICAgICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZSkgKyAxMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9tZW50XG4gICAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSksIE51bWJlcihsYXN0KSkgOlxuICAgICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSkgKyAxMiwgTnVtYmVyKGxhc3QpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaWYgKGxhc3RUd28gPj0gNjApIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9tZW50XG4gICAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSksIE51bWJlcihsYXN0VHdvKSkgOlxuICAgICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSkgKyAxMiwgTnVtYmVyKGxhc3RUd28pKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgaWYgKGxhc3RUd28gPj0gNjApIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbW9tZW50ID0gdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWUuc3Vic3RyKDAsIDIpKSwgTnVtYmVyKGxhc3RUd28pKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnLS0nLCB0aGlzLmlzSW52YWxpZClcbiAgICB0aGlzLmVtaXRTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWQpO1xuICAgIGlmIChtb2RlID09PSAnc3RhcnQnKSB7XG4gICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudDtcbiAgICAgIHRoaXMuc3RhcnRUaW1lUGlja2VyLm5hdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVuZERhdGUgPSBtb21lbnQ7XG4gICAgICB0aGlzLmVuZFRpbWVQaWNrZXIubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==