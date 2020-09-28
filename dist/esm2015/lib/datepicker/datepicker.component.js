/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as moment_ from 'moment';
/** @type {?} */
const moment = moment_;
export class DatepickerComponent {
    constructor() {
        this.startDate = moment();
        this.emitSelected = new EventEmitter();
        this.locale = 'en';
        this.weekDaysHeaderArr = [];
        this.gridArr = {};
        this.canAccessPrevious = true;
        this.canAccessNext = true;
        this.todayDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        this.mode = 'end';
        this.isInvalid = false;
        this.formatInputDate = 'D MMM, YYYY';
        this.concatValueInput = (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const concatValue = [
                this.startDate.format(this.formatInputDate),
                (this.endDate) ? '  -  ' : '',
                (this.endDate) ? this.endDate.format(this.formatInputDate) : ''
            ];
            this.inputValueOutput = concatValue.join('');
        });
        this.reFormatInput = (/**
         * @return {?}
         */
        () => {
            this.concatValueInput();
            this.formatInputDate = (this.includeTime) ? 'D MMM, YYYY h:mm A' : 'D MMM, YYYY';
        });
        this.simulateClick = (/**
         * @param {?} date
         * @return {?}
         */
        (date) => {
            try {
                setTimeout((/**
                 * @return {?}
                 */
                () => {
                    /** @type {?} */
                    const getDayNext = (/** @type {?} */ (document.querySelector(`.calendar-day-not-range-${date} > button`)));
                    if (getDayNext) {
                        getDayNext.click();
                    }
                }), 50);
            }
            catch (e) {
                return null;
            }
        });
    }
    /**
     * @return {?}
     */
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
        this.concatValueInput();
    }
    /**
     * @return {?}
     */
    setOptions() {
        this.includeEndDate = false;
        this.includeTime = false;
    }
    /**
     * @return {?}
     */
    setAccess() {
        this.canAccessPrevious = this.canChangeNavMonth(-1);
        this.canAccessNext = this.canChangeNavMonth(1);
    }
    /**
     * @param {?} num
     * @return {?}
     */
    changeNavMonth(num) {
        if (this.canChangeNavMonth(num)) {
            this.navDate.add(num, 'month');
            this.currentMonth = this.navDate.month();
            this.currentYear = this.navDate.year();
            this.makeGrid(this.currentYear, this.currentMonth);
        }
    }
    /**
     * @param {?} num
     * @return {?}
     */
    canChangeNavMonth(num) {
        /** @type {?} */
        const clonedDate = moment(this.navDate);
        return this.canChangeNavMonthLogic(num, clonedDate);
    }
    /**
     * @return {?}
     */
    makeHeader() {
        /** @type {?} */
        const weekDaysArr = [0, 1, 2, 3, 4, 5, 6];
        weekDaysArr.forEach((/**
         * @param {?} day
         * @return {?}
         */
        day => this.weekDaysHeaderArr.push(moment().weekday(day).format('ddd'))));
    }
    /**
     * @param {?} date
     * @return {?}
     */
    getDimensions(date) {
        /** @type {?} */
        const firstDayDate = moment(date).startOf('month');
        this.initialEmptyCells = firstDayDate.weekday();
        /** @type {?} */
        const lastDayDate = moment(date).endOf('month');
        this.lastEmptyCells = 6 - lastDayDate.weekday();
        this.arrayLength = this.initialEmptyCells + this.lastEmptyCells + date.daysInMonth();
    }
    /**
     * @param {?} year
     * @param {?} month
     * @return {?}
     */
    makeGrid(year, month) {
        if (!this.gridArr.hasOwnProperty(year)) {
            this.gridArr[year] = {};
        }
        if (!this.gridArr[year].hasOwnProperty(month)) {
            this.gridArr[year][month] = [];
            this.getDimensions(this.navDate);
            for (let i = 0; i < this.arrayLength; i++) {
                /** @type {?} */
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
    /**
     * @param {?} num
     * @return {?}
     */
    isAvailable(num) {
        /** @type {?} */
        const dateToCheck = this.dateFromNum(num, this.navDate);
        return this.isAvailableLogic(dateToCheck);
    }
    /**
     * @param {?} num
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    isToday(num, month, year) {
        /** @type {?} */
        const dateToCheck = moment(this.dateFromDayAndMonthAndYear(num, month, year));
        return dateToCheck.isSame(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }));
    }
    /**
     * @param {?} num
     * @param {?} referenceDate
     * @return {?}
     */
    dateFromNum(num, referenceDate) {
        /** @type {?} */
        const returnDate = moment(referenceDate);
        return returnDate.date(num);
    }
    /**
     * @param {?} day
     * @return {?}
     */
    selectDay(day) {
        if (day.available) {
            this.selectedDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
            if (this.includeEndDate) {
                /** @type {?} */
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
    /**
     * @param {?} day
     * @param {?} date
     * @return {?}
     */
    generateDate(day, date) {
        /** @type {?} */
        let generatedDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
        if (date) {
            generatedDate = generatedDate.set({ hour: date.hour(), minute: date.minute() });
        }
        return generatedDate;
    }
    /**
     * @return {?}
     */
    resetRange() {
        Object.keys(this.gridArr).forEach((/**
         * @param {?} year
         * @return {?}
         */
        year => {
            Object.keys(this.gridArr[year]).forEach((/**
             * @param {?} month
             * @return {?}
             */
            month => {
                this.gridArr[year][month].map((/**
                 * @param {?} day
                 * @return {?}
                 */
                day => {
                    day.inRange = false;
                    day.isActive = false;
                }));
            }));
        }));
    }
    /**
     * @return {?}
     */
    resetActivity() {
        Object.keys(this.gridArr).forEach((/**
         * @param {?} year
         * @return {?}
         */
        year => {
            Object.keys(this.gridArr[year]).forEach((/**
             * @param {?} month
             * @return {?}
             */
            month => {
                this.gridArr[year][month].map((/**
                 * @param {?} day
                 * @return {?}
                 */
                day => {
                    day.isActive = false;
                }));
            }));
        }));
    }
    /**
     * @param {?} day
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    dateFromDayAndMonthAndYear(day, month, year) {
        /** @type {?} */
        let timeObject = { hour: 0, minute: 0, second: 0, millisecond: 0 };
        if (this.includeTime) {
            timeObject = { hour: this.startDate.hour(), minute: this.startDate.minute(), second: 0, millisecond: 0 };
            this.startDate.format('h:mm A');
        }
        return moment([year, month, day]).set(timeObject);
    }
    /**
     * @return {?}
     */
    applyRange() {
        this.getDimensions(this.startDate);
        /** @type {?} */
        const start = this.initialEmptyCells + this.startDay.value - 1;
        /** @type {?} */
        const startMonthLength = this.arrayLength;
        this.getDimensions(this.endDate);
        /** @type {?} */
        const endMonthLength = this.arrayLength;
        /** @type {?} */
        const end = this.initialEmptyCells + this.endDay.value - 1;
        this.resetRange();
        if (this.startDay.month !== this.endDay.month || this.startDay.year !== this.endDay.year) {
            Object.keys(this.gridArr).forEach((/**
             * @param {?} year
             * @return {?}
             */
            year => {
                /** @type {?} */
                const calendar = this.gridArr[year];
                Object.keys(calendar).forEach((/**
                 * @param {?} month
                 * @return {?}
                 */
                month => {
                    /** @type {?} */
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
                        days.forEach((/**
                         * @param {?} day
                         * @return {?}
                         */
                        day => day.inRange = true));
                    }
                }));
            }));
        }
        else {
            /** @type {?} */
            const month = this.startDay.month;
            /** @type {?} */
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
    /**
     * @param {?} dateToCheck
     * @return {?}
     */
    isAvailableLogic(dateToCheck) {
        if (this.minDate || this.maxDate) {
            return !(dateToCheck.isBefore(this.minDate) || dateToCheck.isAfter(this.maxDate));
        }
        else {
            return !dateToCheck.isBefore(moment(), 'day');
        }
    }
    /**
     * @param {?} num
     * @param {?} currentDate
     * @return {?}
     */
    canChangeNavMonthLogic(num, currentDate) {
        currentDate.add(num, 'month');
        /** @type {?} */
        const minDate = this.minDate ? this.minDate : moment().add(-1, 'month');
        /** @type {?} */
        const maxDate = this.maxDate ? this.maxDate : moment().add(1, 'year');
        return currentDate.isBetween(minDate, maxDate);
    }
    /**
     * @return {?}
     */
    toggleCalendar() {
        this.isOpen = !this.isOpen;
    }
    /**
     * @return {?}
     */
    openCalendar() {
        this.isOpen = true;
    }
    /**
     * @return {?}
     */
    closeCalendar() {
        this.isOpen = false;
    }
    /**
     * @param {?} mode
     * @return {?}
     */
    changeMode(mode) {
        this.mode = mode;
    }
    /**
     * @return {?}
     */
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
    }
    /**
     * @param {?} moment
     * @param {?=} hour
     * @param {?=} minute
     * @return {?}
     */
    setTime(moment, hour = 0, minute = 0) {
        return moment.set({ hour, minute, second: 0, millisecond: 0 });
    }
    /**
     * @return {?}
     */
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
            /** @type {?} */
            const tmpStartDate = this.startDate.clone();
            /** @type {?} */
            const nextDay = tmpStartDate.add(2, 'days').format(`YYYY-${tmpStartDate.format('M') - 1}-D`);
            this.simulateClick(nextDay);
        }
    }
    /**
     * @param {?} time
     * @return {?}
     */
    setStartTime(time) {
        this.startTime = time;
    }
    /**
     * @param {?} time
     * @return {?}
     */
    setEndTime(time) {
        this.endTime = time;
    }
    // tslint:disable-next-line:no-shadowed-variable
    /**
     * @param {?} time
     * @param {?} moment
     * @param {?} mode
     * @return {?}
     */
    handleTimeChange(time, moment, mode) {
        this.reFormatInput();
        if (!time) {
            return;
        }
        time = time.replace(/[^a-zA-Z0-9]/g, '');
        moment.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        /** @type {?} */
        let lastTwo = time.substr(time.length - 2).toUpperCase();
        /** @type {?} */
        let last = time.substr(time.length - 1).toUpperCase();
        /** @type {?} */
        const hasLastTwo = ['AM', 'PM'].includes(lastTwo);
        /** @type {?} */
        const hasLast = ['A', 'P'].includes(last);
        /** @type {?} */
        let isAm = true;
        /** @type {?} */
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
                selector: 'funny-datepicker-single',
                template: "<!-- ********* INPUT FROM DATE Collaborator https://github.com/leifermendez ***************** --->\n\n<input (click)=\"openCalendar()\" readonly spellcheck=\"false\" class=\"omit-trigger-outside input-date-funny\"\n       autocomplete=\"nope\"\n       [ngClass]=\"{'bg-blue': mode === 'start' && includeEndDate, 'bg-red': isInvalid, 'funny-range':includeEndDate }\"\n       type=\"text\" [value]=\"inputValueOutput\">\n\n<!--- *************** CALENDAR ELEMENTS Author https://github.com/mokshithpyla ************* --->\n<div (clickOutside)=\"closeCalendar()\" class=\"calendar\" *ngIf=\"isOpen\">\n  <div class=\"calendar-nav\">\n    <div class=\"calendar-nav-previous-month\">\n      <button class=\"button is-text\" (click)=\"changeNavMonth(-1)\" [disabled]=\"!canAccessPrevious\">\n        <i class=\"fa fa-chevron-left\"></i>\n      </button>\n    </div>\n    <div>{{navDate.format('MMMM YYYY')}}</div>\n    <div class=\"calendar-nav-next-month\">\n      <button class=\"button is-text\" (click)=\"changeNavMonth(1)\" [disabled]=\"!canAccessNext\">\n        <i class=\"fa fa-chevron-right\"></i>\n      </button>\n    </div>\n  </div>\n  <div class=\"calendar-container\">\n    <div class=\"calendar-header\">\n      <div class=\"calendar-date\" *ngFor=\"let day of weekDaysHeaderArr\">\n        {{day}}\n      </div>\n    </div>\n    <div class=\"calendar-body\" *ngIf=\"includeEndDate; else notRange\">\n      <ng-container *ngIf=\"gridArr\">\n        <div *ngFor=\"let day of gridArr[currentYear][currentMonth]\"\n             class=\"calendar-date calendar-day-not-range-{{currentYear}}-{{currentMonth}}-{{day?.value}}\"\n             [ngClass]=\"{\n          'is-disabled': !day.available,\n          'calendar-range': day.inRange,\n          'calendar-range-start': day.value === startDay?.value &&  day.month === startDay?.month && day.year === startDay?.year ,\n          'calendar-range-end': day.value === endDay?.value && day.month === endDay?.month && day.year === endDay?.year}\">\n          <button *ngIf=\"day.value !== 0\" class=\"date-item\"\n                  [ngClass]=\"{'is-active': day.isActive, 'is-today': day.isToday}\" (click)=\"selectDay(day)\">\n            {{day.value}}</button>\n          <button *ngIf=\"day.value === 0\" class=\"date-item\"></button>\n        </div>\n      </ng-container>\n    </div>\n    <ng-template #notRange>\n      <div class=\"calendar-body\">\n        <div *ngFor=\"let day of gridArr[currentYear][currentMonth]\"\n             class=\"calendar-date calendar-day-range-{{currentYear}}-{{currentMonth}}-{{day?.value}}\"\n             [ngClass]=\"{'is-disabled': !day.available }\">\n          <button *ngIf=\"day.value !== 0\" class=\"date-item\"\n                  [ngClass]=\"{'is-active': day.isActive, 'is-today': day.isToday}\"\n                  (click)=\"selectDay(day)\">{{day.value}}</button>\n          <button *ngIf=\"day.value === 0\" class=\"date-item\"></button>\n        </div>\n      </div>\n    </ng-template>\n    <div class=\"footer-calendar\">\n      <div class=\"flex justify-content-between options-bar divider\">\n        <div class=\"flex\">\n          <div class=\"label-placeholder label-option pr-25\">\n            <input type=\"checkbox\" [(ngModel)]=\"includeEndDate\" (change)=\"handleModeChange()\">\n            <small>RANGO</small>\n          </div>\n          <div class=\"label-placeholder label-option pr-25\">\n            <input\n              (change)=\"reFormatInput();handleTimeChange(startTime, startDate, 'start');handleTimeChange(endTime, endDate, 'end')\"\n              [(ngModel)]=\"includeTime\" type=\"checkbox\">\n            <small>HORAS</small>\n          </div>\n        </div>\n        <div class=\"label-placeholder label-option pr-25\">\n          <div (click)=\"clear()\">Limpiar</div>\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{startDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{startDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{startDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <input #startTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"\n                 [ngModel]=\"startDate.format('h:mm A')\" *ngIf=\"startDate && includeTime\"\n                 (ngModelChange)=\"setStartTime($event)\" (blur)=\"handleTimeChange(startTime, startDate, 'start')\"\n                 (keyup.enter)=\"handleTimeChange(startTime, startDate, 'start')\">\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\" *ngIf=\"includeEndDate\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{endDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{endDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{endDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <ng-container *ngIf=\"endDate\">\n            <input #endTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"\n                   [ngModel]=\"endDate.format('h:mm A')\"\n                   (ngModelChange)=\"setEndTime($event)\" *ngIf=\"isRange && includeTime\"\n                   (blur)=\"handleTimeChange(endTime, endDate, 'end')\"\n                   (keyup.enter)=\"handleTimeChange(endTime, endDate, 'end')\">\n          </ng-container>\n        </div>\n      </div>\n      <!--      -->\n      <!--      <div class=\"divider\" *ngIf=\"hasTime\">-->\n      <!--        <div class=\"label-placeholder\">-->\n      <!--          <small>FROM</small>-->\n      <!--        </div>-->\n      <!--        <div class=\"justify-content-between flex pt-25\">-->\n      <!--          <div class=\" align-left\">-->\n      <!--            <div *ngIf=\"includeTime\" class=\" align-right\">-->\n      <!--              <div *ngIf=\"startDate\">-->\n      <!--                <input #startTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"-->\n      <!--                       [ngModel]=\"startDate.format('h:mm A')\"-->\n      <!--                       (ngModelChange)=\"setStartTime($event)\" (blur)=\"handleTimeChange(startTime, startDate, 'start')\"-->\n      <!--                       (keyup.enter)=\"handleTimeChange(startTime, startDate, 'start')\">-->\n      <!--              </div>-->\n      <!--              <div *ngIf=\"!startDate\" class=\" align-right\">-->\n      <!--                &#45;&#45;-->\n      <!--              </div>-->\n      <!--            </div>-->\n      <!--          </div>-->\n      <!--          <div class=\" align-right\">-->\n      <!--            <label class=\"switch\">-->\n      <!--              <input type=\"checkbox\" (change)=\"reFormatInput()\" [(ngModel)]=\"includeTime\">-->\n      <!--              <span class=\"slider round\"></span>-->\n      <!--            </label>-->\n      <!--          </div>-->\n      <!--        </div>-->\n      <!--      </div>-->\n\n      <!--      <div class=\"divider\" *ngIf=\"isRange\">-->\n      <!--        <div class=\"label-placeholder\">-->\n      <!--          <small>TO</small>-->\n      <!--        </div>-->\n      <!--        <div class=\" justify-content-between flex pt-25\">-->\n      <!--          <div class=\" align-left \">-->\n      <!--            <div *ngIf=\"includeTime\" class=\" align-right\">-->\n      <!--              <div *ngIf=\"endDate\">-->\n      <!--                <input #endTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"-->\n      <!--                       [ngModel]=\"endDate.format('h:mm A')\"-->\n      <!--                       (ngModelChange)=\"setEndTime($event)\"-->\n      <!--                       (blur)=\"handleTimeChange(endTime, endDate, 'end')\"-->\n      <!--                       (keyup.enter)=\"handleTimeChange(endTime, endDate, 'end')\">-->\n      <!--              </div>-->\n      <!--              <div *ngIf=\"!endDate\" class=\" align-right\">-->\n      <!--                &#45;&#45;-->\n      <!--              </div>-->\n      <!--            </div>-->\n      <!--          </div>-->\n      <!--          <div class=\" align-right\">-->\n      <!--            <label class=\"switch\">-->\n      <!--              <input type=\"checkbox\" [(ngModel)]=\"includeEndDate\" (change)=\"handleModeChange()\">-->\n      <!--              <span class=\"slider round\"></span>-->\n      <!--            </label>-->\n      <!--          </div>-->\n      <!--        </div>-->\n      <!--      </div>-->\n\n      <!--      <div class=\"divider\">-->\n      <!--        <button type=\"button\" class=\"datetimepicker-footer-clear has-text-danger button is-small is-text\"-->\n      <!--                (click)=\"clear()\">Clear All-->\n      <!--        </button>-->\n      <!--      </div>-->\n\n    </div>\n  </div>\n</div>\n",
                styles: [".datetimepicker-footer{display:flex;flex:1;justify-content:space-evenly;margin:0}.datetimepicker-selection-start{display:flex;align-items:center;border-radius:3px;background:rgba(242,241,238,.6);height:28px;line-height:1.2;padding-left:8px;padding-right:8px;flex-basis:50%;box-shadow:rgba(15,15,15,.1) 0 0 0 1px inset,rgba(15,15,15,.1) 0 1px 1px inset;flex-grow:1;font-size:14px}.bg-blue{background:rgba(46,170,220,.15)!important;box-shadow:#2eaadc 0 0 0 2px inset!important}.bg-red{background:rgba(235,87,87,.15)!important;box-shadow:#eb5757 0 0 0 2px inset}.switch{position:relative;display:inline-block;width:60px;height:34px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s}.slider:before{position:absolute;content:\"\";height:26px;width:26px;left:4px;bottom:4px;background-color:#fff;transition:.4s}input:checked+.slider{background-color:#00d1b2}input:focus+.slider{box-shadow:0 0 1px #00d1b2}input:checked+.slider:before{transform:translateX(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}.pb10{padding-bottom:10px}.flex{display:flex}.w33p{width:33.33%}.align-right{text-align:right}.w56p{width:56.33%}.align-left{text-align:left}.pl10{padding-left:10px}"]
            }] }
];
/** @nocollapse */
DatepickerComponent.ctorParameters = () => [];
DatepickerComponent.propDecorators = {
    startTimePicker: [{ type: ViewChild, args: ['startTimePicker',] }],
    endTimePicker: [{ type: ViewChild, args: ['endTimePicker',] }],
    isRange: [{ type: Input }],
    hasTime: [{ type: Input }],
    startDate: [{ type: Input }],
    endDate: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    emitSelected: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    DatepickerComponent.prototype.startTimePicker;
    /** @type {?} */
    DatepickerComponent.prototype.endTimePicker;
    /** @type {?} */
    DatepickerComponent.prototype.isRange;
    /** @type {?} */
    DatepickerComponent.prototype.hasTime;
    /** @type {?} */
    DatepickerComponent.prototype.startDate;
    /** @type {?} */
    DatepickerComponent.prototype.endDate;
    /** @type {?} */
    DatepickerComponent.prototype.minDate;
    /** @type {?} */
    DatepickerComponent.prototype.maxDate;
    /** @type {?} */
    DatepickerComponent.prototype.emitSelected;
    /** @type {?} */
    DatepickerComponent.prototype.inputValueOutput;
    /** @type {?} */
    DatepickerComponent.prototype.isOpen;
    /** @type {?} */
    DatepickerComponent.prototype.locale;
    /** @type {?} */
    DatepickerComponent.prototype.navDate;
    /** @type {?} */
    DatepickerComponent.prototype.weekDaysHeaderArr;
    /** @type {?} */
    DatepickerComponent.prototype.gridArr;
    /** @type {?} */
    DatepickerComponent.prototype.selectedDate;
    /** @type {?} */
    DatepickerComponent.prototype.canAccessPrevious;
    /** @type {?} */
    DatepickerComponent.prototype.canAccessNext;
    /** @type {?} */
    DatepickerComponent.prototype.todayDate;
    /** @type {?} */
    DatepickerComponent.prototype.startDay;
    /** @type {?} */
    DatepickerComponent.prototype.endDay;
    /** @type {?} */
    DatepickerComponent.prototype.mode;
    /** @type {?} */
    DatepickerComponent.prototype.initialEmptyCells;
    /** @type {?} */
    DatepickerComponent.prototype.lastEmptyCells;
    /** @type {?} */
    DatepickerComponent.prototype.arrayLength;
    /** @type {?} */
    DatepickerComponent.prototype.currentMonth;
    /** @type {?} */
    DatepickerComponent.prototype.currentYear;
    /** @type {?} */
    DatepickerComponent.prototype.selected;
    /** @type {?} */
    DatepickerComponent.prototype.startTime;
    /** @type {?} */
    DatepickerComponent.prototype.endTime;
    /** @type {?} */
    DatepickerComponent.prototype.isInvalid;
    /** @type {?} */
    DatepickerComponent.prototype.includeEndDate;
    /** @type {?} */
    DatepickerComponent.prototype.includeTime;
    /** @type {?} */
    DatepickerComponent.prototype.formatInputDate;
    /** @type {?} */
    DatepickerComponent.prototype.concatValueInput;
    /** @type {?} */
    DatepickerComponent.prototype.reFormatInput;
    /** @type {?} */
    DatepickerComponent.prototype.simulateClick;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZnVubnktZGF0ZXBpY2tlci8iLCJzb3VyY2VzIjpbImxpYi9kYXRlcGlja2VyL2RhdGVwaWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEcsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7O01BQzVCLE1BQU0sR0FBRyxPQUFPO0FBT3RCLE1BQU0sT0FBTyxtQkFBbUI7SUFzQzlCO1FBL0JTLGNBQVMsR0FBUSxNQUFNLEVBQUUsQ0FBQztRQUl6QixpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFHakQsV0FBTSxHQUFHLElBQUksQ0FBQztRQUVkLHNCQUFpQixHQUFrQixFQUFFLENBQUM7UUFDdEMsWUFBTyxHQUFRLEVBQUUsQ0FBQztRQUVsQixzQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsa0JBQWEsR0FBRyxJQUFJLENBQUM7UUFDckIsY0FBUyxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRzVFLFNBQUksR0FBRyxLQUFLLENBQUM7UUFTYixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBR2xCLG9CQUFlLEdBQUcsYUFBYSxDQUFDO1FBd0JoQyxxQkFBZ0I7OztRQUFHLEdBQUcsRUFBRTs7a0JBQ2hCLFdBQVcsR0FBRztnQkFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztnQkFDM0MsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFD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O0lBQ2Isd0NBQWtCOztJQUNsQiw2Q0FBd0I7O0lBQ3hCLDBDQUFxQjs7SUFDckIsOENBQWdDOztJQXdCaEMsK0NBUUU7O0lBeUZGLDRDQUdFOztJQW1ORiw0Q0FXRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgbW9tZW50XyBmcm9tICdtb21lbnQnO1xuY29uc3QgbW9tZW50ID0gbW9tZW50XztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZnVubnktZGF0ZXBpY2tlci1zaW5nbGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0ZXBpY2tlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2RhdGVwaWNrZXIuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIERhdGVwaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAvLyBAdHMtaWdub3JlXG4gIEBWaWV3Q2hpbGQoJ3N0YXJ0VGltZVBpY2tlcicpIHN0YXJ0VGltZVBpY2tlcjogRWxlbWVudFJlZjtcbiAgLy8gQHRzLWlnbm9yZVxuICBAVmlld0NoaWxkKCdlbmRUaW1lUGlja2VyJykgZW5kVGltZVBpY2tlcjogRWxlbWVudFJlZjtcbiAgQElucHV0KCkgaXNSYW5nZTogYm9vbGVhbjtcbiAgQElucHV0KCkgaGFzVGltZTogYm9vbGVhbjtcbiAgQElucHV0KCkgc3RhcnREYXRlOiBhbnkgPSBtb21lbnQoKTtcbiAgQElucHV0KCkgZW5kRGF0ZTogYW55O1xuICBASW5wdXQoKSBtaW5EYXRlOiBhbnk7XG4gIEBJbnB1dCgpIG1heERhdGU6IGFueTtcbiAgQE91dHB1dCgpIGVtaXRTZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBpbnB1dFZhbHVlT3V0cHV0OiBzdHJpbmc7XG4gIGlzT3BlbjogYm9vbGVhbjtcbiAgbG9jYWxlID0gJ2VuJztcbiAgbmF2RGF0ZTogYW55O1xuICB3ZWVrRGF5c0hlYWRlckFycjogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBncmlkQXJyOiBhbnkgPSB7fTtcbiAgc2VsZWN0ZWREYXRlOiBhbnk7XG4gIGNhbkFjY2Vzc1ByZXZpb3VzID0gdHJ1ZTtcbiAgY2FuQWNjZXNzTmV4dCA9IHRydWU7XG4gIHRvZGF5RGF0ZSA9IG1vbWVudCgpLnNldCh7IGhvdXI6IDAsIG1pbnV0ZTogMCwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgc3RhcnREYXk6IGFueTtcbiAgZW5kRGF5OiBhbnk7XG4gIG1vZGUgPSAnZW5kJztcbiAgaW5pdGlhbEVtcHR5Q2VsbHM6IG51bWJlcjtcbiAgbGFzdEVtcHR5Q2VsbHM6IG51bWJlcjtcbiAgYXJyYXlMZW5ndGg6IG51bWJlcjtcbiAgY3VycmVudE1vbnRoOiBudW1iZXI7XG4gIGN1cnJlbnRZZWFyOiBudW1iZXI7XG4gIHNlbGVjdGVkOiBhbnk7XG4gIHN0YXJ0VGltZTogYW55O1xuICBlbmRUaW1lOiBhbnk7XG4gIGlzSW52YWxpZCA9IGZhbHNlO1xuICBpbmNsdWRlRW5kRGF0ZTogYm9vbGVhbjtcbiAgaW5jbHVkZVRpbWU6IGJvb2xlYW47XG4gIGZvcm1hdElucHV0RGF0ZSA9ICdEIE1NTSwgWVlZWSc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnNldE9wdGlvbnMoKTtcbiAgICBtb21lbnQubG9jYWxlKHRoaXMubG9jYWxlKTtcbiAgICBpZiAoIXRoaXMuc3RhcnREYXRlKSB7XG4gICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudCgpO1xuICAgIH1cbiAgICB0aGlzLm5hdkRhdGUgPSBtb21lbnQoKTtcbiAgICB0aGlzLm1ha2VIZWFkZXIoKTtcbiAgICB0aGlzLmN1cnJlbnRNb250aCA9IHRoaXMubmF2RGF0ZS5tb250aCgpO1xuICAgIHRoaXMuY3VycmVudFllYXIgPSB0aGlzLm5hdkRhdGUueWVhcigpO1xuICAgIHRoaXMubWFrZUdyaWQodGhpcy5jdXJyZW50WWVhciwgdGhpcy5jdXJyZW50TW9udGgpO1xuICAgIHRoaXMuY29uY2F0VmFsdWVJbnB1dCgpO1xuICB9XG5cbiAgc2V0T3B0aW9ucygpIHtcbiAgICB0aGlzLmluY2x1ZGVFbmREYXRlID0gZmFsc2U7XG4gICAgdGhpcy5pbmNsdWRlVGltZSA9IGZhbHNlO1xuICB9XG5cbiAgY29uY2F0VmFsdWVJbnB1dCA9ICgpID0+IHtcbiAgICBjb25zdCBjb25jYXRWYWx1ZSA9IFtcbiAgICAgIHRoaXMuc3RhcnREYXRlLmZvcm1hdCh0aGlzLmZvcm1hdElucHV0RGF0ZSksXG4gICAgICAodGhpcy5lbmREYXRlKSA/ICcgIC0gICcgOiAnJyxcbiAgICAgICh0aGlzLmVuZERhdGUpID8gdGhpcy5lbmREYXRlLmZvcm1hdCh0aGlzLmZvcm1hdElucHV0RGF0ZSkgOiAnJ1xuICAgIF07XG4gICAgdGhpcy5pbnB1dFZhbHVlT3V0cHV0ID0gY29uY2F0VmFsdWUuam9pbignJyk7XG5cbiAgfTtcblxuICBzZXRBY2Nlc3MoKSB7XG4gICAgdGhpcy5jYW5BY2Nlc3NQcmV2aW91cyA9IHRoaXMuY2FuQ2hhbmdlTmF2TW9udGgoLTEpO1xuICAgIHRoaXMuY2FuQWNjZXNzTmV4dCA9IHRoaXMuY2FuQ2hhbmdlTmF2TW9udGgoMSk7XG4gIH1cblxuICBjaGFuZ2VOYXZNb250aChudW06IG51bWJlcikge1xuICAgIGlmICh0aGlzLmNhbkNoYW5nZU5hdk1vbnRoKG51bSkpIHtcbiAgICAgIHRoaXMubmF2RGF0ZS5hZGQobnVtLCAnbW9udGgnKTtcbiAgICAgIHRoaXMuY3VycmVudE1vbnRoID0gdGhpcy5uYXZEYXRlLm1vbnRoKCk7XG4gICAgICB0aGlzLmN1cnJlbnRZZWFyID0gdGhpcy5uYXZEYXRlLnllYXIoKTtcbiAgICAgIHRoaXMubWFrZUdyaWQodGhpcy5jdXJyZW50WWVhciwgdGhpcy5jdXJyZW50TW9udGgpO1xuICAgIH1cbiAgfVxuXG4gIGNhbkNoYW5nZU5hdk1vbnRoKG51bTogbnVtYmVyKSB7XG4gICAgY29uc3QgY2xvbmVkRGF0ZSA9IG1vbWVudCh0aGlzLm5hdkRhdGUpO1xuICAgIHJldHVybiB0aGlzLmNhbkNoYW5nZU5hdk1vbnRoTG9naWMobnVtLCBjbG9uZWREYXRlKTtcbiAgfVxuXG4gIG1ha2VIZWFkZXIoKSB7XG4gICAgY29uc3Qgd2Vla0RheXNBcnI6IEFycmF5PG51bWJlcj4gPSBbMCwgMSwgMiwgMywgNCwgNSwgNl07XG4gICAgd2Vla0RheXNBcnIuZm9yRWFjaChkYXkgPT4gdGhpcy53ZWVrRGF5c0hlYWRlckFyci5wdXNoKG1vbWVudCgpLndlZWtkYXkoZGF5KS5mb3JtYXQoJ2RkZCcpKSk7XG4gIH1cblxuICBnZXREaW1lbnNpb25zKGRhdGU6IGFueSkge1xuICAgIGNvbnN0IGZpcnN0RGF5RGF0ZSA9IG1vbWVudChkYXRlKS5zdGFydE9mKCdtb250aCcpO1xuICAgIHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgPSBmaXJzdERheURhdGUud2Vla2RheSgpO1xuICAgIGNvbnN0IGxhc3REYXlEYXRlID0gbW9tZW50KGRhdGUpLmVuZE9mKCdtb250aCcpO1xuICAgIHRoaXMubGFzdEVtcHR5Q2VsbHMgPSA2IC0gbGFzdERheURhdGUud2Vla2RheSgpO1xuICAgIHRoaXMuYXJyYXlMZW5ndGggPSB0aGlzLmluaXRpYWxFbXB0eUNlbGxzICsgdGhpcy5sYXN0RW1wdHlDZWxscyArIGRhdGUuZGF5c0luTW9udGgoKTtcbiAgfVxuXG4gIG1ha2VHcmlkKHllYXIsIG1vbnRoKSB7XG4gICAgaWYgKCF0aGlzLmdyaWRBcnIuaGFzT3duUHJvcGVydHkoeWVhcikpIHtcbiAgICAgIHRoaXMuZ3JpZEFyclt5ZWFyXSA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZ3JpZEFyclt5ZWFyXS5oYXNPd25Qcm9wZXJ0eShtb250aCkpIHtcbiAgICAgIHRoaXMuZ3JpZEFyclt5ZWFyXVttb250aF0gPSBbXTtcbiAgICAgIHRoaXMuZ2V0RGltZW5zaW9ucyh0aGlzLm5hdkRhdGUpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFycmF5TGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgb2JqOiBhbnkgPSB7fTtcbiAgICAgICAgaWYgKGkgPCB0aGlzLmluaXRpYWxFbXB0eUNlbGxzIHx8IGkgPiB0aGlzLmluaXRpYWxFbXB0eUNlbGxzICsgdGhpcy5uYXZEYXRlLmRheXNJbk1vbnRoKCkgLSAxKSB7XG4gICAgICAgICAgb2JqLnZhbHVlID0gMDtcbiAgICAgICAgICBvYmouYXZhaWxhYmxlID0gZmFsc2U7XG4gICAgICAgICAgb2JqLmlzVG9kYXkgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvYmoudmFsdWUgPSBpIC0gdGhpcy5pbml0aWFsRW1wdHlDZWxscyArIDE7XG4gICAgICAgICAgb2JqLmF2YWlsYWJsZSA9IHRoaXMuaXNBdmFpbGFibGUoaSAtIHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgKyAxKTtcbiAgICAgICAgICBvYmouaXNUb2RheSA9IHRoaXMuaXNUb2RheShpIC0gdGhpcy5pbml0aWFsRW1wdHlDZWxscyArIDEsIG1vbnRoLCB5ZWFyKTtcbiAgICAgICAgICBvYmoubW9udGggPSBtb250aDtcbiAgICAgICAgICBvYmouZGF0ZSA9IHRoaXMubmF2RGF0ZTtcbiAgICAgICAgICBvYmoueWVhciA9IHllYXI7XG4gICAgICAgICAgb2JqLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIob2JqLnZhbHVlLCBtb250aCwgeWVhcikuaXNTYW1lKHRoaXMuc3RhcnREYXRlKSkge1xuICAgICAgICAgICAgdGhpcy5zdGFydERheSA9IG9iajtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIob2JqLnZhbHVlLCBtb250aCwgeWVhcikuaXNTYW1lKHRoaXMuZW5kRGF0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kRGF5ID0gb2JqO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAob2JqLmlzVG9kYXkgJiYgIXRoaXMuc3RhcnREYXkgJiYgIXRoaXMuZW5kRGF5KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gb2JqO1xuICAgICAgICAgICAgdGhpcy5lbmREYXkgPSBvYmo7XG4gICAgICAgICAgICBvYmouaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvYmouaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmdyaWRBcnJbeWVhcl1bbW9udGhdLnB1c2gob2JqKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zZXRBY2Nlc3MoKTtcbiAgfVxuXG4gIGlzQXZhaWxhYmxlKG51bTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZGF0ZVRvQ2hlY2sgPSB0aGlzLmRhdGVGcm9tTnVtKG51bSwgdGhpcy5uYXZEYXRlKTtcbiAgICByZXR1cm4gdGhpcy5pc0F2YWlsYWJsZUxvZ2ljKGRhdGVUb0NoZWNrKTtcbiAgfVxuXG4gIGlzVG9kYXkobnVtOiBudW1iZXIsIG1vbnRoOiBudW1iZXIsIHllYXI6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGRhdGVUb0NoZWNrID0gbW9tZW50KHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIobnVtLCBtb250aCwgeWVhcikpO1xuICAgIHJldHVybiBkYXRlVG9DaGVjay5pc1NhbWUobW9tZW50KCkuc2V0KHsgaG91cjogMCwgbWludXRlOiAwLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pKTtcbiAgfVxuXG4gIGRhdGVGcm9tTnVtKG51bTogbnVtYmVyLCByZWZlcmVuY2VEYXRlOiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IHJldHVybkRhdGUgPSBtb21lbnQocmVmZXJlbmNlRGF0ZSk7XG4gICAgcmV0dXJuIHJldHVybkRhdGUuZGF0ZShudW0pO1xuICB9XG5cbiAgcmVGb3JtYXRJbnB1dCA9ICgpID0+IHtcbiAgICB0aGlzLmNvbmNhdFZhbHVlSW5wdXQoKTtcbiAgICB0aGlzLmZvcm1hdElucHV0RGF0ZSA9ICh0aGlzLmluY2x1ZGVUaW1lKSA/ICdEIE1NTSwgWVlZWSBoOm1tIEEnIDogJ0QgTU1NLCBZWVlZJztcbiAgfTtcblxuICBzZWxlY3REYXkoZGF5OiBhbnkpIHtcbiAgICBpZiAoZGF5LmF2YWlsYWJsZSkge1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGUgPSB0aGlzLmRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKGRheS52YWx1ZSwgZGF5Lm1vbnRoLCBkYXkueWVhcik7XG4gICAgICBpZiAodGhpcy5pbmNsdWRlRW5kRGF0ZSkge1xuICAgICAgICBjb25zdCBjdXJyRGF0ZSA9IHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIoZGF5LnZhbHVlLCBkYXkubW9udGgsIGRheS55ZWFyKTtcbiAgICAgICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgaWYgKGN1cnJEYXRlLmlzU2FtZShtb21lbnQodGhpcy5zdGFydERhdGUpLnN0YXJ0T2YoJ2RheScpKSkge1xuICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAnc3RhcnQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyRGF0ZS5pc1NhbWVPckJlZm9yZSh0aGlzLnN0YXJ0RGF0ZSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5lbmREYXkgPSB0aGlzLnN0YXJ0RGF5O1xuICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gZGF5O1xuICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAnc3RhcnQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5lbmREYXkgPSBkYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdzdGFydCc6XG4gICAgICAgICAgICBpZiAoY3VyckRhdGUuaXNTYW1lKG1vbWVudCh0aGlzLmVuZERhdGUpLnN0YXJ0T2YoJ2RheScpKSkge1xuICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAnZW5kJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyckRhdGUuaXNTYW1lT3JBZnRlcih0aGlzLmVuZERhdGUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhcnREYXkgPSB0aGlzLmVuZERheTtcbiAgICAgICAgICAgICAgdGhpcy5lbmREYXkgPSBkYXk7XG4gICAgICAgICAgICAgIHRoaXMubW9kZSA9ICdlbmQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGFydERheSA9IGRheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5nZW5lcmF0ZURhdGUodGhpcy5zdGFydERheSwgdGhpcy5zdGFydERhdGUpO1xuICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLmdlbmVyYXRlRGF0ZSh0aGlzLmVuZERheSwgdGhpcy5lbmREYXRlKTtcbiAgICAgICAgdGhpcy5hcHBseVJhbmdlKCk7XG4gICAgICAgIHRoaXMuc3RhcnREYXkuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmVuZERheS5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB7XG4gICAgICAgICAgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZSxcbiAgICAgICAgICBlbmREYXRlOiB0aGlzLmVuZERhdGVcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVzZXRBY3Rpdml0eSgpO1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuc2VsZWN0ZWREYXRlO1xuICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gZGF5O1xuICAgICAgICB0aGlzLnN0YXJ0RGF5LmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHtcbiAgICAgICAgICBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZW1pdFNlbGVjdGVkLmVtaXQodGhpcy5zZWxlY3RlZCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XG4gICAgICAgIHRoaXMuZW1pdFNlbGVjdGVkLmVtaXQodGhpcy5zZWxlY3RlZCk7XG4gICAgICB9XG4gICAgICB0aGlzLnJlRm9ybWF0SW5wdXQoKTtcbiAgICB9XG4gIH1cblxuICBnZW5lcmF0ZURhdGUoZGF5OiBhbnksIGRhdGU6IGFueSkge1xuICAgIGxldCBnZW5lcmF0ZWREYXRlID0gdGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihkYXkudmFsdWUsIGRheS5tb250aCwgZGF5LnllYXIpO1xuICAgIGlmIChkYXRlKSB7XG4gICAgICBnZW5lcmF0ZWREYXRlID0gZ2VuZXJhdGVkRGF0ZS5zZXQoeyBob3VyOiBkYXRlLmhvdXIoKSwgbWludXRlOiBkYXRlLm1pbnV0ZSgpIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZ2VuZXJhdGVkRGF0ZTtcbiAgfVxuXG4gIHJlc2V0UmFuZ2UoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5ncmlkQXJyKS5mb3JFYWNoKHllYXIgPT4ge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5ncmlkQXJyW3llYXJdKS5mb3JFYWNoKG1vbnRoID0+IHtcbiAgICAgICAgdGhpcy5ncmlkQXJyW3llYXJdW21vbnRoXS5tYXAoZGF5ID0+IHtcbiAgICAgICAgICBkYXkuaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICAgIGRheS5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmVzZXRBY3Rpdml0eSgpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmdyaWRBcnIpLmZvckVhY2goeWVhciA9PiB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmdyaWRBcnJbeWVhcl0pLmZvckVhY2gobW9udGggPT4ge1xuICAgICAgICB0aGlzLmdyaWRBcnJbeWVhcl1bbW9udGhdLm1hcChkYXkgPT4ge1xuICAgICAgICAgIGRheS5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIoZGF5LCBtb250aCwgeWVhcikge1xuICAgIGxldCB0aW1lT2JqZWN0ID0geyBob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfTtcbiAgICBpZiAodGhpcy5pbmNsdWRlVGltZSkge1xuICAgICAgdGltZU9iamVjdCA9IHsgaG91cjogdGhpcy5zdGFydERhdGUuaG91cigpLCBtaW51dGU6IHRoaXMuc3RhcnREYXRlLm1pbnV0ZSgpLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH07XG4gICAgICB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ2g6bW0gQScpO1xuICAgIH1cbiAgICByZXR1cm4gbW9tZW50KFt5ZWFyLCBtb250aCwgZGF5XSkuc2V0KHRpbWVPYmplY3QpO1xuICB9XG5cbiAgYXBwbHlSYW5nZSgpIHtcbiAgICB0aGlzLmdldERpbWVuc2lvbnModGhpcy5zdGFydERhdGUpO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5pbml0aWFsRW1wdHlDZWxscyArIHRoaXMuc3RhcnREYXkudmFsdWUgLSAxO1xuICAgIGNvbnN0IHN0YXJ0TW9udGhMZW5ndGggPSB0aGlzLmFycmF5TGVuZ3RoO1xuICAgIHRoaXMuZ2V0RGltZW5zaW9ucyh0aGlzLmVuZERhdGUpO1xuICAgIGNvbnN0IGVuZE1vbnRoTGVuZ3RoID0gdGhpcy5hcnJheUxlbmd0aDtcbiAgICBjb25zdCBlbmQgPSB0aGlzLmluaXRpYWxFbXB0eUNlbGxzICsgdGhpcy5lbmREYXkudmFsdWUgLSAxO1xuICAgIHRoaXMucmVzZXRSYW5nZSgpO1xuICAgIGlmICh0aGlzLnN0YXJ0RGF5Lm1vbnRoICE9PSB0aGlzLmVuZERheS5tb250aCB8fCB0aGlzLnN0YXJ0RGF5LnllYXIgIT09IHRoaXMuZW5kRGF5LnllYXIpIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZ3JpZEFycikuZm9yRWFjaCh5ZWFyID0+IHtcbiAgICAgICAgY29uc3QgY2FsZW5kYXIgPSB0aGlzLmdyaWRBcnJbeWVhcl07XG4gICAgICAgIE9iamVjdC5rZXlzKGNhbGVuZGFyKS5mb3JFYWNoKG1vbnRoID0+IHtcbiAgICAgICAgICBjb25zdCBkYXlzID0gdGhpcy5ncmlkQXJyW3llYXJdW21vbnRoXTtcbiAgICAgICAgICBpZiAobW9udGggPT0gdGhpcy5zdGFydERheS5tb250aCAmJiB5ZWFyID09IHRoaXMuc3RhcnREYXkueWVhcikge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydDsgaSsrKSB7XG4gICAgICAgICAgICAgIGRheXNbaV0uaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgc3RhcnRNb250aExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGRheXNbaV0uaW5SYW5nZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChtb250aCA9PSB0aGlzLmVuZERheS5tb250aCAmJiB5ZWFyID09IHRoaXMuZW5kRGF5LnllYXIpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICAgIGRheXNbaV0uaW5SYW5nZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gZW5kICsgMTsgaSA8IGVuZE1vbnRoTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgZGF5c1tpXS5pblJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICgobW9udGggPiB0aGlzLnN0YXJ0RGF5Lm1vbnRoIHx8IHllYXIgPiB0aGlzLnN0YXJ0RGF5LnllYXIpICYmIChtb250aCA8IHRoaXMuZW5kRGF5Lm1vbnRoIHx8IHllYXIgPCB0aGlzLmVuZERheS55ZWFyKSkge1xuICAgICAgICAgICAgZGF5cy5mb3JFYWNoKGRheSA9PiBkYXkuaW5SYW5nZSA9IHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbW9udGggPSB0aGlzLnN0YXJ0RGF5Lm1vbnRoO1xuICAgICAgY29uc3QgeWVhciA9IHRoaXMuc3RhcnREYXkueWVhcjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhcnQ7IGkrKykge1xuICAgICAgICB0aGlzLmdyaWRBcnJbeWVhcl1bbW9udGhdW2ldLmluUmFuZ2UgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICB0aGlzLmdyaWRBcnJbeWVhcl1bbW9udGhdW2ldLmluUmFuZ2UgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IGVuZCArIDE7IGkgPCB0aGlzLmFycmF5TGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5ncmlkQXJyW3llYXJdW21vbnRoXVtpXS5pblJhbmdlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNBdmFpbGFibGVMb2dpYyhkYXRlVG9DaGVjazogYW55KSB7XG4gICAgaWYgKHRoaXMubWluRGF0ZSB8fCB0aGlzLm1heERhdGUpIHtcbiAgICAgIHJldHVybiAhKGRhdGVUb0NoZWNrLmlzQmVmb3JlKHRoaXMubWluRGF0ZSkgfHwgZGF0ZVRvQ2hlY2suaXNBZnRlcih0aGlzLm1heERhdGUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICFkYXRlVG9DaGVjay5pc0JlZm9yZShtb21lbnQoKSwgJ2RheScpO1xuICAgIH1cbiAgfVxuXG4gIGNhbkNoYW5nZU5hdk1vbnRoTG9naWMobnVtLCBjdXJyZW50RGF0ZSkge1xuICAgIGN1cnJlbnREYXRlLmFkZChudW0sICdtb250aCcpO1xuICAgIGNvbnN0IG1pbkRhdGUgPSB0aGlzLm1pbkRhdGUgPyB0aGlzLm1pbkRhdGUgOiBtb21lbnQoKS5hZGQoLTEsICdtb250aCcpO1xuICAgIGNvbnN0IG1heERhdGUgPSB0aGlzLm1heERhdGUgPyB0aGlzLm1heERhdGUgOiBtb21lbnQoKS5hZGQoMSwgJ3llYXInKTtcbiAgICByZXR1cm4gY3VycmVudERhdGUuaXNCZXR3ZWVuKG1pbkRhdGUsIG1heERhdGUpO1xuICB9XG5cbiAgdG9nZ2xlQ2FsZW5kYXIoKTogYW55IHtcbiAgICB0aGlzLmlzT3BlbiA9ICF0aGlzLmlzT3BlbjtcbiAgfVxuXG4gIG9wZW5DYWxlbmRhcigpOiBhbnkge1xuICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcbiAgfVxuXG4gIGNsb3NlQ2FsZW5kYXIoKTogYW55IHtcbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICB9XG5cbiAgY2hhbmdlTW9kZShtb2RlOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5yZXNldFJhbmdlKCk7XG4gICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoKTtcbiAgICB0aGlzLmVuZERhdGUgPSBudWxsO1xuICAgIHRoaXMubmF2RGF0ZSA9IHRoaXMudG9kYXlEYXRlO1xuICAgIHRoaXMuY3VycmVudE1vbnRoID0gdGhpcy5uYXZEYXRlLm1vbnRoKCk7XG4gICAgdGhpcy5jdXJyZW50WWVhciA9IHRoaXMubmF2RGF0ZS55ZWFyKCk7XG4gICAgdGhpcy5pbmNsdWRlRW5kRGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuaW5jbHVkZVRpbWUgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG51bGw7XG4gICAgdGhpcy5lbmRUaW1lID0gbnVsbDtcbiAgICB0aGlzLm1vZGUgPSAnc3RhcnQnO1xuICAgIHRoaXMubWFrZUdyaWQodGhpcy5jdXJyZW50WWVhciwgdGhpcy5jdXJyZW50TW9udGgpO1xuICB9XG5cbiAgc2V0VGltZShtb21lbnQsIGhvdXI6IG51bWJlciA9IDAsIG1pbnV0ZTogbnVtYmVyID0gMCkge1xuICAgIHJldHVybiBtb21lbnQuc2V0KHsgaG91ciwgbWludXRlLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICB9XG5cbiAgaGFuZGxlTW9kZUNoYW5nZSgpIHtcbiAgICB0aGlzLnJlc2V0UmFuZ2UoKTtcbiAgICB0aGlzLm1vZGUgPSAnZW5kJztcbiAgICBpZiAodGhpcy5zdGFydERheSkge1xuICAgICAgdGhpcy5zdGFydERheS5pc0FjdGl2ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmICghdGhpcy5pbmNsdWRlRW5kRGF0ZSkge1xuICAgICAgdGhpcy5lbmREYXRlID0gbnVsbDtcbiAgICAgIHRoaXMubW9kZSA9ICdzdGFydCc7XG4gICAgICB0aGlzLnN0YXJ0RGF5LmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLmVuZERheS5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0bXBTdGFydERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuICAgICAgY29uc3QgbmV4dERheSA9IHRtcFN0YXJ0RGF0ZS5hZGQoMiwgJ2RheXMnKS5mb3JtYXQoYFlZWVktJHt0bXBTdGFydERhdGUuZm9ybWF0KCdNJykgLSAxfS1EYCk7XG4gICAgICB0aGlzLnNpbXVsYXRlQ2xpY2sobmV4dERheSk7XG4gICAgfVxuXG4gIH1cblxuICBzaW11bGF0ZUNsaWNrID0gKGRhdGU6IHN0cmluZykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3QgZ2V0RGF5TmV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5jYWxlbmRhci1kYXktbm90LXJhbmdlLSR7ZGF0ZX0gPiBidXR0b25gKSBhcyBhbnk7XG4gICAgICAgIGlmIChnZXREYXlOZXh0KSB7XG4gICAgICAgICAgZ2V0RGF5TmV4dC5jbGljaygpO1xuICAgICAgICB9XG4gICAgICB9LCA1MCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIHNldFN0YXJ0VGltZSh0aW1lKSB7XG4gICAgdGhpcy5zdGFydFRpbWUgPSB0aW1lO1xuICB9XG5cbiAgc2V0RW5kVGltZSh0aW1lKSB7XG4gICAgdGhpcy5lbmRUaW1lID0gdGltZTtcbiAgfVxuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zaGFkb3dlZC12YXJpYWJsZVxuICBoYW5kbGVUaW1lQ2hhbmdlKHRpbWU6IGFueSwgbW9tZW50OiBhbnksIG1vZGU6IHN0cmluZykge1xuICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICAgIGlmICghdGltZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aW1lID0gdGltZS5yZXBsYWNlKC9bXmEtekEtWjAtOV0vZywgJycpO1xuICAgIG1vbWVudC5zZXQoeyBob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSk7XG4gICAgbGV0IGxhc3RUd28gPSB0aW1lLnN1YnN0cih0aW1lLmxlbmd0aCAtIDIpLnRvVXBwZXJDYXNlKCk7XG4gICAgbGV0IGxhc3QgPSB0aW1lLnN1YnN0cih0aW1lLmxlbmd0aCAtIDEpLnRvVXBwZXJDYXNlKCk7XG4gICAgY29uc3QgaGFzTGFzdFR3byA9IFsnQU0nLCAnUE0nXS5pbmNsdWRlcyhsYXN0VHdvKTtcbiAgICBjb25zdCBoYXNMYXN0ID0gWydBJywgJ1AnXS5pbmNsdWRlcyhsYXN0KTtcbiAgICBsZXQgaXNBbSA9IHRydWU7XG4gICAgbGV0IGlzUG0gPSBmYWxzZTtcbiAgICBpZiAoaGFzTGFzdCB8fCBoYXNMYXN0VHdvKSB7XG4gICAgICBpc0FtID0gbGFzdCA9PT0gJ0EnIHx8IGxhc3RUd28gPT09ICdBTSc7XG4gICAgICBpc1BtID0gbGFzdCA9PT0gJ1AnIHx8IGxhc3RUd28gPT09ICdQTSc7XG4gICAgfVxuICAgIHRpbWUgPSB0aW1lLnJlcGxhY2UoL1teMC05XS9nLCAnJyk7XG4gICAgbGFzdFR3byA9IHRpbWUuc3Vic3RyKHRpbWUubGVuZ3RoIC0gMik7XG4gICAgbGFzdCA9IHRpbWUuc3Vic3RyKHRpbWUubGVuZ3RoIC0gMSk7XG4gICAgdGltZSA9IHRpbWUuc3Vic3RyKDAsIDQpO1xuICAgIHRoaXMuaXNJbnZhbGlkID0gZmFsc2U7XG4gICAgc3dpdGNoICh0aW1lLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBtb21lbnRcbiAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZSkpIDpcbiAgICAgICAgICAgIHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lKSArIDEyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGlmIChsYXN0ID49IDYpIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRpbWUgPT09IDEyKSB7XG4gICAgICAgICAgbW9tZW50XG4gICAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCAwKSA6XG4gICAgICAgICAgICAgIHRoaXMuc2V0VGltZShtb21lbnQsIDEyKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aW1lIDwgMTIpIHtcbiAgICAgICAgICBtb21lbnRcbiAgICAgICAgICAgID0gaXNBbSA/IHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lKSkgOlxuICAgICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZSkgKyAxMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9tZW50XG4gICAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSksIE51bWJlcihsYXN0KSkgOlxuICAgICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSkgKyAxMiwgTnVtYmVyKGxhc3QpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaWYgKGxhc3RUd28gPj0gNjApIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9tZW50XG4gICAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSksIE51bWJlcihsYXN0VHdvKSkgOlxuICAgICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSkgKyAxMiwgTnVtYmVyKGxhc3RUd28pKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgaWYgKGxhc3RUd28gPj0gNjApIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbW9tZW50ID0gdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWUuc3Vic3RyKDAsIDIpKSwgTnVtYmVyKGxhc3RUd28pKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAobW9kZSA9PT0gJ3N0YXJ0Jykge1xuICAgICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQ7XG4gICAgICB0aGlzLnN0YXJ0VGltZVBpY2tlci5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbmREYXRlID0gbW9tZW50O1xuICAgICAgdGhpcy5lbmRUaW1lUGlja2VyLm5hdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=