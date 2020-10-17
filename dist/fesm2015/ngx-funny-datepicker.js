import { ɵɵdefineInjectable, Injectable, EventEmitter, Component, Output, Input, forwardRef, ChangeDetectorRef, ViewChild, Directive, ElementRef, HostListener, NgModule } from '@angular/core';
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
    constructor(cdr) {
        this.cdr = cdr;
        this.value = '';
        this.startDateChange = new EventEmitter();
        this.endDateChange = new EventEmitter();
        this.locale = 'en';
        this.rangeLabel = 'Range';
        this.timeLabel = 'Time';
        this.clearLabel = 'Clear';
        this.formatInputDate = 'D MMM, YYYY';
        this.formatInputTime = 'D MMM, YYYY HH:mm';
        this.emitSelected = new EventEmitter();
        this.weekDaysHeaderArr = [];
        this.dataMonths = {};
        this.canAccessPrevious = true;
        this.canAccessNext = true;
        this.todayDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        this.renderedFlag = true;
        this.mode = 'end';
        this.isInvalid = false;
        this.minInputHour = 0;
        this.maxInputHour = 23;
        this.valueInputHour = {
            start: {},
            end: {}
        };
        this.minInputMinute = 0;
        this.maxInputMinute = 59;
        this.valueInputMinute = {
            start: {},
            end: {}
        };
        this.onChange = (_) => {
        };
        this.onTouch = () => {
            this.onTouched = true;
        };
        /**
         *
         * @param num
         * @param mode
         */
        this.addOrSubHour = (num, mode) => {
            if (num > 0) {
                this.checkHourValidate((Number(this.valueInputHour[mode]) + 1), mode);
            }
            else {
                this.checkHourValidate((Number(this.valueInputHour[mode]) - 1), mode);
            }
        };
        this.addOrSubMinute = (num, mode) => {
            if (num > 0) {
                this.checkMinuteValidate((Number(this.valueInputMinute[mode]) + 1), mode);
            }
            else {
                this.checkMinuteValidate((Number(this.valueInputMinute[mode]) - 1), mode);
            }
        };
        this.checkHourValidate = ($event, mode) => {
            const toHour = (mode === 'start') ? 'start' : 'end';
            if (this.meridianTime) {
                this.valueInputHour[toHour] = $event;
                if ($event <= 12 && $event > 0) {
                    if (mode === 'start' && this.startDate && this.startDate.format('A') === 'PM') {
                        if ($event === 12) {
                            this.startDate.set({ hour: ($event), minute: this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                        }
                        else {
                            this.startDate.set({ hour: ($event + 12), minute: this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                        }
                    }
                    if (mode === 'start' && this.startDate && this.startDate.format('A') === 'AM') {
                        this.startDate.set({ hour: ($event), minute: this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                    }
                    if (mode === 'end' && this.endDate && this.endDate.format('A') === 'PM') {
                        if ($event === 12) {
                            this.endDate.set({ hour: ($event), minute: this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                        }
                        else {
                            this.endDate.set({ hour: ($event + 12), minute: this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                        }
                    }
                    if (mode === 'end' && this.endDate && this.endDate.format('A') === 'AM') {
                        this.endDate.set({ hour: ($event), minute: this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                    }
                    if (mode === 'start' && this.endDate && this.endDate.format('A') === 'PM') {
                        this.startDate.set({ hour: this.valueInputHour[toHour] + 12, minute: this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                    }
                }
            }
            else {
                if ($event >= 0 && $event <= 23) {
                    this.valueInputHour[toHour] = $event;
                    if (mode === 'end') {
                        this.endDate.set({ hour: ($event), minute: this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                    }
                    if (mode === 'start') {
                        this.startDate.set({ hour: this.valueInputHour[toHour], minute: this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                    }
                }
            }
            this.reFormatInput();
        };
        this.checkMinuteValidate = ($event, mode) => {
            const toHour = (mode === 'start') ? 'start' : 'end';
            this.valueInputMinute[toHour] = $event;
            if ($event < 0) {
                this.valueInputMinute[toHour] = 59;
            }
            else if ($event > 59) {
                this.valueInputMinute[toHour] = 0;
            }
            if (mode === 'start') {
                this.startDate.set({ minute: this.valueInputMinute[toHour], second: 0, millisecond: 0 });
            }
            if (mode === 'end') {
                this.endDate.set({ minute: this.valueInputMinute[toHour], second: 0, millisecond: 0 });
            }
            this.reFormatInput();
        };
        this.changeMeridianTime = (newMeridian, mode) => {
            const isStartOrEnd = (mode === 'start') ? 'startDate' : 'endDate';
            if (newMeridian === 'AM' && this[isStartOrEnd].hours() > 12) {
                this[isStartOrEnd].hours(this[isStartOrEnd].hours() - 12);
            }
            else if (newMeridian === 'PM' && this[isStartOrEnd].hours() <= 12) {
                this[isStartOrEnd].hours(this[isStartOrEnd].hours() + 12);
            }
            else if (newMeridian === 'AM' && this.startDate.hours() <= 12) {
                this[isStartOrEnd].hours(this[isStartOrEnd].hours() - 1);
            }
            if (mode === 'start') {
                this.valueInputHour[mode] = this[isStartOrEnd].hours(this[isStartOrEnd].hours()).format('hh');
            }
            if (mode === 'end') {
                this.valueInputHour[mode] = this[isStartOrEnd].hours(this[isStartOrEnd].hours()).format('hh');
            }
            this.reFormatInput();
        };
        /**
         * Concat values date to string format for show in input
         */
        this.concatValueInput = () => {
            const concatValue = [
                this.startDate.format(this.formatInputDate),
                (this.endDate && this.endDate.isValid()) ? '  -  ' : '',
                (this.endDate && this.endDate.isValid()) ? this.endDate.format(this.formatInputDate) : ''
            ];
            this.value = concatValue.join('');
            this.isInvalid = !(this.value.length);
            this.selected = {
                startDate: (this.startDate && this.startDate.isValid()) ? this.startDate.toDate() : null,
                endDate: (this.endDate && this.endDate.isValid()) ? this.endDate.toDate() : null
            };
        };
        this.generateAllGrid = () => {
            const dateObjectCurrent = moment().startOf('year').clone();
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(a => {
                this.makeGridCustom(dateObjectCurrent.year(), a);
            });
        };
        this.makeGridCustom = (year = null, month = null) => {
            /**
             * Fix
             */
            const dateOfTurn = moment(`${year}-${month}-01`, 'YYYY-M-DD');
            /**
             * Is OK
             */
            if (!this.dataMonths.hasOwnProperty(year)) {
                this.dataMonths[year] = {};
            }
            /**
             * Is OK
             */
            if (!this.dataMonths[year].hasOwnProperty(month)) {
                this.dataMonths[year][month] = [];
                /**
                 * Fix
                 */
                const firstDayDate = moment(dateOfTurn).startOf('month');
                const lastDayDate = moment(dateOfTurn).endOf('month');
                this.dataMonths[year][`initialEmptyCells${month}`] = firstDayDate.weekday();
                this.dataMonths[year][`lastEmptyCells${month}`] = 6 - lastDayDate.weekday();
                const initEmptyCell = this.dataMonths[year][`initialEmptyCells${month}`];
                const lastEmptyCell = this.dataMonths[year][`lastEmptyCells${month}`];
                this.dataMonths[year][`arrayLength${month}`] = initEmptyCell + lastEmptyCell + dateOfTurn.daysInMonth();
                const arrayLengths = this.dataMonths[year][`arrayLength${month}`];
                this.getDimensions(dateOfTurn);
                for (let i = 0; i < arrayLengths; i++) {
                    const obj = {};
                    if (i < initEmptyCell || i > initEmptyCell + dateOfTurn.daysInMonth() - 1) {
                        obj.value = 0;
                        obj.available = false;
                        obj.isToday = false;
                    }
                    else {
                        obj.value = i - initEmptyCell + 1;
                        obj.available = this.isAvailable(i - initEmptyCell + 1);
                        obj.isToday = this.isToday(i - initEmptyCell + 1, month, year);
                        obj.month = month;
                        obj.date = dateOfTurn;
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
                    this.dataMonths[year][month].push(obj);
                }
            }
        };
        this.reFormatInput = () => {
            this.formatInputDate = (this.includeTime) ? this.formatInputTime : this.formatInputDate;
            this.concatValueInput();
        };
    }
    get startDate() {
        return this._startDate;
    }
    set startDate(value) {
        if (this._startDate === value) {
            return;
        }
        this._startDate = moment(value);
        if (this._startDate.isValid()) {
            this.startDateChange.emit(this._startDate);
            this.reFormatInput();
        }
    }
    get endDate() {
        return this._endDate;
    }
    set endDate(value) {
        if (this._endDate === value) {
            return;
        }
        this._endDate = moment(value);
        if (this._endDate.isValid()) {
            this.endDateChange.emit(this._endDate);
            this.reFormatInput();
        }
    }
    ngAfterContentChecked() {
        this.cdr.detectChanges();
    }
    ngOnInit() {
        this.setOptions();
        this.makeHeader();
        /**
         * Set startDate and parse
         */
        this.navDate = moment();
        this.valueInputHour.start = this.navDate.format('hh');
        this.valueInputMinute.start = this.navDate.format('mm');
        this.valueInputMinute.end = this.navDate.format('mm');
        this.valueInputHour.end = this.navDate.format('hh');
        if (this.startDate && moment(this.startDate).isValid()) {
            this.startDate = moment(this.startDate);
            this.navDate = this.startDate;
            this.valueInputHour.start = this.startDate.format('hh');
            this.valueInputMinute.start = this.startDate.format('mm');
            const startDay = {
                month: Number(this.startDate.format('M')),
                year: this.startDate.year(),
                day: Number(this.startDate.format('DD'))
            };
            this.dataMonths[startDay.year][startDay.month].forEach(d => d.isActive = (d.value === startDay.day));
        }
        else {
            if (this.showInitialValue) {
                this.startDate = moment();
            }
        }
        /**
         * Set endDate and parse
         */
        if (this.endDate && moment(this.endDate).isValid()) {
            this.endDate = moment(this.endDate);
            this.navDate = this.endDate;
            this.valueInputMinute.end = this.endDate.format('mm');
            this.valueInputHour.end = this.endDate.format('hh');
            this.includeEndDate = true;
            const endDay = {
                month: Number(this.endDate.format('M')),
                year: this.endDate.year(),
                day: Number(this.endDate.format('DD'))
            };
            this.applyRange();
            const startDay = {
                month: Number(this.startDate.format('M')),
                year: this.startDate.year(),
                day: Number(this.startDate.format('DD'))
            };
            this.dataMonths[startDay.year][startDay.month].forEach(d => d.isActive = (d.value === startDay.day));
            this.dataMonths[endDay.year][endDay.month].forEach(d => {
                if (!d.isActive) {
                    d.isActive = (d.value === endDay.day);
                }
            });
        }
        else {
            this.endDate = null;
        }
        this.currentMonth = this.navDate.month();
        this.currentYear = this.navDate.year();
        if (!this.maxDate) {
            this.maxDate = this.navDate.clone().endOf('year').add(1, 'year');
        }
        if (!this.minDate) {
            this.minDate = this.navDate.clone().startOf('year').subtract(1, 'year');
        }
        // this.applyRange()
        if (this.showInitialValue) {
            this.concatValueInput();
        }
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
    setOptions() {
        moment.locale(this.locale);
        this.generateAllGrid();
        this.formatInputTime = (this.meridianTime) ? `D MMM, YYYY hh:mm A` : `D MMM, YYYY HH:mm`;
        // this.includeEndDate = false;
        // this.includeTime = false;
    }
    setAccess() {
        this.canAccessPrevious = this.canChangeNavMonth(-1);
        this.canAccessNext = this.canChangeNavMonth(1);
    }
    changeNavMonth(num, mode = 'next') {
        if (this.canChangeNavMonth(num)) {
            this.navDate.add(num, 'month');
            this.currentMonth = this.navDate.month() + 1;
            this.currentYear = this.navDate.year();
            this.makeGridCustom(this.currentYear, this.currentMonth);
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
                    startDate: this.startDate.toDate(),
                    endDate: this.endDate.toDate()
                };
            }
            else {
                this.resetActivity();
                this.startDate = this.selectedDate;
                this.startDay = day;
                this.startDay.isActive = true;
                this.selected = {
                    startDate: this.startDate.toDate(),
                    endDate: null
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
        Object.keys(this.dataMonths).forEach(year => {
            Object.keys(this.dataMonths[year]).forEach(month => {
                if (!isNaN(Number(month))) {
                    this.dataMonths[year][month].map(day => {
                        day.inRange = false;
                        day.isActive = false;
                    });
                }
            });
        });
    }
    resetActivity() {
        Object.keys(this.dataMonths).forEach(year => {
            Object.keys(this.dataMonths[year]).forEach(month => {
                if (!isNaN(Number(month))) {
                    this.dataMonths[year][month].map(day => {
                        day.isActive = false;
                    });
                }
            });
        });
    }
    dateFromDayAndMonthAndYear(day, month, year) {
        let timeObject = { hour: 0, minute: 0, second: 0, millisecond: 0 };
        if (this.includeTime) {
            timeObject = { hour: this.startDate.hour(), minute: this.startDate.minute(), second: 0, millisecond: 0 };
            this.startDate.format('h:mm A');
        }
        return moment(`${year}-${month}-${day}`, 'YYYY-M-DD').set(timeObject);
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
            Object.keys(this.dataMonths).forEach(year => {
                const calendar = this.dataMonths[year];
                Object.keys(calendar).forEach(month => {
                    if (!isNaN(Number(month))) {
                        const days = this.dataMonths[year][month];
                        if (Number(month) === Number(this.startDay.month) && Number(year) === Number(this.startDay.year)) {
                            for (let i = 0; i < start; i++) {
                                days[i].inRange = false;
                            }
                            for (let i = start; i < startMonthLength; i++) {
                                days[i].inRange = true;
                            }
                        }
                        else if (Number(month) === Number(this.endDay.month) && Number(year) === Number(this.endDay.year)) {
                            for (let i = 0; i <= end; i++) {
                                days[i].inRange = true;
                            }
                            for (let i = end + 1; i < endMonthLength; i++) {
                                days[i].inRange = false;
                            }
                        }
                        else if ((month > this.startDay.month || year > this.startDay.year)
                            && (month < this.endDay.month || year < this.endDay.year)) {
                            days.forEach(day => day.inRange = true);
                        }
                    }
                });
            });
        }
        else {
            const month = this.startDay.month;
            const year = this.startDay.year;
            for (let i = 0; i < start; i++) {
                this.dataMonths[year][month][i].inRange = false;
            }
            for (let i = start; i <= end; i++) {
                this.dataMonths[year][month][i].inRange = true;
            }
            for (let i = end + 1; i < this.arrayLength; i++) {
                this.dataMonths[year][month][i].inRange = false;
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
        this.reFormatInput();
    }
    openCalendar() {
        this.isOpen = true;
        this.onTouch();
    }
    closeCalendar() {
        this.isOpen = false;
        this.reFormatInput();
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
        this.makeGridCustom(this.currentYear, this.currentMonth);
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
            // const nextDay = tmpStartDate.add(2, 'days').format(`YYYY-${tmpStartDate.format('M') - 1}-D`);
            // this.simulateClick(nextDay, 'calendar-day-not-range');
        }
    }
    setStartTime(time) {
        this.startTime = time;
    }
    setEndTime(time) {
        this.endTime = time;
    }
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
                template: "<!-- ********* INPUT FROM DATE Collaborator https://github.com/leifermendez ***************** --->\n<input (click)=\"openCalendar()\" readonly spellcheck=\"false\" class=\"omit-trigger-outside input-date-funny {{classInput}}\"\n  autocomplete=\"nope\" [value]=\"value\" [disabled]=\"isDisabled\" (input)=\"onInput($event.target.value)\" [ngClass]=\"{\n    'date-picker-valid ng-valid': !isInvalid,\n     'date-picker-invalid ng-invalid': isInvalid,\n     'funny-range':includeEndDate,\n     'ng-opened': isOpen,\n     'ng-touched': onTouched,\n     'ng-untouched': !onTouched\n    }\" type=\"text\">\n\n<!--- *************** CALENDAR ELEMENTS Author https://github.com/mokshithpyla ************* --->\n<div (clickOutside)=\"closeCalendar()\" class=\"calendar\" *ngIf=\"isOpen\">\n  <!-- **** CALENDAR NAVIGATION ****-->\n  <div class=\"calendar-nav\">\n    <div class=\"calendar-nav-previous-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(-1)\" [disabled]=\"!canAccessPrevious\">\n        <i class=\"fa fa-chevron-left\"></i>\n      </button>\n    </div>\n    <div>{{navDate.format('MMMM YYYY')}}</div>\n    <div class=\"calendar-nav-next-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(1)\" [disabled]=\"!canAccessNext\">\n        <i class=\"fa fa-chevron-right\"></i>\n      </button>\n    </div>\n  </div>\n\n  <!--- **** CALENDAR CONTAINER ****-->\n\n  <div class=\"calendar-container\">\n    <div class=\"calendar-header\">\n      <div class=\"calendar-date\" *ngFor=\"let day of weekDaysHeaderArr\" [innerText]=\"day\"></div>\n    </div>\n    <div class=\"calendar-body\">\n      <!---**** LOAD TEMPLATE*** --->\n      <ng-container *ngTemplateOutlet=\"templateCalendar;context:{\n      data:dataMonths,\n      year:navDate.format('YYYY'),\n      month:navDate.format('M'),\n      includeEndDate:includeEndDate,\n      startDay:null,\n      endDate:null}\"></ng-container>\n    </div>\n\n    <div class=\"footer-calendar\">\n      <div class=\"flex justify-content-between options-bar divider\">\n        <div class=\"flex\">\n          <div class=\"label-placeholder label-option pr-25\">\n            <input type=\"checkbox\" [(ngModel)]=\"includeEndDate\" (change)=\"handleModeChange()\">\n            <small>{{rangeLabel}}</small>\n          </div>\n          <div class=\"label-placeholder label-option pr-25\">\n            <input\n              (change)=\"reFormatInput();handleTimeChange(startTime, startDate, 'start');handleTimeChange(endTime, endDate, 'end')\"\n              [(ngModel)]=\"includeTime\" type=\"checkbox\">\n            <small>{{timeLabel}}</small>\n          </div>\n        </div>\n        <div class=\"label-placeholder label-option pr-25\">\n          <div (click)=\"clear()\">{{clearLabel}}</div>\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\">\n\n        <div class=\"child\" *ngIf=\"startDate && startDate.isValid()\">\n          <div class=\"calendar-child-day\">{{startDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{startDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{startDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\" *ngIf=\"!startDate || !startDate.isValid()\">\n          <div class=\"calendar-child-day\">{{navDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{navDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{navDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <ng-container\n            *ngTemplateOutlet=\"templateTimeInput;context:{mode:'start',startDate:startDate,timeShow:includeTime}\">\n          </ng-container>\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\" *ngIf=\"includeEndDate\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{endDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{endDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{endDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <ng-container *ngTemplateOutlet=\"templateTimeInput;context:{mode:'end',endDate:endDate,timeShow:includeTime}\">\n          </ng-container>\n        </div>\n      </div>\n    </div>\n  </div>\n\n</div>\n\n<!--- ********** TEMPLATE BODY CALENDAR*************** -->\n<ng-template #templateCalendar let-data=\"data\" let-year=\"year\" let-includedend=\"includeEndDate\" let-month=\"month\"\n  let-start=\"startDay\" let-end=\"endDate\">\n  <ng-container *ngIf=\"includeEndDate\">\n    <div *ngFor=\"let day of data[year][month]\"\n      class=\"calendar-date calendar-day-not-range-{{year}}-{{month}}-{{day?.value}}\" [ngClass]=\"{\n          'is-disabled': !day?.available,\n          'calendar-range': day?.inRange,\n          'calendar-range-start': day?.value === start?.value && day?.month === start?.month && day?.year === start?.year ,\n          'calendar-range-end': day?.value === end?.value && day?.month === end?.month && day?.year === end?.year}\">\n      <button type=\"button\" *ngIf=\"day.value !== 0\" class=\"date-item\"\n        [ngClass]=\"{'is-active': day?.isActive, 'is-today': day?.isToday}\" (click)=\"selectDay(day)\">\n        {{day.value}}</button>\n      <button type=\"button\" *ngIf=\"day?.value === 0\" class=\"date-item\"></button>\n    </div>\n  </ng-container>\n\n  <ng-container *ngIf=\"!includeEndDate\">\n    <div *ngFor=\"let day of data[year][month]\" class=\"calendar-date\" [ngClass]=\"{'is-disabled': !day?.available }\">\n      <button *ngIf=\"day?.value !== 0\" class=\"date-item\" type=\"button\"\n        [ngClass]=\"{'is-active': day?.isActive, 'is-today': day?.isToday}\"\n        (click)=\"selectDay(day)\">{{day?.value}}</button>\n      <button type=\"button\" *ngIf=\"day?.value === 0\" class=\"date-item\"></button>\n    </div>\n  </ng-container>\n</ng-template>\n<!--- ********** TEMPLATE INPUT TIME*************** -->\n<ng-template #templateTimeInput let-mode=\"mode\" let-show=\"timeShow\" let-start=\"startDate\" let-end=\"endDate\">\n\n  <ng-container *ngIf=\"show\">\n    <div class=\"meridian-buttons\" *ngIf=\"meridianTime && mode === 'start'\">\n      <div>\n        <button (click)=\"changeMeridianTime('AM','start')\" [disabled]=\"startDate && startDate.format('A') === 'AM'\"\n          type=\"button\">AM\n        </button>\n      </div>\n      <div>\n        <button (click)=\"changeMeridianTime('PM','start')\" [disabled]=\"startDate && startDate.format('A') === 'PM'\"\n          type=\"button\">PM\n        </button>\n      </div>\n    </div>\n    <div class=\"meridian-buttons\" *ngIf=\"meridianTime && endDate && mode === 'end'\">\n      <div>\n        <button (click)=\"changeMeridianTime('AM','end')\" [disabled]=\"endDate && endDate.format('A') === 'AM'\"\n          type=\"button\">AM\n        </button>\n      </div>\n      <div>\n        <button (click)=\"changeMeridianTime('PM','end')\" [disabled]=\"endDate && endDate.format('A') === 'PM'\"\n          type=\"button\">PM\n        </button>\n      </div>\n    </div>\n    <div class=\"calendar-time-input-cells\" *ngIf=\"mode === 'start'\">\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkHourValidate($event,'start')\"\n          [max]=\"maxInputHour\" [min]=\"minInputHour\" [(ngModel)]=\"valueInputHour.start\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubHour(1,'start')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubHour(-1,'start')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkMinuteValidate($event,'start')\"\n          [max]=\"maxInputMinute\" [min]=\"minInputMinute\" [(ngModel)]=\"valueInputMinute.start\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubMinute(1,'start')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubMinute(-1,'start')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n    </div>\n    <div class=\"calendar-time-input-cells\" *ngIf=\"endDate && mode === 'end'\">\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkHourValidate($event,'end')\"\n          type=\"button\" [max]=\"maxInputHour\" [min]=\"minInputHour\" [(ngModel)]=\"valueInputHour.end\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubHour(1,'end')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubHour(-1,'end')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkMinuteValidate($event,'end')\"\n          [max]=\"maxInputMinute\" [min]=\"minInputMinute\" [(ngModel)]=\"valueInputMinute.end\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubMinute(1,'end')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubMinute(-1,'end')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n    </div>\n  </ng-container>\n\n</ng-template>\n",
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => DatepickerComponent),
                        multi: true
                    }
                ],
                styles: [":host .datetimepicker-footer{display:flex;flex:1;justify-content:space-evenly;margin:0}:host .datetimepicker-selection-start{align-items:center;background:rgba(242,241,238,.6);border-radius:3px;box-shadow:inset 0 0 0 1px rgba(15,15,15,.1),inset 0 1px 1px rgba(15,15,15,.1);display:flex;flex-basis:50%;flex-grow:1;font-size:14px;height:28px;line-height:1.2;padding-left:8px;padding-right:8px}:host .slider{background-color:#ccc;bottom:0;cursor:pointer;left:0;position:absolute;right:0;top:0;transition:.4s}:host .slider:before{background-color:#fff;bottom:4px;content:\"\";height:26px;left:4px;position:absolute;transition:.4s;width:26px}:host input:checked+.slider{background-color:#00d1b2}:host input:focus+.slider{box-shadow:0 0 1px #00d1b2}:host input:checked+.slider:before{transform:translateX(26px)}:host .slider.round{border-radius:34px}:host .slider.round:before{border-radius:50%}:host .pb10{padding-bottom:10px}:host .flex{display:flex}:host .w33p{width:33.33%}:host .align-right{text-align:right}:host .w56p{width:56.33%}:host.align-left{text-align:left}:host.pl10{padding-left:10px}:host.calendar-nav-next-month>button,:host .calendar-nav-previous-month>button{background-size:100%;height:25px}:host .calendar-nav>div{align-items:center;display:flex;height:25px}:host .calendar-time-input-cells{display:flex;justify-content:center;width:100%}:host .group-input-item{background:#f7f7f7;display:flex;height:34px;padding:2px}:host .group-input-item input{border:none;font-size:15px;text-align:center;width:30px}:host .meridian-buttons button{background:#f7f7f7;border:0;cursor:pointer;font-size:11px;padding:3px}:host .meridian-buttons div:first-child button{margin-bottom:2px}:host .meridian-buttons button:disabled,:host button[disabled]{background-color:#3b3b98;border:0 solid #fff;border-radius:1px;color:#fff}:host .group-input-item button{align-content:normal;align-items:center;background:#f7f7f7;border:1px solid #f7f7f7;cursor:pointer;display:flex;height:15px;justify-content:center;margin:0;padding:0;width:18px}:host .group-input-item button:hover{background-color:#d3d3d3}:host .group-input-item button.up-time:before{border-color:transparent transparent #303438;border-style:solid;border-width:0 4px 5px;content:\"\"}:host .group-input-item button.down-time:before{border-color:#303438 transparent transparent;border-style:solid;border-width:5px 4px 0;content:\"\"}:host .group-input-item>div{display:flex;flex-flow:column}:host input::-webkit-inner-spin-button,:host input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}:host input[type=number]{-moz-appearance:textfield}"]
            },] }
];
DatepickerComponent.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
DatepickerComponent.propDecorators = {
    value: [{ type: Input }],
    startTimePicker: [{ type: ViewChild, args: ['startTimePicker',] }],
    endTimePicker: [{ type: ViewChild, args: ['endTimePicker',] }],
    showInitialValue: [{ type: Input }],
    isRange: [{ type: Input }],
    hasTime: [{ type: Input }],
    startDate: [{ type: Input }],
    startDateChange: [{ type: Output }],
    endDate: [{ type: Input }],
    endDateChange: [{ type: Output }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    classInput: [{ type: Input }],
    locale: [{ type: Input }],
    rangeLabel: [{ type: Input }],
    timeLabel: [{ type: Input }],
    clearLabel: [{ type: Input }],
    includeEndDate: [{ type: Input }],
    meridianTime: [{ type: Input }],
    formatInputDate: [{ type: Input }],
    formatInputTime: [{ type: Input }],
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

class CheckInputDirective {
    constructor(el) {
        this.inputElement = el;
    }
    onKeyPress(event) {
        this.tmpValue = (this.inputElement.nativeElement.value.length > 2) ? 1 : this.inputElement.nativeElement.value;
        this.integerOnly(event);
    }
    onKeyUp(event) {
        this.checkLength(event);
    }
    checkLength(event) {
        const value = this.inputElement.nativeElement.value;
        if (!isNaN(value)) {
            if (value.toString().length > 2) {
                this.inputElement.nativeElement.value = this.tmpValue;
                event.preventDefault();
            }
        }
        else {
            event.preventDefault();
        }
    }
    integerOnly(event) {
        const e = event;
        if (e.key === 'Tab' || e.key === 'TAB') {
            return;
        }
        if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode === 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode === 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+V
            (e.keyCode === 86 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode === 88 && e.ctrlKey === true)) {
            // let it happen, don't do anything
            return;
        }
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1) {
            e.preventDefault();
        }
    }
}
CheckInputDirective.decorators = [
    { type: Directive, args: [{
                selector: '[libCheckInput]'
            },] }
];
CheckInputDirective.ctorParameters = () => [
    { type: ElementRef }
];
CheckInputDirective.propDecorators = {
    onKeyPress: [{ type: HostListener, args: ['keypress', ['$event'],] }],
    onKeyUp: [{ type: HostListener, args: ['keyup', ['$event'],] }]
};

class NgxFunnyDatepickerModule {
}
NgxFunnyDatepickerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgxFunnyDatepickerComponent, DatepickerComponent, OutSideDirective, CheckInputDirective],
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

export { DatepickerComponent, NgxFunnyDatepickerComponent, NgxFunnyDatepickerModule, NgxFunnyDatepickerService, OutSideDirective as ɵa, CheckInputDirective as ɵb };
//# sourceMappingURL=ngx-funny-datepicker.js.map
