import { ChangeDetectorRef } from '@angular/core';
import { Component, Input, Output, EventEmitter, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment_ from 'moment';
const moment = moment_;
export class DatepickerComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvTGVpZmVyL1dlYnN0b3JtUHJvamVjdHMvZXhhbXBsZS1saWIvcHJvamVjdHMvbmd4LWZ1bm55LWRhdGVwaWNrZXIvc3JjLyIsInNvdXJjZXMiOlsibGliL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWxELE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFjLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsSCxPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7QUFFbEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBY3ZCLE1BQU0sT0FBTyxtQkFBbUI7SUFzRzlCLFlBQW9CLEdBQXNCO1FBQXRCLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBckdqQyxVQUFLLEdBQVEsRUFBRSxDQUFDO1FBd0J6QixvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFtQjFDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUkvQixXQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2QsZUFBVSxHQUFHLE9BQU8sQ0FBQztRQUNyQixjQUFTLEdBQUcsTUFBTSxDQUFDO1FBQ25CLGVBQVUsR0FBRyxPQUFPLENBQUM7UUFHckIsb0JBQWUsR0FBRyxhQUFhLENBQUM7UUFDaEMsb0JBQWUsR0FBRyxtQkFBbUIsQ0FBQztRQUNyQyxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFHakQsc0JBQWlCLEdBQWtCLEVBQUUsQ0FBQztRQUN0QyxlQUFVLEdBQVEsRUFBRSxDQUFDO1FBRXJCLHNCQUFpQixH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QixDQUFDO3dCQUNsRCxLQUFLLEVBQUUsSUFBSTtxQkFDWjtpQkFDRjs7YUFDRjs7O1lBbkJRLGlCQUFpQjs7O29CQXFCdkIsS0FBSzs4QkFDTCxTQUFTLFNBQUMsaUJBQWlCOzRCQUMzQixTQUFTLFNBQUMsZUFBZTsrQkFDekIsS0FBSztzQkFDTCxLQUFLO3NCQUNMLEtBQUs7d0JBT0wsS0FBSzs4QkFXTCxNQUFNO3NCQVFOLEtBQUs7NEJBV0wsTUFBTTtzQkFFTixLQUFLO3NCQUNMLEtBQUs7eUJBQ0wsS0FBSztxQkFDTCxLQUFLO3lCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLOzZCQUNMLEtBQUs7MkJBQ0wsS0FBSzs4QkFDTCxLQUFLOzhCQUNMLEtBQUs7MkJBQ0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0NoZWNrZWQsIFJlbmRlcmVyMiwgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFmdGVyQ29udGVudENoZWNrZWQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0ICogYXMgbW9tZW50XyBmcm9tICdtb21lbnQnO1xuXG5jb25zdCBtb21lbnQgPSBtb21lbnRfO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZnVubnktZGF0ZXBpY2tlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9kYXRlcGlja2VyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZGF0ZXBpY2tlci5jb21wb25lbnQuY3NzJ10sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF0ZXBpY2tlckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlcGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgQWZ0ZXJDb250ZW50Q2hlY2tlZCB7XG4gIEBJbnB1dCgpIHZhbHVlOiBhbnkgPSAnJztcbiAgQFZpZXdDaGlsZCgnc3RhcnRUaW1lUGlja2VyJykgc3RhcnRUaW1lUGlja2VyOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdlbmRUaW1lUGlja2VyJykgZW5kVGltZVBpY2tlcjogRWxlbWVudFJlZjtcbiAgQElucHV0KCkgc2hvd0luaXRpYWxWYWx1ZTogYm9vbGVhbjtcbiAgQElucHV0KCkgaXNSYW5nZTogYm9vbGVhbjtcbiAgQElucHV0KCkgaGFzVGltZTogYm9vbGVhbjtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiB2YXJpYWJsZS1uYW1lXG4gIHB1YmxpYyBfc3RhcnREYXRlOiBhbnk7XG4gIGdldCBzdGFydERhdGUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnREYXRlO1xuXG4gIH1cbiAgQElucHV0KClcbiAgc2V0IHN0YXJ0RGF0ZSh2YWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuX3N0YXJ0RGF0ZSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fc3RhcnREYXRlID0gbW9tZW50KHZhbHVlKTtcbiAgICBpZiAodGhpcy5fc3RhcnREYXRlLmlzVmFsaWQoKSkge1xuICAgICAgdGhpcy5zdGFydERhdGVDaGFuZ2UuZW1pdCh0aGlzLl9zdGFydERhdGUpO1xuICAgICAgdGhpcy5yZUZvcm1hdElucHV0KCk7XG4gICAgfVxuICB9XG4gIEBPdXRwdXQoKVxuICBzdGFydERhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHZhcmlhYmxlLW5hbWVcbiAgcHVibGljIF9lbmREYXRlOiBhbnk7XG4gIGdldCBlbmREYXRlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuZERhdGU7XG4gIH1cbiAgQElucHV0KClcbiAgc2V0IGVuZERhdGUodmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLl9lbmREYXRlID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9lbmREYXRlID0gbW9tZW50KHZhbHVlKTtcbiAgICBpZiAodGhpcy5fZW5kRGF0ZS5pc1ZhbGlkKCkpIHtcbiAgICAgIHRoaXMuZW5kRGF0ZUNoYW5nZS5lbWl0KHRoaXMuX2VuZERhdGUpO1xuICAgICAgdGhpcy5yZUZvcm1hdElucHV0KCk7XG4gICAgfVxuICB9XG4gIEBPdXRwdXQoKVxuICBlbmREYXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBJbnB1dCgpIG1pbkRhdGU6IGFueTtcbiAgQElucHV0KCkgbWF4RGF0ZTogYW55O1xuICBASW5wdXQoKSBjbGFzc0lucHV0OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGxvY2FsZSA9ICdlbic7XG4gIEBJbnB1dCgpIHJhbmdlTGFiZWwgPSAnUmFuZ2UnO1xuICBASW5wdXQoKSB0aW1lTGFiZWwgPSAnVGltZSc7XG4gIEBJbnB1dCgpIGNsZWFyTGFiZWwgPSAnQ2xlYXInO1xuICBASW5wdXQoKSBpbmNsdWRlRW5kRGF0ZTogYm9vbGVhbjtcbiAgQElucHV0KCkgbWVyaWRpYW5UaW1lOiBib29sZWFuO1xuICBASW5wdXQoKSBmb3JtYXRJbnB1dERhdGUgPSAnRCBNTU0sIFlZWVknO1xuICBASW5wdXQoKSBmb3JtYXRJbnB1dFRpbWUgPSAnRCBNTU0sIFlZWVkgSEg6bW0nO1xuICBAT3V0cHV0KCkgZW1pdFNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIGlzT3BlbjogYm9vbGVhbjtcbiAgbmF2RGF0ZTogYW55O1xuICB3ZWVrRGF5c0hlYWRlckFycjogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBkYXRhTW9udGhzOiBhbnkgPSB7fTtcbiAgc2VsZWN0ZWREYXRlOiBhbnk7XG4gIGNhbkFjY2Vzc1ByZXZpb3VzID0gdHJ1ZTtcbiAgY2FuQWNjZXNzTmV4dCA9IHRydWU7XG4gIHRvZGF5RGF0ZSA9IG1vbWVudCgpLnNldCh7IGhvdXI6IDAsIG1pbnV0ZTogMCwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgc3RhcnREYXk6IGFueTtcbiAgZW5kRGF5OiBhbnk7XG4gIHJlbmRlcmVkRmxhZyA9IHRydWU7XG4gIG1vZGUgPSAnZW5kJztcbiAgaW5pdGlhbEVtcHR5Q2VsbHM6IG51bWJlcjtcbiAgbGFzdEVtcHR5Q2VsbHM6IG51bWJlcjtcbiAgYXJyYXlMZW5ndGg6IG51bWJlcjtcbiAgY3VycmVudE1vbnRoOiBudW1iZXI7XG4gIGN1cnJlbnRZZWFyOiBudW1iZXI7XG4gIHNlbGVjdGVkOiBhbnk7XG4gIHN0YXJ0VGltZTogYW55O1xuICBlbmRUaW1lOiBhbnk7XG4gIGlzSW52YWxpZCA9IGZhbHNlO1xuICBpbmNsdWRlVGltZTogYm9vbGVhbjtcbiAgbWluSW5wdXRIb3VyID0gMDtcbiAgbWF4SW5wdXRIb3VyID0gMjM7XG4gIHZhbHVlSW5wdXRIb3VyOiBhbnkgPSB7XG4gICAgc3RhcnQ6IHt9LFxuICAgIGVuZDoge31cbiAgfTtcbiAgbWluSW5wdXRNaW51dGUgPSAwO1xuICBtYXhJbnB1dE1pbnV0ZSA9IDU5O1xuICB2YWx1ZUlucHV0TWludXRlOiBhbnkgPSB7XG4gICAgc3RhcnQ6IHt9LFxuICAgIGVuZDoge31cbiAgfTtcbiAgLyoqXG4gICAqIENvbnRyb2xBY2Nlc3NvclxuICAgKi9cbiAgb25Ub3VjaGVkOiBib29sZWFuO1xuICBpc0Rpc2FibGVkOiBib29sZWFuO1xuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHtcbiAgfTtcbiAgb25Ub3VjaCA9ICgpID0+IHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IHRydWU7XG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmKSB7XG5cblxuICB9XG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpOiB2b2lkIHtcbiAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKClcbiAgfVxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnNldE9wdGlvbnMoKTtcbiAgICB0aGlzLm1ha2VIZWFkZXIoKTtcbiAgICAvKipcbiAgICAgKiBTZXQgc3RhcnREYXRlIGFuZCBwYXJzZVxuICAgICAqL1xuICAgIHRoaXMubmF2RGF0ZSA9IG1vbWVudCgpO1xuICAgIHRoaXMudmFsdWVJbnB1dEhvdXIuc3RhcnQgPSB0aGlzLm5hdkRhdGUuZm9ybWF0KCdoaCcpO1xuICAgIHRoaXMudmFsdWVJbnB1dE1pbnV0ZS5zdGFydCA9IHRoaXMubmF2RGF0ZS5mb3JtYXQoJ21tJyk7XG5cbiAgICB0aGlzLnZhbHVlSW5wdXRNaW51dGUuZW5kID0gdGhpcy5uYXZEYXRlLmZvcm1hdCgnbW0nKTtcbiAgICB0aGlzLnZhbHVlSW5wdXRIb3VyLmVuZCA9IHRoaXMubmF2RGF0ZS5mb3JtYXQoJ2hoJyk7XG5cbiAgICBpZiAodGhpcy5zdGFydERhdGUgJiYgbW9tZW50KHRoaXMuc3RhcnREYXRlKS5pc1ZhbGlkKCkpIHtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gbW9tZW50KHRoaXMuc3RhcnREYXRlKTtcbiAgICAgIHRoaXMubmF2RGF0ZSA9IHRoaXMuc3RhcnREYXRlO1xuICAgICAgdGhpcy52YWx1ZUlucHV0SG91ci5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnaGgnKTtcbiAgICAgIHRoaXMudmFsdWVJbnB1dE1pbnV0ZS5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnbW0nKTtcbiAgICAgIGNvbnN0IHN0YXJ0RGF5ID0ge1xuICAgICAgICBtb250aDogTnVtYmVyKHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnTScpKSxcbiAgICAgICAgeWVhcjogdGhpcy5zdGFydERhdGUueWVhcigpLFxuICAgICAgICBkYXk6IE51bWJlcih0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ0REJykpXG4gICAgICB9O1xuICAgICAgdGhpcy5kYXRhTW9udGhzW3N0YXJ0RGF5LnllYXJdW3N0YXJ0RGF5Lm1vbnRoXS5mb3JFYWNoKGQgPT4gZC5pc0FjdGl2ZSA9IChkLnZhbHVlID09PSBzdGFydERheS5kYXkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuc2hvd0luaXRpYWxWYWx1ZSkge1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBlbmREYXRlIGFuZCBwYXJzZVxuICAgICAqL1xuXG4gICAgaWYgKHRoaXMuZW5kRGF0ZSAmJiBtb21lbnQodGhpcy5lbmREYXRlKS5pc1ZhbGlkKCkpIHtcbiAgICAgIHRoaXMuZW5kRGF0ZSA9IG1vbWVudCh0aGlzLmVuZERhdGUpO1xuICAgICAgdGhpcy5uYXZEYXRlID0gdGhpcy5lbmREYXRlO1xuICAgICAgdGhpcy52YWx1ZUlucHV0TWludXRlLmVuZCA9IHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ21tJyk7XG4gICAgICB0aGlzLnZhbHVlSW5wdXRIb3VyLmVuZCA9IHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ2hoJyk7XG4gICAgICB0aGlzLmluY2x1ZGVFbmREYXRlID0gdHJ1ZTtcbiAgICAgIGNvbnN0IGVuZERheSA9IHtcbiAgICAgICAgbW9udGg6IE51bWJlcih0aGlzLmVuZERhdGUuZm9ybWF0KCdNJykpLFxuICAgICAgICB5ZWFyOiB0aGlzLmVuZERhdGUueWVhcigpLFxuICAgICAgICBkYXk6IE51bWJlcih0aGlzLmVuZERhdGUuZm9ybWF0KCdERCcpKVxuICAgICAgfTtcblxuICAgICAgdGhpcy5hcHBseVJhbmdlKCk7XG4gICAgICBjb25zdCBzdGFydERheSA9IHtcbiAgICAgICAgbW9udGg6IE51bWJlcih0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ00nKSksXG4gICAgICAgIHllYXI6IHRoaXMuc3RhcnREYXRlLnllYXIoKSxcbiAgICAgICAgZGF5OiBOdW1iZXIodGhpcy5zdGFydERhdGUuZm9ybWF0KCdERCcpKVxuICAgICAgfTtcbiAgICAgIHRoaXMuZGF0YU1vbnRoc1tzdGFydERheS55ZWFyXVtzdGFydERheS5tb250aF0uZm9yRWFjaChkID0+IGQuaXNBY3RpdmUgPSAoZC52YWx1ZSA9PT0gc3RhcnREYXkuZGF5KSk7XG4gICAgICB0aGlzLmRhdGFNb250aHNbZW5kRGF5LnllYXJdW2VuZERheS5tb250aF0uZm9yRWFjaChkID0+IHtcbiAgICAgICAgaWYgKCFkLmlzQWN0aXZlKSB7XG4gICAgICAgICAgZC5pc0FjdGl2ZSA9IChkLnZhbHVlID09PSBlbmREYXkuZGF5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW5kRGF0ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50TW9udGggPSB0aGlzLm5hdkRhdGUubW9udGgoKTtcbiAgICB0aGlzLmN1cnJlbnRZZWFyID0gdGhpcy5uYXZEYXRlLnllYXIoKTtcbiAgICBpZiAoIXRoaXMubWF4RGF0ZSkge1xuICAgICAgdGhpcy5tYXhEYXRlID0gdGhpcy5uYXZEYXRlLmNsb25lKCkuZW5kT2YoJ3llYXInKS5hZGQoMSwgJ3llYXInKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1pbkRhdGUpIHtcbiAgICAgIHRoaXMubWluRGF0ZSA9IHRoaXMubmF2RGF0ZS5jbG9uZSgpLnN0YXJ0T2YoJ3llYXInKS5zdWJ0cmFjdCgxLCAneWVhcicpO1xuICAgIH1cbiAgICAvLyB0aGlzLmFwcGx5UmFuZ2UoKVxuICAgIGlmICh0aGlzLnNob3dJbml0aWFsVmFsdWUpIHtcbiAgICAgIHRoaXMuY29uY2F0VmFsdWVJbnB1dCgpO1xuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIGNvbnRyb2xWYWx1ZUFjY2Vzc29yXG4gICAqL1xuICBvbklucHV0KHZhbHVlKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMub25Ub3VjaCgpO1xuICAgIHRoaXMub25DaGFuZ2UodGhpcy52YWx1ZSk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZSB8fCAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52YWx1ZSA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2ggPSBmbjtcbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuaXNEaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIG51bVxuICAgKiBAcGFyYW0gbW9kZVxuICAgKi9cbiAgYWRkT3JTdWJIb3VyID0gKG51bTogbnVtYmVyLCBtb2RlOiBzdHJpbmcpID0+IHtcbiAgICBpZiAobnVtID4gMCkge1xuICAgICAgdGhpcy5jaGVja0hvdXJWYWxpZGF0ZSgoTnVtYmVyKHRoaXMudmFsdWVJbnB1dEhvdXJbbW9kZV0pICsgMSksIG1vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNoZWNrSG91clZhbGlkYXRlKChOdW1iZXIodGhpcy52YWx1ZUlucHV0SG91clttb2RlXSkgLSAxKSwgbW9kZSk7XG4gICAgfVxuICB9O1xuXG4gIGFkZE9yU3ViTWludXRlID0gKG51bTogbnVtYmVyLCBtb2RlOiBzdHJpbmcpID0+IHtcbiAgICBpZiAobnVtID4gMCkge1xuICAgICAgdGhpcy5jaGVja01pbnV0ZVZhbGlkYXRlKChOdW1iZXIodGhpcy52YWx1ZUlucHV0TWludXRlW21vZGVdKSArIDEpLCBtb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jaGVja01pbnV0ZVZhbGlkYXRlKChOdW1iZXIodGhpcy52YWx1ZUlucHV0TWludXRlW21vZGVdKSAtIDEpLCBtb2RlKTtcbiAgICB9XG4gIH07XG5cbiAgY2hlY2tIb3VyVmFsaWRhdGUgPSAoJGV2ZW50LCBtb2RlKSA9PiB7XG4gICAgY29uc3QgdG9Ib3VyID0gKG1vZGUgPT09ICdzdGFydCcpID8gJ3N0YXJ0JyA6ICdlbmQnO1xuICAgIGlmICh0aGlzLm1lcmlkaWFuVGltZSkge1xuICAgICAgdGhpcy52YWx1ZUlucHV0SG91clt0b0hvdXJdID0gJGV2ZW50O1xuICAgICAgaWYgKCRldmVudCA8PSAxMiAmJiAkZXZlbnQgPiAwKSB7XG4gICAgICAgIGlmIChtb2RlID09PSAnc3RhcnQnICYmIHRoaXMuc3RhcnREYXRlICYmIHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnQScpID09PSAnUE0nKSB7XG4gICAgICAgICAgaWYgKCRldmVudCA9PT0gMTIpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlLnNldCh7IGhvdXI6ICgkZXZlbnQpLCBtaW51dGU6IHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5zZXQoeyBob3VyOiAoJGV2ZW50ICsgMTIpLCBtaW51dGU6IHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobW9kZSA9PT0gJ3N0YXJ0JyAmJiB0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ0EnKSA9PT0gJ0FNJykge1xuICAgICAgICAgIHRoaXMuc3RhcnREYXRlLnNldCh7IGhvdXI6ICgkZXZlbnQpLCBtaW51dGU6IHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vZGUgPT09ICdlbmQnICYmIHRoaXMuZW5kRGF0ZSAmJiB0aGlzLmVuZERhdGUuZm9ybWF0KCdBJykgPT09ICdQTScpIHtcbiAgICAgICAgICBpZiAoJGV2ZW50ID09PSAxMikge1xuICAgICAgICAgICAgdGhpcy5lbmREYXRlLnNldCh7IGhvdXI6ICgkZXZlbnQpLCBtaW51dGU6IHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVuZERhdGUuc2V0KHsgaG91cjogKCRldmVudCArIDEyKSwgbWludXRlOiB0aGlzLnZhbHVlSW5wdXRNaW51dGVbdG9Ib3VyXSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vZGUgPT09ICdlbmQnICYmIHRoaXMuZW5kRGF0ZSAmJiB0aGlzLmVuZERhdGUuZm9ybWF0KCdBJykgPT09ICdBTScpIHtcbiAgICAgICAgICB0aGlzLmVuZERhdGUuc2V0KHsgaG91cjogKCRldmVudCksIG1pbnV0ZTogdGhpcy52YWx1ZUlucHV0TWludXRlW3RvSG91cl0sIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vZGUgPT09ICdzdGFydCcgJiYgdGhpcy5lbmREYXRlICYmIHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ0EnKSA9PT0gJ1BNJykge1xuICAgICAgICAgIHRoaXMuc3RhcnREYXRlLnNldCh7IGhvdXI6IHRoaXMudmFsdWVJbnB1dEhvdXJbdG9Ib3VyXSArIDEyLCBtaW51dGU6IHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgkZXZlbnQgPj0gMCAmJiAkZXZlbnQgPD0gMjMpIHtcbiAgICAgICAgdGhpcy52YWx1ZUlucHV0SG91clt0b0hvdXJdID0gJGV2ZW50O1xuICAgICAgICBpZiAobW9kZSA9PT0gJ2VuZCcpIHtcbiAgICAgICAgICB0aGlzLmVuZERhdGUuc2V0KHsgaG91cjogKCRldmVudCksIG1pbnV0ZTogdGhpcy52YWx1ZUlucHV0TWludXRlW3RvSG91cl0sIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vZGUgPT09ICdzdGFydCcpIHtcbiAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5zZXQoeyBob3VyOiB0aGlzLnZhbHVlSW5wdXRIb3VyW3RvSG91cl0sIG1pbnV0ZTogdGhpcy52YWx1ZUlucHV0TWludXRlW3RvSG91cl0sIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnJlRm9ybWF0SW5wdXQoKTtcbiAgfTtcblxuICBjaGVja01pbnV0ZVZhbGlkYXRlID0gKCRldmVudCwgbW9kZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgdG9Ib3VyID0gKG1vZGUgPT09ICdzdGFydCcpID8gJ3N0YXJ0JyA6ICdlbmQnO1xuICAgIHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdID0gJGV2ZW50O1xuICAgIGlmICgkZXZlbnQgPCAwKSB7XG4gICAgICB0aGlzLnZhbHVlSW5wdXRNaW51dGVbdG9Ib3VyXSA9IDU5O1xuICAgIH0gZWxzZSBpZiAoJGV2ZW50ID4gNTkpIHtcbiAgICAgIHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdID0gMDtcbiAgICB9XG4gICAgaWYgKG1vZGUgPT09ICdzdGFydCcpIHtcbiAgICAgIHRoaXMuc3RhcnREYXRlLnNldCh7IG1pbnV0ZTogdGhpcy52YWx1ZUlucHV0TWludXRlW3RvSG91cl0sIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSk7XG4gICAgfVxuICAgIGlmIChtb2RlID09PSAnZW5kJykge1xuICAgICAgdGhpcy5lbmREYXRlLnNldCh7IG1pbnV0ZTogdGhpcy52YWx1ZUlucHV0TWludXRlW3RvSG91cl0sIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSk7XG4gICAgfVxuICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICB9O1xuXG4gIGNoYW5nZU1lcmlkaWFuVGltZSA9IChuZXdNZXJpZGlhbiwgbW9kZSkgPT4ge1xuICAgIGNvbnN0IGlzU3RhcnRPckVuZCA9IChtb2RlID09PSAnc3RhcnQnKSA/ICdzdGFydERhdGUnIDogJ2VuZERhdGUnO1xuICAgIGlmIChuZXdNZXJpZGlhbiA9PT0gJ0FNJyAmJiB0aGlzW2lzU3RhcnRPckVuZF0uaG91cnMoKSA+IDEyKSB7XG4gICAgICB0aGlzW2lzU3RhcnRPckVuZF0uaG91cnModGhpc1tpc1N0YXJ0T3JFbmRdLmhvdXJzKCkgLSAxMik7XG4gICAgfSBlbHNlIGlmIChuZXdNZXJpZGlhbiA9PT0gJ1BNJyAmJiB0aGlzW2lzU3RhcnRPckVuZF0uaG91cnMoKSA8PSAxMikge1xuICAgICAgdGhpc1tpc1N0YXJ0T3JFbmRdLmhvdXJzKHRoaXNbaXNTdGFydE9yRW5kXS5ob3VycygpICsgMTIpO1xuICAgIH0gZWxzZSBpZiAobmV3TWVyaWRpYW4gPT09ICdBTScgJiYgdGhpcy5zdGFydERhdGUuaG91cnMoKSA8PSAxMikge1xuICAgICAgdGhpc1tpc1N0YXJ0T3JFbmRdLmhvdXJzKHRoaXNbaXNTdGFydE9yRW5kXS5ob3VycygpIC0gMSk7XG4gICAgfVxuICAgIGlmIChtb2RlID09PSAnc3RhcnQnKSB7XG4gICAgICB0aGlzLnZhbHVlSW5wdXRIb3VyW21vZGVdID0gdGhpc1tpc1N0YXJ0T3JFbmRdLmhvdXJzKHRoaXNbaXNTdGFydE9yRW5kXS5ob3VycygpKS5mb3JtYXQoJ2hoJyk7XG4gICAgfVxuICAgIGlmIChtb2RlID09PSAnZW5kJykge1xuICAgICAgdGhpcy52YWx1ZUlucHV0SG91clttb2RlXSA9IHRoaXNbaXNTdGFydE9yRW5kXS5ob3Vycyh0aGlzW2lzU3RhcnRPckVuZF0uaG91cnMoKSkuZm9ybWF0KCdoaCcpO1xuICAgIH1cbiAgICB0aGlzLnJlRm9ybWF0SW5wdXQoKTtcbiAgfTtcblxuICBzZXRPcHRpb25zKCkge1xuICAgIG1vbWVudC5sb2NhbGUodGhpcy5sb2NhbGUpO1xuICAgIHRoaXMuZ2VuZXJhdGVBbGxHcmlkKCk7XG4gICAgdGhpcy5mb3JtYXRJbnB1dFRpbWUgPSAodGhpcy5tZXJpZGlhblRpbWUpID8gYEQgTU1NLCBZWVlZIGhoOm1tIEFgIDogYEQgTU1NLCBZWVlZIEhIOm1tYDtcbiAgICAvLyB0aGlzLmluY2x1ZGVFbmREYXRlID0gZmFsc2U7XG4gICAgLy8gdGhpcy5pbmNsdWRlVGltZSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmNhdCB2YWx1ZXMgZGF0ZSB0byBzdHJpbmcgZm9ybWF0IGZvciBzaG93IGluIGlucHV0XG4gICAqL1xuICBjb25jYXRWYWx1ZUlucHV0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGNvbmNhdFZhbHVlID0gW1xuICAgICAgdGhpcy5zdGFydERhdGUuZm9ybWF0KHRoaXMuZm9ybWF0SW5wdXREYXRlKSxcbiAgICAgICh0aGlzLmVuZERhdGUgJiYgdGhpcy5lbmREYXRlLmlzVmFsaWQoKSkgPyAnICAtICAnIDogJycsXG4gICAgICAodGhpcy5lbmREYXRlICYmIHRoaXMuZW5kRGF0ZS5pc1ZhbGlkKCkpID8gdGhpcy5lbmREYXRlLmZvcm1hdCh0aGlzLmZvcm1hdElucHV0RGF0ZSkgOiAnJ1xuICAgIF07XG4gICAgdGhpcy52YWx1ZSA9IGNvbmNhdFZhbHVlLmpvaW4oJycpO1xuICAgIHRoaXMuaXNJbnZhbGlkID0gISh0aGlzLnZhbHVlLmxlbmd0aCk7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHtcbiAgICAgIHN0YXJ0RGF0ZTogKHRoaXMuc3RhcnREYXRlICYmIHRoaXMuc3RhcnREYXRlLmlzVmFsaWQoKSkgPyB0aGlzLnN0YXJ0RGF0ZS50b0RhdGUoKSA6IG51bGwsXG4gICAgICBlbmREYXRlOiAodGhpcy5lbmREYXRlICYmIHRoaXMuZW5kRGF0ZS5pc1ZhbGlkKCkpID8gdGhpcy5lbmREYXRlLnRvRGF0ZSgpIDogbnVsbFxuICAgIH07XG4gIH07XG5cbiAgc2V0QWNjZXNzKCkge1xuICAgIHRoaXMuY2FuQWNjZXNzUHJldmlvdXMgPSB0aGlzLmNhbkNoYW5nZU5hdk1vbnRoKC0xKTtcbiAgICB0aGlzLmNhbkFjY2Vzc05leHQgPSB0aGlzLmNhbkNoYW5nZU5hdk1vbnRoKDEpO1xuICB9XG5cbiAgY2hhbmdlTmF2TW9udGgobnVtOiBudW1iZXIsIG1vZGUgPSAnbmV4dCcpIHtcbiAgICBpZiAodGhpcy5jYW5DaGFuZ2VOYXZNb250aChudW0pKSB7XG4gICAgICB0aGlzLm5hdkRhdGUuYWRkKG51bSwgJ21vbnRoJyk7XG4gICAgICB0aGlzLmN1cnJlbnRNb250aCA9IHRoaXMubmF2RGF0ZS5tb250aCgpICsgMTtcbiAgICAgIHRoaXMuY3VycmVudFllYXIgPSB0aGlzLm5hdkRhdGUueWVhcigpO1xuICAgICAgdGhpcy5tYWtlR3JpZEN1c3RvbSh0aGlzLmN1cnJlbnRZZWFyLCB0aGlzLmN1cnJlbnRNb250aCk7XG4gICAgfVxuICB9XG5cbiAgZ2VuZXJhdGVBbGxHcmlkID0gKCkgPT4ge1xuICAgIGNvbnN0IGRhdGVPYmplY3RDdXJyZW50ID0gbW9tZW50KCkuc3RhcnRPZigneWVhcicpLmNsb25lKCk7XG4gICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTJdLmZvckVhY2goYSA9PiB7XG4gICAgICB0aGlzLm1ha2VHcmlkQ3VzdG9tKGRhdGVPYmplY3RDdXJyZW50LnllYXIoKSwgYSk7XG4gICAgfSk7XG5cbiAgfTtcblxuICBjYW5DaGFuZ2VOYXZNb250aChudW06IG51bWJlcikge1xuICAgIGNvbnN0IGNsb25lZERhdGUgPSBtb21lbnQodGhpcy5uYXZEYXRlKTtcbiAgICByZXR1cm4gdGhpcy5jYW5DaGFuZ2VOYXZNb250aExvZ2ljKG51bSwgY2xvbmVkRGF0ZSk7XG4gIH1cblxuICBtYWtlSGVhZGVyKCkge1xuICAgIGNvbnN0IHdlZWtEYXlzQXJyOiBBcnJheTxudW1iZXI+ID0gWzAsIDEsIDIsIDMsIDQsIDUsIDZdO1xuICAgIHdlZWtEYXlzQXJyLmZvckVhY2goZGF5ID0+IHRoaXMud2Vla0RheXNIZWFkZXJBcnIucHVzaChtb21lbnQoKS53ZWVrZGF5KGRheSkuZm9ybWF0KCdkZGQnKSkpO1xuICB9XG5cbiAgZ2V0RGltZW5zaW9ucyhkYXRlOiBhbnkpIHtcbiAgICBjb25zdCBmaXJzdERheURhdGUgPSBtb21lbnQoZGF0ZSkuc3RhcnRPZignbW9udGgnKTtcbiAgICB0aGlzLmluaXRpYWxFbXB0eUNlbGxzID0gZmlyc3REYXlEYXRlLndlZWtkYXkoKTtcbiAgICBjb25zdCBsYXN0RGF5RGF0ZSA9IG1vbWVudChkYXRlKS5lbmRPZignbW9udGgnKTtcbiAgICB0aGlzLmxhc3RFbXB0eUNlbGxzID0gNiAtIGxhc3REYXlEYXRlLndlZWtkYXkoKTtcbiAgICB0aGlzLmFycmF5TGVuZ3RoID0gdGhpcy5pbml0aWFsRW1wdHlDZWxscyArIHRoaXMubGFzdEVtcHR5Q2VsbHMgKyBkYXRlLmRheXNJbk1vbnRoKCk7XG4gIH1cblxuICBtYWtlR3JpZEN1c3RvbSA9ICh5ZWFyID0gbnVsbCwgbW9udGggPSBudWxsKSA9PiB7XG4gICAgLyoqXG4gICAgICogRml4XG4gICAgICovXG5cbiAgICBjb25zdCBkYXRlT2ZUdXJuID0gbW9tZW50KGAke3llYXJ9LSR7bW9udGh9LTAxYCwgJ1lZWVktTS1ERCcpO1xuXG4gICAgLyoqXG4gICAgICogSXMgT0tcbiAgICAgKi9cbiAgICBpZiAoIXRoaXMuZGF0YU1vbnRocy5oYXNPd25Qcm9wZXJ0eSh5ZWFyKSkge1xuICAgICAgdGhpcy5kYXRhTW9udGhzW3llYXJdID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSXMgT0tcbiAgICAgKi9cbiAgICBpZiAoIXRoaXMuZGF0YU1vbnRoc1t5ZWFyXS5oYXNPd25Qcm9wZXJ0eShtb250aCkpIHtcbiAgICAgIHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVttb250aF0gPSBbXTtcblxuICAgICAgLyoqXG4gICAgICAgKiBGaXhcbiAgICAgICAqL1xuXG4gICAgICBjb25zdCBmaXJzdERheURhdGUgPSBtb21lbnQoZGF0ZU9mVHVybikuc3RhcnRPZignbW9udGgnKTtcbiAgICAgIGNvbnN0IGxhc3REYXlEYXRlID0gbW9tZW50KGRhdGVPZlR1cm4pLmVuZE9mKCdtb250aCcpO1xuICAgICAgdGhpcy5kYXRhTW9udGhzW3llYXJdW2Bpbml0aWFsRW1wdHlDZWxscyR7bW9udGh9YF0gPSBmaXJzdERheURhdGUud2Vla2RheSgpO1xuICAgICAgdGhpcy5kYXRhTW9udGhzW3llYXJdW2BsYXN0RW1wdHlDZWxscyR7bW9udGh9YF0gPSA2IC0gbGFzdERheURhdGUud2Vla2RheSgpO1xuXG4gICAgICBjb25zdCBpbml0RW1wdHlDZWxsID0gdGhpcy5kYXRhTW9udGhzW3llYXJdW2Bpbml0aWFsRW1wdHlDZWxscyR7bW9udGh9YF07XG4gICAgICBjb25zdCBsYXN0RW1wdHlDZWxsID0gdGhpcy5kYXRhTW9udGhzW3llYXJdW2BsYXN0RW1wdHlDZWxscyR7bW9udGh9YF07XG5cbiAgICAgIHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVtgYXJyYXlMZW5ndGgke21vbnRofWBdID0gaW5pdEVtcHR5Q2VsbCArIGxhc3RFbXB0eUNlbGwgKyBkYXRlT2ZUdXJuLmRheXNJbk1vbnRoKCk7XG5cbiAgICAgIGNvbnN0IGFycmF5TGVuZ3RocyA9IHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVtgYXJyYXlMZW5ndGgke21vbnRofWBdO1xuXG4gICAgICB0aGlzLmdldERpbWVuc2lvbnMoZGF0ZU9mVHVybik7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5TGVuZ3RoczsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9iajogYW55ID0ge307XG4gICAgICAgIGlmIChpIDwgaW5pdEVtcHR5Q2VsbCB8fCBpID4gaW5pdEVtcHR5Q2VsbCArIGRhdGVPZlR1cm4uZGF5c0luTW9udGgoKSAtIDEpIHtcbiAgICAgICAgICBvYmoudmFsdWUgPSAwO1xuICAgICAgICAgIG9iai5hdmFpbGFibGUgPSBmYWxzZTtcbiAgICAgICAgICBvYmouaXNUb2RheSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9iai52YWx1ZSA9IGkgLSBpbml0RW1wdHlDZWxsICsgMTtcbiAgICAgICAgICBvYmouYXZhaWxhYmxlID0gdGhpcy5pc0F2YWlsYWJsZShpIC0gaW5pdEVtcHR5Q2VsbCArIDEpO1xuICAgICAgICAgIG9iai5pc1RvZGF5ID0gdGhpcy5pc1RvZGF5KGkgLSBpbml0RW1wdHlDZWxsICsgMSwgbW9udGgsIHllYXIpO1xuICAgICAgICAgIG9iai5tb250aCA9IG1vbnRoO1xuICAgICAgICAgIG9iai5kYXRlID0gZGF0ZU9mVHVybjtcbiAgICAgICAgICBvYmoueWVhciA9IHllYXI7XG4gICAgICAgICAgb2JqLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIob2JqLnZhbHVlLCBtb250aCwgeWVhcikuaXNTYW1lKHRoaXMuc3RhcnREYXRlKSkge1xuICAgICAgICAgICAgdGhpcy5zdGFydERheSA9IG9iajtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIob2JqLnZhbHVlLCBtb250aCwgeWVhcikuaXNTYW1lKHRoaXMuZW5kRGF0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kRGF5ID0gb2JqO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAob2JqLmlzVG9kYXkgJiYgIXRoaXMuc3RhcnREYXkgJiYgIXRoaXMuZW5kRGF5KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gb2JqO1xuICAgICAgICAgICAgdGhpcy5lbmREYXkgPSBvYmo7XG4gICAgICAgICAgICBvYmouaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvYmouaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRhdGFNb250aHNbeWVhcl1bbW9udGhdLnB1c2gob2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgaXNBdmFpbGFibGUobnVtOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCBkYXRlVG9DaGVjayA9IHRoaXMuZGF0ZUZyb21OdW0obnVtLCB0aGlzLm5hdkRhdGUpO1xuICAgIHJldHVybiB0aGlzLmlzQXZhaWxhYmxlTG9naWMoZGF0ZVRvQ2hlY2spO1xuICB9XG5cbiAgaXNUb2RheShudW06IG51bWJlciwgbW9udGg6IG51bWJlciwgeWVhcjogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZGF0ZVRvQ2hlY2sgPSBtb21lbnQodGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihudW0sIG1vbnRoLCB5ZWFyKSk7XG4gICAgcmV0dXJuIGRhdGVUb0NoZWNrLmlzU2FtZShtb21lbnQoKS5zZXQoeyBob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSkpO1xuICB9XG5cbiAgZGF0ZUZyb21OdW0obnVtOiBudW1iZXIsIHJlZmVyZW5jZURhdGU6IGFueSk6IGFueSB7XG4gICAgY29uc3QgcmV0dXJuRGF0ZSA9IG1vbWVudChyZWZlcmVuY2VEYXRlKTtcbiAgICByZXR1cm4gcmV0dXJuRGF0ZS5kYXRlKG51bSk7XG4gIH1cblxuICByZUZvcm1hdElucHV0ID0gKCkgPT4ge1xuICAgIHRoaXMuZm9ybWF0SW5wdXREYXRlID0gKHRoaXMuaW5jbHVkZVRpbWUpID8gdGhpcy5mb3JtYXRJbnB1dFRpbWUgOiB0aGlzLmZvcm1hdElucHV0RGF0ZTtcbiAgICB0aGlzLmNvbmNhdFZhbHVlSW5wdXQoKTtcbiAgfTtcblxuICBzZWxlY3REYXkoZGF5OiBhbnkpIHtcbiAgICBpZiAoZGF5LmF2YWlsYWJsZSkge1xuICAgICAgdGhpcy5zZWxlY3RlZERhdGUgPSB0aGlzLmRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKGRheS52YWx1ZSwgZGF5Lm1vbnRoLCBkYXkueWVhcik7XG4gICAgICBpZiAodGhpcy5pbmNsdWRlRW5kRGF0ZSkge1xuICAgICAgICBjb25zdCBjdXJyRGF0ZSA9IHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIoZGF5LnZhbHVlLCBkYXkubW9udGgsIGRheS55ZWFyKTtcbiAgICAgICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgaWYgKGN1cnJEYXRlLmlzU2FtZShtb21lbnQodGhpcy5zdGFydERhdGUpLnN0YXJ0T2YoJ2RheScpKSkge1xuICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAnc3RhcnQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyRGF0ZS5pc1NhbWVPckJlZm9yZSh0aGlzLnN0YXJ0RGF0ZSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5lbmREYXkgPSB0aGlzLnN0YXJ0RGF5O1xuICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gZGF5O1xuICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAnc3RhcnQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5lbmREYXkgPSBkYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdzdGFydCc6XG4gICAgICAgICAgICBpZiAoY3VyckRhdGUuaXNTYW1lKG1vbWVudCh0aGlzLmVuZERhdGUpLnN0YXJ0T2YoJ2RheScpKSkge1xuICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAnZW5kJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyckRhdGUuaXNTYW1lT3JBZnRlcih0aGlzLmVuZERhdGUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhcnREYXkgPSB0aGlzLmVuZERheTtcbiAgICAgICAgICAgICAgdGhpcy5lbmREYXkgPSBkYXk7XG4gICAgICAgICAgICAgIHRoaXMubW9kZSA9ICdlbmQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGFydERheSA9IGRheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLmdlbmVyYXRlRGF0ZSh0aGlzLnN0YXJ0RGF5LCB0aGlzLnN0YXJ0RGF0ZSk7XG4gICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuZ2VuZXJhdGVEYXRlKHRoaXMuZW5kRGF5LCB0aGlzLmVuZERhdGUpO1xuICAgICAgICB0aGlzLmFwcGx5UmFuZ2UoKTtcbiAgICAgICAgdGhpcy5zdGFydERheS5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuZW5kRGF5LmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHtcbiAgICAgICAgICBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlLnRvRGF0ZSgpLFxuICAgICAgICAgIGVuZERhdGU6IHRoaXMuZW5kRGF0ZS50b0RhdGUoKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZXNldEFjdGl2aXR5KCk7XG5cbiAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLnNlbGVjdGVkRGF0ZTtcbiAgICAgICAgdGhpcy5zdGFydERheSA9IGRheTtcbiAgICAgICAgdGhpcy5zdGFydERheS5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB7XG4gICAgICAgICAgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZS50b0RhdGUoKSxcbiAgICAgICAgICBlbmREYXRlOiBudWxsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZW1pdFNlbGVjdGVkLmVtaXQodGhpcy5zZWxlY3RlZCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XG4gICAgICAgIHRoaXMuZW1pdFNlbGVjdGVkLmVtaXQodGhpcy5zZWxlY3RlZCk7XG4gICAgICB9XG4gICAgICB0aGlzLnJlRm9ybWF0SW5wdXQoKTtcbiAgICB9XG4gIH1cblxuICBnZW5lcmF0ZURhdGUoZGF5OiBhbnksIGRhdGU6IGFueSkge1xuICAgIGxldCBnZW5lcmF0ZWREYXRlID0gdGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihkYXkudmFsdWUsIGRheS5tb250aCwgZGF5LnllYXIpO1xuICAgIGlmIChkYXRlKSB7XG4gICAgICBnZW5lcmF0ZWREYXRlID0gZ2VuZXJhdGVkRGF0ZS5zZXQoeyBob3VyOiBkYXRlLmhvdXIoKSwgbWludXRlOiBkYXRlLm1pbnV0ZSgpIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZ2VuZXJhdGVkRGF0ZTtcbiAgfVxuXG4gIHJlc2V0UmFuZ2UoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5kYXRhTW9udGhzKS5mb3JFYWNoKHllYXIgPT4ge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5kYXRhTW9udGhzW3llYXJdKS5mb3JFYWNoKG1vbnRoID0+IHtcbiAgICAgICAgaWYgKCFpc05hTihOdW1iZXIobW9udGgpKSkge1xuICAgICAgICAgIHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVttb250aF0ubWFwKGRheSA9PiB7XG4gICAgICAgICAgICBkYXkuaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgZGF5LmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXNldEFjdGl2aXR5KCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZGF0YU1vbnRocykuZm9yRWFjaCh5ZWFyID0+IHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZGF0YU1vbnRoc1t5ZWFyXSkuZm9yRWFjaChtb250aCA9PiB7XG4gICAgICAgIGlmICghaXNOYU4oTnVtYmVyKG1vbnRoKSkpIHtcbiAgICAgICAgICB0aGlzLmRhdGFNb250aHNbeWVhcl1bbW9udGhdLm1hcChkYXkgPT4ge1xuICAgICAgICAgICAgZGF5LmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIoZGF5LCBtb250aCwgeWVhcikge1xuICAgIGxldCB0aW1lT2JqZWN0ID0geyBob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfTtcbiAgICBpZiAodGhpcy5pbmNsdWRlVGltZSkge1xuICAgICAgdGltZU9iamVjdCA9IHsgaG91cjogdGhpcy5zdGFydERhdGUuaG91cigpLCBtaW51dGU6IHRoaXMuc3RhcnREYXRlLm1pbnV0ZSgpLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH07XG4gICAgICB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ2g6bW0gQScpO1xuICAgIH1cbiAgICByZXR1cm4gbW9tZW50KGAke3llYXJ9LSR7bW9udGh9LSR7ZGF5fWAsICdZWVlZLU0tREQnKS5zZXQodGltZU9iamVjdCk7XG4gIH1cblxuICBhcHBseVJhbmdlKCkge1xuICAgIHRoaXMuZ2V0RGltZW5zaW9ucyh0aGlzLnN0YXJ0RGF0ZSk7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmluaXRpYWxFbXB0eUNlbGxzICsgdGhpcy5zdGFydERheS52YWx1ZSAtIDE7XG4gICAgY29uc3Qgc3RhcnRNb250aExlbmd0aCA9IHRoaXMuYXJyYXlMZW5ndGg7XG4gICAgdGhpcy5nZXREaW1lbnNpb25zKHRoaXMuZW5kRGF0ZSk7XG4gICAgY29uc3QgZW5kTW9udGhMZW5ndGggPSB0aGlzLmFycmF5TGVuZ3RoO1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgKyB0aGlzLmVuZERheS52YWx1ZSAtIDE7XG4gICAgdGhpcy5yZXNldFJhbmdlKCk7XG4gICAgaWYgKHRoaXMuc3RhcnREYXkubW9udGggIT09IHRoaXMuZW5kRGF5Lm1vbnRoIHx8IHRoaXMuc3RhcnREYXkueWVhciAhPT0gdGhpcy5lbmREYXkueWVhcikge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5kYXRhTW9udGhzKS5mb3JFYWNoKHllYXIgPT4ge1xuICAgICAgICBjb25zdCBjYWxlbmRhciA9IHRoaXMuZGF0YU1vbnRoc1t5ZWFyXTtcbiAgICAgICAgT2JqZWN0LmtleXMoY2FsZW5kYXIpLmZvckVhY2gobW9udGggPT4ge1xuICAgICAgICAgIGlmICghaXNOYU4oTnVtYmVyKG1vbnRoKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGRheXMgPSB0aGlzLmRhdGFNb250aHNbeWVhcl1bbW9udGhdO1xuICAgICAgICAgICAgaWYgKE51bWJlcihtb250aCkgPT09IE51bWJlcih0aGlzLnN0YXJ0RGF5Lm1vbnRoKSAmJiBOdW1iZXIoeWVhcikgPT09IE51bWJlcih0aGlzLnN0YXJ0RGF5LnllYXIpKSB7XG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhcnQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGRheXNbaV0uaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IHN0YXJ0TW9udGhMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGRheXNbaV0uaW5SYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoTnVtYmVyKG1vbnRoKSA9PT0gTnVtYmVyKHRoaXMuZW5kRGF5Lm1vbnRoKSAmJiBOdW1iZXIoeWVhcikgPT09IE51bWJlcih0aGlzLmVuZERheS55ZWFyKSkge1xuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICAgICAgICAgIGRheXNbaV0uaW5SYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGVuZCArIDE7IGkgPCBlbmRNb250aExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF5c1tpXS5pblJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKG1vbnRoID4gdGhpcy5zdGFydERheS5tb250aCB8fCB5ZWFyID4gdGhpcy5zdGFydERheS55ZWFyKVxuICAgICAgICAgICAgICAmJiAobW9udGggPCB0aGlzLmVuZERheS5tb250aCB8fCB5ZWFyIDwgdGhpcy5lbmREYXkueWVhcikpIHtcbiAgICAgICAgICAgICAgZGF5cy5mb3JFYWNoKGRheSA9PiBkYXkuaW5SYW5nZSA9IHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbW9udGggPSB0aGlzLnN0YXJ0RGF5Lm1vbnRoO1xuICAgICAgY29uc3QgeWVhciA9IHRoaXMuc3RhcnREYXkueWVhcjtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhcnQ7IGkrKykge1xuICAgICAgICB0aGlzLmRhdGFNb250aHNbeWVhcl1bbW9udGhdW2ldLmluUmFuZ2UgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICB0aGlzLmRhdGFNb250aHNbeWVhcl1bbW9udGhdW2ldLmluUmFuZ2UgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IGVuZCArIDE7IGkgPCB0aGlzLmFycmF5TGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5kYXRhTW9udGhzW3llYXJdW21vbnRoXVtpXS5pblJhbmdlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNBdmFpbGFibGVMb2dpYyhkYXRlVG9DaGVjazogYW55KSB7XG4gICAgaWYgKHRoaXMubWluRGF0ZSB8fCB0aGlzLm1heERhdGUpIHtcbiAgICAgIHJldHVybiAhKGRhdGVUb0NoZWNrLmlzQmVmb3JlKHRoaXMubWluRGF0ZSkgfHwgZGF0ZVRvQ2hlY2suaXNBZnRlcih0aGlzLm1heERhdGUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICFkYXRlVG9DaGVjay5pc0JlZm9yZShtb21lbnQoKSwgJ2RheScpO1xuICAgIH1cbiAgfVxuXG4gIGNhbkNoYW5nZU5hdk1vbnRoTG9naWMobnVtLCBjdXJyZW50RGF0ZSkge1xuICAgIGN1cnJlbnREYXRlLmFkZChudW0sICdtb250aCcpO1xuICAgIGNvbnN0IG1pbkRhdGUgPSB0aGlzLm1pbkRhdGUgPyB0aGlzLm1pbkRhdGUgOiBtb21lbnQoKS5hZGQoLTEsICdtb250aCcpO1xuICAgIGNvbnN0IG1heERhdGUgPSB0aGlzLm1heERhdGUgPyB0aGlzLm1heERhdGUgOiBtb21lbnQoKS5hZGQoMSwgJ3llYXInKTtcbiAgICByZXR1cm4gY3VycmVudERhdGUuaXNCZXR3ZWVuKG1pbkRhdGUsIG1heERhdGUpO1xuICB9XG5cbiAgdG9nZ2xlQ2FsZW5kYXIoKTogYW55IHtcbiAgICB0aGlzLmlzT3BlbiA9ICF0aGlzLmlzT3BlbjtcbiAgICB0aGlzLnJlRm9ybWF0SW5wdXQoKTtcbiAgfVxuXG4gIG9wZW5DYWxlbmRhcigpOiBhbnkge1xuICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcbiAgICB0aGlzLm9uVG91Y2goKTtcbiAgfVxuXG4gIGNsb3NlQ2FsZW5kYXIoKTogYW55IHtcbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICAgIHRoaXMuZW1pdFNlbGVjdGVkLmVtaXQodGhpcy5zZWxlY3RlZCk7XG5cbiAgfVxuXG4gIGNoYW5nZU1vZGUobW9kZTogc3RyaW5nKSB7XG4gICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICB0aGlzLm9uVG91Y2goKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucmVzZXRSYW5nZSgpO1xuICAgIHRoaXMuc3RhcnREYXRlID0gbW9tZW50KCk7XG4gICAgdGhpcy5lbmREYXRlID0gbnVsbDtcbiAgICB0aGlzLm5hdkRhdGUgPSB0aGlzLnRvZGF5RGF0ZTtcbiAgICB0aGlzLmN1cnJlbnRNb250aCA9IHRoaXMubmF2RGF0ZS5tb250aCgpO1xuICAgIHRoaXMuY3VycmVudFllYXIgPSB0aGlzLm5hdkRhdGUueWVhcigpO1xuICAgIHRoaXMuaW5jbHVkZUVuZERhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmluY2x1ZGVUaW1lID0gZmFsc2U7XG4gICAgdGhpcy5zdGFydFRpbWUgPSBudWxsO1xuICAgIHRoaXMuZW5kVGltZSA9IG51bGw7XG4gICAgdGhpcy5tb2RlID0gJ3N0YXJ0JztcbiAgICB0aGlzLm1ha2VHcmlkQ3VzdG9tKHRoaXMuY3VycmVudFllYXIsIHRoaXMuY3VycmVudE1vbnRoKTtcbiAgICB0aGlzLnJlRm9ybWF0SW5wdXQoKTtcbiAgfVxuXG4gIHNldFRpbWUobW9tZW50LCBob3VyOiBudW1iZXIgPSAwLCBtaW51dGU6IG51bWJlciA9IDApIHtcbiAgICByZXR1cm4gbW9tZW50LnNldCh7IGhvdXIsIG1pbnV0ZSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgfVxuXG4gIGhhbmRsZU1vZGVDaGFuZ2UoKSB7XG4gICAgdGhpcy5yZXNldFJhbmdlKCk7XG4gICAgdGhpcy5tb2RlID0gJ2VuZCc7XG4gICAgaWYgKHRoaXMuc3RhcnREYXkpIHtcbiAgICAgIHRoaXMuc3RhcnREYXkuaXNBY3RpdmUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaW5jbHVkZUVuZERhdGUpIHtcbiAgICAgIHRoaXMuZW5kRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLm1vZGUgPSAnc3RhcnQnO1xuICAgICAgdGhpcy5zdGFydERheS5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5lbmREYXkuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdG1wU3RhcnREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcbiAgICAgIC8vIGNvbnN0IG5leHREYXkgPSB0bXBTdGFydERhdGUuYWRkKDIsICdkYXlzJykuZm9ybWF0KGBZWVlZLSR7dG1wU3RhcnREYXRlLmZvcm1hdCgnTScpIC0gMX0tRGApO1xuICAgICAgLy8gdGhpcy5zaW11bGF0ZUNsaWNrKG5leHREYXksICdjYWxlbmRhci1kYXktbm90LXJhbmdlJyk7XG4gICAgfVxuXG4gIH1cblxuICBzZXRTdGFydFRpbWUodGltZSkge1xuICAgIHRoaXMuc3RhcnRUaW1lID0gdGltZTtcbiAgfVxuXG4gIHNldEVuZFRpbWUodGltZSkge1xuICAgIHRoaXMuZW5kVGltZSA9IHRpbWU7XG4gIH1cblxuICBoYW5kbGVUaW1lQ2hhbmdlKHRpbWU6IGFueSwgbW9tZW50OiBhbnksIG1vZGU6IHN0cmluZykge1xuICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICAgIGlmICghdGltZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aW1lID0gdGltZS5yZXBsYWNlKC9bXmEtekEtWjAtOV0vZywgJycpO1xuICAgIG1vbWVudC5zZXQoeyBob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSk7XG4gICAgbGV0IGxhc3RUd28gPSB0aW1lLnN1YnN0cih0aW1lLmxlbmd0aCAtIDIpLnRvVXBwZXJDYXNlKCk7XG4gICAgbGV0IGxhc3QgPSB0aW1lLnN1YnN0cih0aW1lLmxlbmd0aCAtIDEpLnRvVXBwZXJDYXNlKCk7XG4gICAgY29uc3QgaGFzTGFzdFR3byA9IFsnQU0nLCAnUE0nXS5pbmNsdWRlcyhsYXN0VHdvKTtcbiAgICBjb25zdCBoYXNMYXN0ID0gWydBJywgJ1AnXS5pbmNsdWRlcyhsYXN0KTtcbiAgICBsZXQgaXNBbSA9IHRydWU7XG4gICAgbGV0IGlzUG0gPSBmYWxzZTtcbiAgICBpZiAoaGFzTGFzdCB8fCBoYXNMYXN0VHdvKSB7XG4gICAgICBpc0FtID0gbGFzdCA9PT0gJ0EnIHx8IGxhc3RUd28gPT09ICdBTSc7XG4gICAgICBpc1BtID0gbGFzdCA9PT0gJ1AnIHx8IGxhc3RUd28gPT09ICdQTSc7XG4gICAgfVxuICAgIHRpbWUgPSB0aW1lLnJlcGxhY2UoL1teMC05XS9nLCAnJyk7XG4gICAgbGFzdFR3byA9IHRpbWUuc3Vic3RyKHRpbWUubGVuZ3RoIC0gMik7XG4gICAgbGFzdCA9IHRpbWUuc3Vic3RyKHRpbWUubGVuZ3RoIC0gMSk7XG4gICAgdGltZSA9IHRpbWUuc3Vic3RyKDAsIDQpO1xuICAgIHRoaXMuaXNJbnZhbGlkID0gZmFsc2U7XG4gICAgc3dpdGNoICh0aW1lLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBtb21lbnRcbiAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZSkpIDpcbiAgICAgICAgICAgIHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lKSArIDEyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGlmIChsYXN0ID49IDYpIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRpbWUgPT09IDEyKSB7XG4gICAgICAgICAgbW9tZW50XG4gICAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCAwKSA6XG4gICAgICAgICAgICAgIHRoaXMuc2V0VGltZShtb21lbnQsIDEyKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aW1lIDwgMTIpIHtcbiAgICAgICAgICBtb21lbnRcbiAgICAgICAgICAgID0gaXNBbSA/IHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lKSkgOlxuICAgICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZSkgKyAxMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9tZW50XG4gICAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSksIE51bWJlcihsYXN0KSkgOlxuICAgICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSkgKyAxMiwgTnVtYmVyKGxhc3QpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaWYgKGxhc3RUd28gPj0gNjApIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9tZW50XG4gICAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSksIE51bWJlcihsYXN0VHdvKSkgOlxuICAgICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSkgKyAxMiwgTnVtYmVyKGxhc3RUd28pKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgaWYgKGxhc3RUd28gPj0gNjApIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbW9tZW50ID0gdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWUuc3Vic3RyKDAsIDIpKSwgTnVtYmVyKGxhc3RUd28pKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLmVtaXRTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWQpO1xuICAgIGlmIChtb2RlID09PSAnc3RhcnQnKSB7XG4gICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudDtcbiAgICAgIHRoaXMuc3RhcnRUaW1lUGlja2VyLm5hdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVuZERhdGUgPSBtb21lbnQ7XG4gICAgICB0aGlzLmVuZFRpbWVQaWNrZXIubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==