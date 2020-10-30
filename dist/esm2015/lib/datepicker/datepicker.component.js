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
            let concatValue = [];
            if (this.startDate && this.startDate.isValid()) {
                concatValue = [
                    this.startDate.format(this.formatInputDate),
                    (this.endDate && this.endDate.isValid()) ? '  -  ' : '',
                    (this.endDate && this.endDate.isValid()) ? this.endDate.format(this.formatInputDate) : ''
                ];
            }
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
            }
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
                if (i < initEmptyCell || i > initEmptyCell + dateOfTurn.daysInMonth() - 1) { // 0 < 0 NO || 0 > (0-1) SI
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
        };
        this.reFormatInput = () => {
            this.formatInputDate = (this.includeTime) ? this.formatInputTime : this.formatInputDate;
            this.concatValueInput();
        };
    }
    get startDate() {
        return this.startDatePrivate;
    }
    set startDate(value) {
        if (this.startDatePrivate === value) {
            return;
        }
        this.startDatePrivate = moment(value);
        if (this.startDatePrivate.isValid()) {
            this.startDateChange.emit(this.startDatePrivate);
            this.reFormatInput();
        }
    }
    get endDate() {
        return this.endDatePrivate;
    }
    set endDate(value) {
        if (this.endDatePrivate === value) {
            return;
        }
        this.endDatePrivate = moment(value);
        if (this.endDatePrivate.isValid()) {
            this.endDateChange.emit(this.endDatePrivate);
            this.reFormatInput();
        }
    }
    ngAfterContentChecked() {
        this.cdr.detectChanges();
    }
    ngOnInit() {
        this.navDate = moment();
        this.setOptions();
        this.makeHeader();
        /**
         * Set startDate and parse
         */
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
            if (this.dataMonths.hasOwnProperty(this.currentYear) && this.dataMonths[this.currentYear].hasOwnProperty(this.currentMonth)) {
                this.dataMonths[this.currentYear][this.currentMonth] = [];
            }
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
                template: "<!-- ********* INPUT FROM DATE Collaborator https://github.com/leifermendez ***************** --->\n<input (click)=\"openCalendar()\" readonly spellcheck=\"false\" class=\"omit-trigger-outside input-date-funny {{classInput}}\"\n  autocomplete=\"nope\" [value]=\"value\" [disabled]=\"isDisabled\" (input)=\"onInput($event.target.value)\" [ngClass]=\"{\n    'date-picker-valid ng-valid': !isInvalid,\n     'date-picker-invalid ng-invalid': isInvalid,\n     'funny-range':includeEndDate,\n     'ng-opened': isOpen,\n     'ng-touched': onTouched,\n     'ng-untouched': !onTouched\n    }\" type=\"text\">\n\n<!--- *************** CALENDAR ELEMENTS Author https://github.com/mokshithpyla ************* --->\n<div (clickOutside)=\"closeCalendar()\" class=\"calendar\" *ngIf=\"isOpen\">\n  <!-- **** CALENDAR NAVIGATION ****-->\n  <div class=\"calendar-nav\">\n    <div class=\"calendar-nav-previous-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(-1)\" [disabled]=\"!canAccessPrevious\">\n        <i class=\"fa fa-chevron-left\"></i>\n      </button>\n    </div>\n    <div>{{navDate.format('MMMM YYYY')}}</div>\n    <div class=\"calendar-nav-next-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(1)\" [disabled]=\"!canAccessNext\">\n        <i class=\"fa fa-chevron-right\"></i>\n      </button>\n    </div>\n  </div>\n\n  <!--- **** CALENDAR CONTAINER ****-->\n\n  <div class=\"calendar-container\">\n    <div class=\"calendar-header\">\n      <div class=\"calendar-date\" *ngFor=\"let day of weekDaysHeaderArr\" [innerText]=\"day\"></div>\n    </div>\n    <div class=\"calendar-body\">\n      <!---**** LOAD TEMPLATE*** --->\n      <ng-container *ngTemplateOutlet=\"templateCalendar;context:{\n      data:dataMonths,\n      year:navDate.format('YYYY'),\n      month:navDate.format('M'),\n      includeEndDate:includeEndDate,\n      startDay:null,\n      endDate:null}\"></ng-container>\n    </div>\n\n    <div class=\"footer-calendar\">\n      <div class=\"flex justify-content-between options-bar divider\">\n        <div class=\"flex\">\n          <div class=\"label-placeholder label-option pr-25\">\n            <input type=\"checkbox\" [(ngModel)]=\"includeEndDate\" (change)=\"handleModeChange()\">\n            <small>{{rangeLabel}}</small>\n          </div>\n          <div class=\"label-placeholder label-option pr-25\">\n            <input\n              (change)=\"reFormatInput();handleTimeChange(startTime, startDate, 'start');handleTimeChange(endTime, endDate, 'end')\"\n              [(ngModel)]=\"includeTime\" type=\"checkbox\">\n            <small>{{timeLabel}}</small>\n          </div>\n        </div>\n        <div class=\"label-placeholder label-option pr-25\">\n          <div (click)=\"clear()\">{{clearLabel}}</div>\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\">\n\n        <div class=\"child\" *ngIf=\"startDate && startDate.isValid()\">\n          <div class=\"calendar-child-day\">{{startDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{startDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{startDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\" *ngIf=\"!startDate || !startDate.isValid()\">\n          <div class=\"calendar-child-day\">{{navDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{navDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{navDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <ng-container\n            *ngTemplateOutlet=\"templateTimeInput;context:{mode:'start',startDate:startDate,timeShow:includeTime}\">\n          </ng-container>\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\" *ngIf=\"includeEndDate\">\n        <div class=\"child\" *ngIf=\"endDate && endDate.isValid()\">\n          <div class=\"calendar-child-day\">{{endDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{endDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{endDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <ng-container *ngTemplateOutlet=\"templateTimeInput;context:{mode:'end',endDate:endDate,timeShow:includeTime}\">\n          </ng-container>\n        </div>\n      </div>\n    </div>\n  </div>\n\n</div>\n\n<!--- ********** TEMPLATE BODY CALENDAR*************** -->\n<ng-template #templateCalendar let-data=\"data\" let-year=\"year\" let-includedend=\"includeEndDate\" let-month=\"month\"\n  let-start=\"startDay\" let-end=\"endDate\">\n  <ng-container *ngIf=\"includeEndDate\">\n    <div *ngFor=\"let day of data[year][month]\"\n      class=\"calendar-date calendar-day-not-range-{{year}}-{{month}}-{{day?.value}}\" [ngClass]=\"{\n          'is-disabled': !day?.available,\n          'calendar-range': day?.inRange,\n          'calendar-range-start': day?.value === start?.value && day?.month === start?.month && day?.year === start?.year ,\n          'calendar-range-end': day?.value === end?.value && day?.month === end?.month && day?.year === end?.year}\">\n      <button type=\"button\" *ngIf=\"day.value !== 0\" class=\"date-item\"\n        [ngClass]=\"{'is-active': day?.isActive, 'is-today': day?.isToday}\" (click)=\"selectDay(day)\">\n        {{day.value}}</button>\n      <button type=\"button\" *ngIf=\"day?.value === 0\" class=\"date-item\"></button>\n    </div>\n  </ng-container>\n\n  <ng-container *ngIf=\"!includeEndDate\">\n    <div *ngFor=\"let day of data[year][month]\" class=\"calendar-date\" [ngClass]=\"{'is-disabled': !day?.available }\">\n      <button *ngIf=\"day?.value !== 0\" class=\"date-item\" type=\"button\"\n        [ngClass]=\"{'is-active': day?.isActive, 'is-today': day?.isToday}\"\n        (click)=\"selectDay(day)\">{{day?.value}}</button>\n      <button type=\"button\" *ngIf=\"day?.value === 0\" class=\"date-item\"></button>\n    </div>\n  </ng-container>\n</ng-template>\n<!--- ********** TEMPLATE INPUT TIME*************** -->\n<ng-template #templateTimeInput let-mode=\"mode\" let-show=\"timeShow\" let-start=\"startDate\" let-end=\"endDate\">\n\n  <ng-container *ngIf=\"show\">\n    <div class=\"meridian-buttons\" *ngIf=\"meridianTime && mode === 'start'\">\n      <div>\n        <button (click)=\"changeMeridianTime('AM','start')\" [disabled]=\"startDate && startDate.format('A') === 'AM'\"\n          type=\"button\">AM\n        </button>\n      </div>\n      <div>\n        <button (click)=\"changeMeridianTime('PM','start')\" [disabled]=\"startDate && startDate.format('A') === 'PM'\"\n          type=\"button\">PM\n        </button>\n      </div>\n    </div>\n    <div class=\"meridian-buttons\" *ngIf=\"meridianTime && endDate && mode === 'end'\">\n      <div>\n        <button (click)=\"changeMeridianTime('AM','end')\" [disabled]=\"endDate && endDate.format('A') === 'AM'\"\n          type=\"button\">AM\n        </button>\n      </div>\n      <div>\n        <button (click)=\"changeMeridianTime('PM','end')\" [disabled]=\"endDate && endDate.format('A') === 'PM'\"\n          type=\"button\">PM\n        </button>\n      </div>\n    </div>\n    <div class=\"calendar-time-input-cells\" *ngIf=\"mode === 'start'\">\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkHourValidate($event,'start')\"\n          [max]=\"maxInputHour\" [min]=\"minInputHour\" [(ngModel)]=\"valueInputHour.start\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubHour(1,'start')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubHour(-1,'start')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkMinuteValidate($event,'start')\"\n          [max]=\"maxInputMinute\" [min]=\"minInputMinute\" [(ngModel)]=\"valueInputMinute.start\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubMinute(1,'start')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubMinute(-1,'start')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n    </div>\n    <div class=\"calendar-time-input-cells\" *ngIf=\"endDate && mode === 'end'\">\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkHourValidate($event,'end')\"\n          type=\"button\" [max]=\"maxInputHour\" [min]=\"minInputHour\" [(ngModel)]=\"valueInputHour.end\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubHour(1,'end')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubHour(-1,'end')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkMinuteValidate($event,'end')\"\n          [max]=\"maxInputMinute\" [min]=\"minInputMinute\" [(ngModel)]=\"valueInputMinute.end\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubMinute(1,'end')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubMinute(-1,'end')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n    </div>\n  </ng-container>\n\n</ng-template>\n",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvTGVpZmVyL1dlYnN0b3JtUHJvamVjdHMvZXhhbXBsZS1saWIvcHJvamVjdHMvbmd4LWZ1bm55LWRhdGVwaWNrZXIvc3JjLyIsInNvdXJjZXMiOlsibGliL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRWhELE9BQU8sRUFBQyxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFjLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNoSCxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7QUFFbEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBY3ZCLE1BQU0sT0FBTyxtQkFBbUI7SUF5RzlCLFlBQW9CLEdBQXNCO1FBQXRCLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBeEdqQyxVQUFLLEdBQVEsRUFBRSxDQUFDO1FBeUJ6QixvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFxQjFDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUkvQixXQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2QsZUFBVSxHQUFHLE9BQU8sQ0FBQztRQUNyQixjQUFTLEdBQUcsTUFBTSxDQUFDO1FBQ25CLGVBQVUsR0FBRyxPQUFPLENBQUM7UUFHckIsb0JBQWUsR0FBRyxhQUFhLENBQUM7UUFDaEMsb0JBQWUsR0FBRyxtQkFBbUIsQ0FBQztRQUNyQyxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFHakQsc0JBQWlCLEdBQWtCLEVBQUUsQ0FBQztRQUN0QyxlQUFVLEdBQVEsRUFBRSxDQUFDO1FBRXJCLHNCQUFpQixH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cUJBQ1o7aUJBQ0Y7O2FBQ0Y7OztZQW5CTyxpQkFBaUI7OztvQkFxQnRCLEtBQUs7OEJBQ0wsU0FBUyxTQUFDLGlCQUFpQjs0QkFDM0IsU0FBUyxTQUFDLGVBQWU7K0JBQ3pCLEtBQUs7c0JBQ0wsS0FBSztzQkFDTCxLQUFLO3dCQU9MLEtBQUs7OEJBWUwsTUFBTTtzQkFTTixLQUFLOzRCQVlMLE1BQU07c0JBRU4sS0FBSztzQkFDTCxLQUFLO3lCQUNMLEtBQUs7cUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3dCQUNMLEtBQUs7eUJBQ0wsS0FBSzs2QkFDTCxLQUFLOzJCQUNMLEtBQUs7OEJBQ0wsS0FBSzs4QkFDTCxLQUFLOzJCQUNMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NoYW5nZURldGVjdG9yUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QWZ0ZXJDb250ZW50Q2hlY2tlZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0ICogYXMgbW9tZW50XyBmcm9tICdtb21lbnQnO1xuXG5jb25zdCBtb21lbnQgPSBtb21lbnRfO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZnVubnktZGF0ZXBpY2tlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9kYXRlcGlja2VyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZGF0ZXBpY2tlci5jb21wb25lbnQuY3NzJ10sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF0ZXBpY2tlckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlcGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgQWZ0ZXJDb250ZW50Q2hlY2tlZCB7XG4gIEBJbnB1dCgpIHZhbHVlOiBhbnkgPSAnJztcbiAgQFZpZXdDaGlsZCgnc3RhcnRUaW1lUGlja2VyJykgc3RhcnRUaW1lUGlja2VyOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdlbmRUaW1lUGlja2VyJykgZW5kVGltZVBpY2tlcjogRWxlbWVudFJlZjtcbiAgQElucHV0KCkgc2hvd0luaXRpYWxWYWx1ZTogYm9vbGVhbjtcbiAgQElucHV0KCkgaXNSYW5nZTogYm9vbGVhbjtcbiAgQElucHV0KCkgaGFzVGltZTogYm9vbGVhbjtcbiAgcHVibGljIHN0YXJ0RGF0ZVByaXZhdGU6IGFueTtcblxuICBnZXQgc3RhcnREYXRlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnREYXRlUHJpdmF0ZTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBzdGFydERhdGUodmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLnN0YXJ0RGF0ZVByaXZhdGUgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3RhcnREYXRlUHJpdmF0ZSA9IG1vbWVudCh2YWx1ZSk7XG4gICAgaWYgKHRoaXMuc3RhcnREYXRlUHJpdmF0ZS5pc1ZhbGlkKCkpIHtcbiAgICAgIHRoaXMuc3RhcnREYXRlQ2hhbmdlLmVtaXQodGhpcy5zdGFydERhdGVQcml2YXRlKTtcbiAgICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICAgIH1cbiAgfVxuXG4gIEBPdXRwdXQoKVxuICBzdGFydERhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwdWJsaWMgZW5kRGF0ZVByaXZhdGU6IGFueTtcblxuICBnZXQgZW5kRGF0ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmVuZERhdGVQcml2YXRlO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGVuZERhdGUodmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLmVuZERhdGVQcml2YXRlID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmVuZERhdGVQcml2YXRlID0gbW9tZW50KHZhbHVlKTtcbiAgICBpZiAodGhpcy5lbmREYXRlUHJpdmF0ZS5pc1ZhbGlkKCkpIHtcbiAgICAgIHRoaXMuZW5kRGF0ZUNoYW5nZS5lbWl0KHRoaXMuZW5kRGF0ZVByaXZhdGUpO1xuICAgICAgdGhpcy5yZUZvcm1hdElucHV0KCk7XG4gICAgfVxuICB9XG5cbiAgQE91dHB1dCgpXG4gIGVuZERhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQElucHV0KCkgbWluRGF0ZTogYW55O1xuICBASW5wdXQoKSBtYXhEYXRlOiBhbnk7XG4gIEBJbnB1dCgpIGNsYXNzSW5wdXQ6IHN0cmluZztcbiAgQElucHV0KCkgbG9jYWxlID0gJ2VuJztcbiAgQElucHV0KCkgcmFuZ2VMYWJlbCA9ICdSYW5nZSc7XG4gIEBJbnB1dCgpIHRpbWVMYWJlbCA9ICdUaW1lJztcbiAgQElucHV0KCkgY2xlYXJMYWJlbCA9ICdDbGVhcic7XG4gIEBJbnB1dCgpIGluY2x1ZGVFbmREYXRlOiBib29sZWFuO1xuICBASW5wdXQoKSBtZXJpZGlhblRpbWU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGZvcm1hdElucHV0RGF0ZSA9ICdEIE1NTSwgWVlZWSc7XG4gIEBJbnB1dCgpIGZvcm1hdElucHV0VGltZSA9ICdEIE1NTSwgWVlZWSBISDptbSc7XG4gIEBPdXRwdXQoKSBlbWl0U2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgaXNPcGVuOiBib29sZWFuO1xuICBuYXZEYXRlOiBhbnk7XG4gIHdlZWtEYXlzSGVhZGVyQXJyOiBBcnJheTxzdHJpbmc+ID0gW107XG4gIGRhdGFNb250aHM6IGFueSA9IHt9O1xuICBzZWxlY3RlZERhdGU6IGFueTtcbiAgY2FuQWNjZXNzUHJldmlvdXMgPSB0cnVlO1xuICBjYW5BY2Nlc3NOZXh0ID0gdHJ1ZTtcbiAgdG9kYXlEYXRlID0gbW9tZW50KCkuc2V0KHtob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDB9KTtcbiAgc3RhcnREYXk6IGFueTtcbiAgZW5kRGF5OiBhbnk7XG4gIHJlbmRlcmVkRmxhZyA9IHRydWU7XG4gIG1vZGUgPSAnZW5kJztcbiAgaW5pdGlhbEVtcHR5Q2VsbHM6IG51bWJlcjtcbiAgbGFzdEVtcHR5Q2VsbHM6IG51bWJlcjtcbiAgYXJyYXlMZW5ndGg6IG51bWJlcjtcbiAgY3VycmVudE1vbnRoOiBudW1iZXI7XG4gIGN1cnJlbnRZZWFyOiBudW1iZXI7XG4gIHNlbGVjdGVkOiBhbnk7XG4gIHN0YXJ0VGltZTogYW55O1xuICBlbmRUaW1lOiBhbnk7XG4gIGlzSW52YWxpZCA9IGZhbHNlO1xuICBpbmNsdWRlVGltZTogYm9vbGVhbjtcbiAgbWluSW5wdXRIb3VyID0gMDtcbiAgbWF4SW5wdXRIb3VyID0gMjM7XG4gIHZhbHVlSW5wdXRIb3VyOiBhbnkgPSB7XG4gICAgc3RhcnQ6IHt9LFxuICAgIGVuZDoge31cbiAgfTtcbiAgbWluSW5wdXRNaW51dGUgPSAwO1xuICBtYXhJbnB1dE1pbnV0ZSA9IDU5O1xuICB2YWx1ZUlucHV0TWludXRlOiBhbnkgPSB7XG4gICAgc3RhcnQ6IHt9LFxuICAgIGVuZDoge31cbiAgfTtcbiAgLyoqXG4gICAqIENvbnRyb2xBY2Nlc3NvclxuICAgKi9cbiAgb25Ub3VjaGVkOiBib29sZWFuO1xuICBpc0Rpc2FibGVkOiBib29sZWFuO1xuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHtcbiAgfTtcbiAgb25Ub3VjaCA9ICgpID0+IHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IHRydWU7XG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmKSB7XG5cblxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCk6IHZvaWQge1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubmF2RGF0ZSA9IG1vbWVudCgpO1xuICAgIHRoaXMuc2V0T3B0aW9ucygpO1xuICAgIHRoaXMubWFrZUhlYWRlcigpO1xuICAgIC8qKlxuICAgICAqIFNldCBzdGFydERhdGUgYW5kIHBhcnNlXG4gICAgICovXG5cbiAgICB0aGlzLnZhbHVlSW5wdXRIb3VyLnN0YXJ0ID0gdGhpcy5uYXZEYXRlLmZvcm1hdCgnaGgnKTtcbiAgICB0aGlzLnZhbHVlSW5wdXRNaW51dGUuc3RhcnQgPSB0aGlzLm5hdkRhdGUuZm9ybWF0KCdtbScpO1xuXG4gICAgdGhpcy52YWx1ZUlucHV0TWludXRlLmVuZCA9IHRoaXMubmF2RGF0ZS5mb3JtYXQoJ21tJyk7XG4gICAgdGhpcy52YWx1ZUlucHV0SG91ci5lbmQgPSB0aGlzLm5hdkRhdGUuZm9ybWF0KCdoaCcpO1xuICAgIGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiBtb21lbnQodGhpcy5zdGFydERhdGUpLmlzVmFsaWQoKSkge1xuICAgICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQodGhpcy5zdGFydERhdGUpO1xuICAgICAgdGhpcy5uYXZEYXRlID0gdGhpcy5zdGFydERhdGU7XG4gICAgICB0aGlzLnZhbHVlSW5wdXRIb3VyLnN0YXJ0ID0gdGhpcy5zdGFydERhdGUuZm9ybWF0KCdoaCcpO1xuICAgICAgdGhpcy52YWx1ZUlucHV0TWludXRlLnN0YXJ0ID0gdGhpcy5zdGFydERhdGUuZm9ybWF0KCdtbScpO1xuICAgICAgY29uc3Qgc3RhcnREYXkgPSB7XG4gICAgICAgIG1vbnRoOiBOdW1iZXIodGhpcy5zdGFydERhdGUuZm9ybWF0KCdNJykpLFxuICAgICAgICB5ZWFyOiB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCksXG4gICAgICAgIGRheTogTnVtYmVyKHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnREQnKSlcbiAgICAgIH07XG4gICAgICB0aGlzLmRhdGFNb250aHNbc3RhcnREYXkueWVhcl1bc3RhcnREYXkubW9udGhdLmZvckVhY2goZCA9PiBkLmlzQWN0aXZlID0gKGQudmFsdWUgPT09IHN0YXJ0RGF5LmRheSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5zaG93SW5pdGlhbFZhbHVlKSB7XG4gICAgICAgIHRoaXMuc3RhcnREYXRlID0gbW9tZW50KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IGVuZERhdGUgYW5kIHBhcnNlXG4gICAgICovXG5cbiAgICBpZiAodGhpcy5lbmREYXRlICYmIG1vbWVudCh0aGlzLmVuZERhdGUpLmlzVmFsaWQoKSkge1xuICAgICAgdGhpcy5lbmREYXRlID0gbW9tZW50KHRoaXMuZW5kRGF0ZSk7XG4gICAgICB0aGlzLm5hdkRhdGUgPSB0aGlzLmVuZERhdGU7XG4gICAgICB0aGlzLnZhbHVlSW5wdXRNaW51dGUuZW5kID0gdGhpcy5lbmREYXRlLmZvcm1hdCgnbW0nKTtcbiAgICAgIHRoaXMudmFsdWVJbnB1dEhvdXIuZW5kID0gdGhpcy5lbmREYXRlLmZvcm1hdCgnaGgnKTtcbiAgICAgIHRoaXMuaW5jbHVkZUVuZERhdGUgPSB0cnVlO1xuICAgICAgY29uc3QgZW5kRGF5ID0ge1xuICAgICAgICBtb250aDogTnVtYmVyKHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ00nKSksXG4gICAgICAgIHllYXI6IHRoaXMuZW5kRGF0ZS55ZWFyKCksXG4gICAgICAgIGRheTogTnVtYmVyKHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ0REJykpXG4gICAgICB9O1xuXG4gICAgICB0aGlzLmFwcGx5UmFuZ2UoKTtcbiAgICAgIGNvbnN0IHN0YXJ0RGF5ID0ge1xuICAgICAgICBtb250aDogTnVtYmVyKHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnTScpKSxcbiAgICAgICAgeWVhcjogdGhpcy5zdGFydERhdGUueWVhcigpLFxuICAgICAgICBkYXk6IE51bWJlcih0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ0REJykpXG4gICAgICB9O1xuICAgICAgdGhpcy5kYXRhTW9udGhzW3N0YXJ0RGF5LnllYXJdW3N0YXJ0RGF5Lm1vbnRoXS5mb3JFYWNoKGQgPT4gZC5pc0FjdGl2ZSA9IChkLnZhbHVlID09PSBzdGFydERheS5kYXkpKTtcbiAgICAgIHRoaXMuZGF0YU1vbnRoc1tlbmREYXkueWVhcl1bZW5kRGF5Lm1vbnRoXS5mb3JFYWNoKGQgPT4ge1xuICAgICAgICBpZiAoIWQuaXNBY3RpdmUpIHtcbiAgICAgICAgICBkLmlzQWN0aXZlID0gKGQudmFsdWUgPT09IGVuZERheS5kYXkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbmREYXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRNb250aCA9IHRoaXMubmF2RGF0ZS5tb250aCgpO1xuICAgIHRoaXMuY3VycmVudFllYXIgPSB0aGlzLm5hdkRhdGUueWVhcigpO1xuICAgIGlmICh0aGlzLnNob3dJbml0aWFsVmFsdWUpIHtcbiAgICAgIHRoaXMuY29uY2F0VmFsdWVJbnB1dCgpO1xuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIGNvbnRyb2xWYWx1ZUFjY2Vzc29yXG4gICAqL1xuICBvbklucHV0KHZhbHVlKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMub25Ub3VjaCgpO1xuICAgIHRoaXMub25DaGFuZ2UodGhpcy52YWx1ZSk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZSB8fCAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52YWx1ZSA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2ggPSBmbjtcbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuaXNEaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIG51bVxuICAgKiBAcGFyYW0gbW9kZVxuICAgKi9cbiAgYWRkT3JTdWJIb3VyID0gKG51bTogbnVtYmVyLCBtb2RlOiBzdHJpbmcpID0+IHtcbiAgICBpZiAobnVtID4gMCkge1xuICAgICAgdGhpcy5jaGVja0hvdXJWYWxpZGF0ZSgoTnVtYmVyKHRoaXMudmFsdWVJbnB1dEhvdXJbbW9kZV0pICsgMSksIG1vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNoZWNrSG91clZhbGlkYXRlKChOdW1iZXIodGhpcy52YWx1ZUlucHV0SG91clttb2RlXSkgLSAxKSwgbW9kZSk7XG4gICAgfVxuICB9O1xuXG4gIGFkZE9yU3ViTWludXRlID0gKG51bTogbnVtYmVyLCBtb2RlOiBzdHJpbmcpID0+IHtcbiAgICBpZiAobnVtID4gMCkge1xuICAgICAgdGhpcy5jaGVja01pbnV0ZVZhbGlkYXRlKChOdW1iZXIodGhpcy52YWx1ZUlucHV0TWludXRlW21vZGVdKSArIDEpLCBtb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jaGVja01pbnV0ZVZhbGlkYXRlKChOdW1iZXIodGhpcy52YWx1ZUlucHV0TWludXRlW21vZGVdKSAtIDEpLCBtb2RlKTtcbiAgICB9XG4gIH07XG5cbiAgY2hlY2tIb3VyVmFsaWRhdGUgPSAoJGV2ZW50LCBtb2RlKSA9PiB7XG4gICAgY29uc3QgdG9Ib3VyID0gKG1vZGUgPT09ICdzdGFydCcpID8gJ3N0YXJ0JyA6ICdlbmQnO1xuICAgIGlmICh0aGlzLm1lcmlkaWFuVGltZSkge1xuICAgICAgdGhpcy52YWx1ZUlucHV0SG91clt0b0hvdXJdID0gJGV2ZW50O1xuICAgICAgaWYgKCRldmVudCA8PSAxMiAmJiAkZXZlbnQgPiAwKSB7XG4gICAgICAgIGlmIChtb2RlID09PSAnc3RhcnQnICYmIHRoaXMuc3RhcnREYXRlICYmIHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnQScpID09PSAnUE0nKSB7XG4gICAgICAgICAgaWYgKCRldmVudCA9PT0gMTIpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlLnNldCh7aG91cjogKCRldmVudCksIG1pbnV0ZTogdGhpcy52YWx1ZUlucHV0TWludXRlW3RvSG91cl0sIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUuc2V0KHtob3VyOiAoJGV2ZW50ICsgMTIpLCBtaW51dGU6IHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtb2RlID09PSAnc3RhcnQnICYmIHRoaXMuc3RhcnREYXRlICYmIHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnQScpID09PSAnQU0nKSB7XG4gICAgICAgICAgdGhpcy5zdGFydERhdGUuc2V0KHtob3VyOiAoJGV2ZW50KSwgbWludXRlOiB0aGlzLnZhbHVlSW5wdXRNaW51dGVbdG9Ib3VyXSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vZGUgPT09ICdlbmQnICYmIHRoaXMuZW5kRGF0ZSAmJiB0aGlzLmVuZERhdGUuZm9ybWF0KCdBJykgPT09ICdQTScpIHtcbiAgICAgICAgICBpZiAoJGV2ZW50ID09PSAxMikge1xuICAgICAgICAgICAgdGhpcy5lbmREYXRlLnNldCh7aG91cjogKCRldmVudCksIG1pbnV0ZTogdGhpcy52YWx1ZUlucHV0TWludXRlW3RvSG91cl0sIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbmREYXRlLnNldCh7aG91cjogKCRldmVudCArIDEyKSwgbWludXRlOiB0aGlzLnZhbHVlSW5wdXRNaW51dGVbdG9Ib3VyXSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobW9kZSA9PT0gJ2VuZCcgJiYgdGhpcy5lbmREYXRlICYmIHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ0EnKSA9PT0gJ0FNJykge1xuICAgICAgICAgIHRoaXMuZW5kRGF0ZS5zZXQoe2hvdXI6ICgkZXZlbnQpLCBtaW51dGU6IHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vZGUgPT09ICdzdGFydCcgJiYgdGhpcy5lbmREYXRlICYmIHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ0EnKSA9PT0gJ1BNJykge1xuICAgICAgICAgIHRoaXMuc3RhcnREYXRlLnNldCh7aG91cjogdGhpcy52YWx1ZUlucHV0SG91clt0b0hvdXJdICsgMTIsIG1pbnV0ZTogdGhpcy52YWx1ZUlucHV0TWludXRlW3RvSG91cl0sIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoJGV2ZW50ID49IDAgJiYgJGV2ZW50IDw9IDIzKSB7XG4gICAgICAgIHRoaXMudmFsdWVJbnB1dEhvdXJbdG9Ib3VyXSA9ICRldmVudDtcbiAgICAgICAgaWYgKG1vZGUgPT09ICdlbmQnKSB7XG4gICAgICAgICAgdGhpcy5lbmREYXRlLnNldCh7aG91cjogKCRldmVudCksIG1pbnV0ZTogdGhpcy52YWx1ZUlucHV0TWludXRlW3RvSG91cl0sIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobW9kZSA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICAgIHRoaXMuc3RhcnREYXRlLnNldCh7aG91cjogdGhpcy52YWx1ZUlucHV0SG91clt0b0hvdXJdLCBtaW51dGU6IHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnJlRm9ybWF0SW5wdXQoKTtcbiAgfTtcblxuICBjaGVja01pbnV0ZVZhbGlkYXRlID0gKCRldmVudCwgbW9kZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgdG9Ib3VyID0gKG1vZGUgPT09ICdzdGFydCcpID8gJ3N0YXJ0JyA6ICdlbmQnO1xuICAgIHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdID0gJGV2ZW50O1xuICAgIGlmICgkZXZlbnQgPCAwKSB7XG4gICAgICB0aGlzLnZhbHVlSW5wdXRNaW51dGVbdG9Ib3VyXSA9IDU5O1xuICAgIH0gZWxzZSBpZiAoJGV2ZW50ID4gNTkpIHtcbiAgICAgIHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdID0gMDtcbiAgICB9XG4gICAgaWYgKG1vZGUgPT09ICdzdGFydCcpIHtcbiAgICAgIHRoaXMuc3RhcnREYXRlLnNldCh7bWludXRlOiB0aGlzLnZhbHVlSW5wdXRNaW51dGVbdG9Ib3VyXSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMH0pO1xuICAgIH1cbiAgICBpZiAobW9kZSA9PT0gJ2VuZCcpIHtcbiAgICAgIHRoaXMuZW5kRGF0ZS5zZXQoe21pbnV0ZTogdGhpcy52YWx1ZUlucHV0TWludXRlW3RvSG91cl0sIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDB9KTtcbiAgICB9XG4gICAgdGhpcy5yZUZvcm1hdElucHV0KCk7XG4gIH07XG5cbiAgY2hhbmdlTWVyaWRpYW5UaW1lID0gKG5ld01lcmlkaWFuLCBtb2RlKSA9PiB7XG4gICAgY29uc3QgaXNTdGFydE9yRW5kID0gKG1vZGUgPT09ICdzdGFydCcpID8gJ3N0YXJ0RGF0ZScgOiAnZW5kRGF0ZSc7XG4gICAgaWYgKG5ld01lcmlkaWFuID09PSAnQU0nICYmIHRoaXNbaXNTdGFydE9yRW5kXS5ob3VycygpID4gMTIpIHtcbiAgICAgIHRoaXNbaXNTdGFydE9yRW5kXS5ob3Vycyh0aGlzW2lzU3RhcnRPckVuZF0uaG91cnMoKSAtIDEyKTtcbiAgICB9IGVsc2UgaWYgKG5ld01lcmlkaWFuID09PSAnUE0nICYmIHRoaXNbaXNTdGFydE9yRW5kXS5ob3VycygpIDw9IDEyKSB7XG4gICAgICB0aGlzW2lzU3RhcnRPckVuZF0uaG91cnModGhpc1tpc1N0YXJ0T3JFbmRdLmhvdXJzKCkgKyAxMik7XG4gICAgfSBlbHNlIGlmIChuZXdNZXJpZGlhbiA9PT0gJ0FNJyAmJiB0aGlzLnN0YXJ0RGF0ZS5ob3VycygpIDw9IDEyKSB7XG4gICAgICB0aGlzW2lzU3RhcnRPckVuZF0uaG91cnModGhpc1tpc1N0YXJ0T3JFbmRdLmhvdXJzKCkgLSAxKTtcbiAgICB9XG4gICAgaWYgKG1vZGUgPT09ICdzdGFydCcpIHtcbiAgICAgIHRoaXMudmFsdWVJbnB1dEhvdXJbbW9kZV0gPSB0aGlzW2lzU3RhcnRPckVuZF0uaG91cnModGhpc1tpc1N0YXJ0T3JFbmRdLmhvdXJzKCkpLmZvcm1hdCgnaGgnKTtcbiAgICB9XG4gICAgaWYgKG1vZGUgPT09ICdlbmQnKSB7XG4gICAgICB0aGlzLnZhbHVlSW5wdXRIb3VyW21vZGVdID0gdGhpc1tpc1N0YXJ0T3JFbmRdLmhvdXJzKHRoaXNbaXNTdGFydE9yRW5kXS5ob3VycygpKS5mb3JtYXQoJ2hoJyk7XG4gICAgfVxuICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICB9O1xuXG4gIHNldE9wdGlvbnMoKSB7XG4gICAgbW9tZW50LmxvY2FsZSh0aGlzLmxvY2FsZSk7XG4gICAgdGhpcy5nZW5lcmF0ZUFsbEdyaWQoKTtcbiAgICB0aGlzLmZvcm1hdElucHV0VGltZSA9ICh0aGlzLm1lcmlkaWFuVGltZSkgPyBgRCBNTU0sIFlZWVkgaGg6bW0gQWAgOiBgRCBNTU0sIFlZWVkgSEg6bW1gO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmNhdCB2YWx1ZXMgZGF0ZSB0byBzdHJpbmcgZm9ybWF0IGZvciBzaG93IGluIGlucHV0XG4gICAqL1xuICBjb25jYXRWYWx1ZUlucHV0ID0gKCkgPT4ge1xuICAgIGxldCBjb25jYXRWYWx1ZSA9IFtdO1xuICAgIGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZS5pc1ZhbGlkKCkpIHtcbiAgICAgIGNvbmNhdFZhbHVlID0gW1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQodGhpcy5mb3JtYXRJbnB1dERhdGUpLFxuICAgICAgICAodGhpcy5lbmREYXRlICYmIHRoaXMuZW5kRGF0ZS5pc1ZhbGlkKCkpID8gJyAgLSAgJyA6ICcnLFxuICAgICAgICAodGhpcy5lbmREYXRlICYmIHRoaXMuZW5kRGF0ZS5pc1ZhbGlkKCkpID8gdGhpcy5lbmREYXRlLmZvcm1hdCh0aGlzLmZvcm1hdElucHV0RGF0ZSkgOiAnJ1xuICAgICAgXTtcbiAgICB9XG5cbiAgICB0aGlzLnZhbHVlID0gY29uY2F0VmFsdWUuam9pbignJyk7XG4gICAgdGhpcy5pc0ludmFsaWQgPSAhKHRoaXMudmFsdWUubGVuZ3RoKTtcbiAgICB0aGlzLnNlbGVjdGVkID0ge1xuICAgICAgc3RhcnREYXRlOiAodGhpcy5zdGFydERhdGUgJiYgdGhpcy5zdGFydERhdGUuaXNWYWxpZCgpKSA/IHRoaXMuc3RhcnREYXRlLnRvRGF0ZSgpIDogbnVsbCxcbiAgICAgIGVuZERhdGU6ICh0aGlzLmVuZERhdGUgJiYgdGhpcy5lbmREYXRlLmlzVmFsaWQoKSkgPyB0aGlzLmVuZERhdGUudG9EYXRlKCkgOiBudWxsXG4gICAgfTtcbiAgfTtcblxuICBzZXRBY2Nlc3MoKSB7XG4gICAgdGhpcy5jYW5BY2Nlc3NQcmV2aW91cyA9IHRoaXMuY2FuQ2hhbmdlTmF2TW9udGgoLTEpO1xuICAgIHRoaXMuY2FuQWNjZXNzTmV4dCA9IHRoaXMuY2FuQ2hhbmdlTmF2TW9udGgoMSk7XG4gIH1cblxuICBjaGFuZ2VOYXZNb250aChudW06IG51bWJlciwgbW9kZSA9ICduZXh0Jykge1xuICAgIGlmICh0aGlzLmNhbkNoYW5nZU5hdk1vbnRoKG51bSkpIHtcbiAgICAgIHRoaXMubmF2RGF0ZS5hZGQobnVtLCAnbW9udGgnKTtcbiAgICAgIHRoaXMuY3VycmVudE1vbnRoID0gdGhpcy5uYXZEYXRlLm1vbnRoKCkgKyAxO1xuICAgICAgdGhpcy5jdXJyZW50WWVhciA9IHRoaXMubmF2RGF0ZS55ZWFyKCk7XG4gICAgICBpZiAodGhpcy5kYXRhTW9udGhzLmhhc093blByb3BlcnR5KHRoaXMuY3VycmVudFllYXIpICYmIHRoaXMuZGF0YU1vbnRoc1t0aGlzLmN1cnJlbnRZZWFyXS5oYXNPd25Qcm9wZXJ0eSh0aGlzLmN1cnJlbnRNb250aCkpIHtcbiAgICAgICAgdGhpcy5kYXRhTW9udGhzW3RoaXMuY3VycmVudFllYXJdW3RoaXMuY3VycmVudE1vbnRoXSA9IFtdO1xuICAgICAgfVxuICAgICAgdGhpcy5tYWtlR3JpZEN1c3RvbSh0aGlzLmN1cnJlbnRZZWFyLCB0aGlzLmN1cnJlbnRNb250aCk7XG4gICAgfVxuICB9XG5cbiAgZ2VuZXJhdGVBbGxHcmlkID0gKCkgPT4ge1xuICAgIGNvbnN0IGRhdGVPYmplY3RDdXJyZW50ID0gbW9tZW50KCkuc3RhcnRPZigneWVhcicpLmNsb25lKCk7XG4gICAgWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTJdLmZvckVhY2goYSA9PiB7XG4gICAgICB0aGlzLm1ha2VHcmlkQ3VzdG9tKGRhdGVPYmplY3RDdXJyZW50LnllYXIoKSwgYSk7XG4gICAgfSk7XG5cbiAgfTtcblxuICBjYW5DaGFuZ2VOYXZNb250aChudW06IG51bWJlcikge1xuICAgIGNvbnN0IGNsb25lZERhdGUgPSBtb21lbnQodGhpcy5uYXZEYXRlKTtcbiAgICByZXR1cm4gdGhpcy5jYW5DaGFuZ2VOYXZNb250aExvZ2ljKG51bSwgY2xvbmVkRGF0ZSk7XG4gIH1cblxuICBtYWtlSGVhZGVyKCkge1xuICAgIGNvbnN0IHdlZWtEYXlzQXJyOiBBcnJheTxudW1iZXI+ID0gWzAsIDEsIDIsIDMsIDQsIDUsIDZdO1xuICAgIHdlZWtEYXlzQXJyLmZvckVhY2goZGF5ID0+IHRoaXMud2Vla0RheXNIZWFkZXJBcnIucHVzaChtb21lbnQoKS53ZWVrZGF5KGRheSkuZm9ybWF0KCdkZGQnKSkpO1xuICB9XG5cbiAgZ2V0RGltZW5zaW9ucyhkYXRlOiBhbnkpIHtcbiAgICBjb25zdCBmaXJzdERheURhdGUgPSBtb21lbnQoZGF0ZSkuc3RhcnRPZignbW9udGgnKTtcbiAgICB0aGlzLmluaXRpYWxFbXB0eUNlbGxzID0gZmlyc3REYXlEYXRlLndlZWtkYXkoKTtcbiAgICBjb25zdCBsYXN0RGF5RGF0ZSA9IG1vbWVudChkYXRlKS5lbmRPZignbW9udGgnKTtcbiAgICB0aGlzLmxhc3RFbXB0eUNlbGxzID0gNiAtIGxhc3REYXlEYXRlLndlZWtkYXkoKTtcbiAgICB0aGlzLmFycmF5TGVuZ3RoID0gdGhpcy5pbml0aWFsRW1wdHlDZWxscyArIHRoaXMubGFzdEVtcHR5Q2VsbHMgKyBkYXRlLmRheXNJbk1vbnRoKCk7XG4gIH1cblxuICBtYWtlR3JpZEN1c3RvbSA9ICh5ZWFyID0gbnVsbCwgbW9udGggPSBudWxsKSA9PiB7XG4gICAgY29uc3QgZGF0ZU9mVHVybiA9IG1vbWVudChgJHt5ZWFyfS0ke21vbnRofS0wMWAsICdZWVlZLU0tREQnKTtcbiAgICAvKipcbiAgICAgKiBJcyBPS1xuICAgICAqL1xuICAgIGlmICghdGhpcy5kYXRhTW9udGhzLmhhc093blByb3BlcnR5KHllYXIpKSB7XG4gICAgICB0aGlzLmRhdGFNb250aHNbeWVhcl0gPSB7fTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSXMgT0tcbiAgICAgKi9cbiAgICBpZiAoIXRoaXMuZGF0YU1vbnRoc1t5ZWFyXS5oYXNPd25Qcm9wZXJ0eShtb250aCkpIHtcbiAgICAgIHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVttb250aF0gPSBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRml4XG4gICAgICovXG5cbiAgICBjb25zdCBmaXJzdERheURhdGUgPSBtb21lbnQoZGF0ZU9mVHVybikuc3RhcnRPZignbW9udGgnKTtcbiAgICBjb25zdCBsYXN0RGF5RGF0ZSA9IG1vbWVudChkYXRlT2ZUdXJuKS5lbmRPZignbW9udGgnKTtcbiAgICB0aGlzLmRhdGFNb250aHNbeWVhcl1bYGluaXRpYWxFbXB0eUNlbGxzJHttb250aH1gXSA9IGZpcnN0RGF5RGF0ZS53ZWVrZGF5KCk7XG4gICAgdGhpcy5kYXRhTW9udGhzW3llYXJdW2BsYXN0RW1wdHlDZWxscyR7bW9udGh9YF0gPSA2IC0gbGFzdERheURhdGUud2Vla2RheSgpO1xuXG4gICAgY29uc3QgaW5pdEVtcHR5Q2VsbCA9IHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVtgaW5pdGlhbEVtcHR5Q2VsbHMke21vbnRofWBdO1xuICAgIGNvbnN0IGxhc3RFbXB0eUNlbGwgPSB0aGlzLmRhdGFNb250aHNbeWVhcl1bYGxhc3RFbXB0eUNlbGxzJHttb250aH1gXTtcblxuICAgIHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVtgYXJyYXlMZW5ndGgke21vbnRofWBdID0gaW5pdEVtcHR5Q2VsbCArIGxhc3RFbXB0eUNlbGwgKyBkYXRlT2ZUdXJuLmRheXNJbk1vbnRoKCk7XG5cbiAgICBjb25zdCBhcnJheUxlbmd0aHMgPSB0aGlzLmRhdGFNb250aHNbeWVhcl1bYGFycmF5TGVuZ3RoJHttb250aH1gXTtcblxuICAgIHRoaXMuZ2V0RGltZW5zaW9ucyhkYXRlT2ZUdXJuKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5TGVuZ3RoczsgaSsrKSB7XG4gICAgICBjb25zdCBvYmo6IGFueSA9IHt9O1xuICAgICAgaWYgKGkgPCBpbml0RW1wdHlDZWxsIHx8IGkgPiBpbml0RW1wdHlDZWxsICsgZGF0ZU9mVHVybi5kYXlzSW5Nb250aCgpIC0gMSkgeyAvLyAwIDwgMCBOTyB8fCAwID4gKDAtMSkgU0lcbiAgICAgICAgb2JqLnZhbHVlID0gMDtcbiAgICAgICAgb2JqLmF2YWlsYWJsZSA9IGZhbHNlO1xuICAgICAgICBvYmouaXNUb2RheSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqLnZhbHVlID0gaSAtIGluaXRFbXB0eUNlbGwgKyAxO1xuICAgICAgICBvYmouYXZhaWxhYmxlID0gdGhpcy5pc0F2YWlsYWJsZShpIC0gaW5pdEVtcHR5Q2VsbCArIDEpO1xuICAgICAgICBvYmouaXNUb2RheSA9IHRoaXMuaXNUb2RheShpIC0gaW5pdEVtcHR5Q2VsbCArIDEsIG1vbnRoLCB5ZWFyKTtcbiAgICAgICAgb2JqLm1vbnRoID0gbW9udGg7XG4gICAgICAgIG9iai5kYXRlID0gZGF0ZU9mVHVybjtcbiAgICAgICAgb2JqLnllYXIgPSB5ZWFyO1xuICAgICAgICBvYmouaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIob2JqLnZhbHVlLCBtb250aCwgeWVhcikuaXNTYW1lKHRoaXMuc3RhcnREYXRlKSkge1xuICAgICAgICAgIHRoaXMuc3RhcnREYXkgPSBvYmo7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIob2JqLnZhbHVlLCBtb250aCwgeWVhcikuaXNTYW1lKHRoaXMuZW5kRGF0ZSkpIHtcbiAgICAgICAgICB0aGlzLmVuZERheSA9IG9iajtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2JqLmlzVG9kYXkgJiYgIXRoaXMuc3RhcnREYXkgJiYgIXRoaXMuZW5kRGF5KSB7XG4gICAgICAgICAgdGhpcy5zdGFydERheSA9IG9iajtcbiAgICAgICAgICB0aGlzLmVuZERheSA9IG9iajtcbiAgICAgICAgICBvYmouaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvYmouaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kYXRhTW9udGhzW3llYXJdW21vbnRoXS5wdXNoKG9iaik7XG4gICAgfVxuICB9O1xuXG4gIGlzQXZhaWxhYmxlKG51bTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZGF0ZVRvQ2hlY2sgPSB0aGlzLmRhdGVGcm9tTnVtKG51bSwgdGhpcy5uYXZEYXRlKTtcbiAgICByZXR1cm4gdGhpcy5pc0F2YWlsYWJsZUxvZ2ljKGRhdGVUb0NoZWNrKTtcbiAgfVxuXG4gIGlzVG9kYXkobnVtOiBudW1iZXIsIG1vbnRoOiBudW1iZXIsIHllYXI6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGRhdGVUb0NoZWNrID0gbW9tZW50KHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIobnVtLCBtb250aCwgeWVhcikpO1xuICAgIHJldHVybiBkYXRlVG9DaGVjay5pc1NhbWUobW9tZW50KCkuc2V0KHtob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDB9KSk7XG4gIH1cblxuICBkYXRlRnJvbU51bShudW06IG51bWJlciwgcmVmZXJlbmNlRGF0ZTogYW55KTogYW55IHtcbiAgICBjb25zdCByZXR1cm5EYXRlID0gbW9tZW50KHJlZmVyZW5jZURhdGUpO1xuICAgIHJldHVybiByZXR1cm5EYXRlLmRhdGUobnVtKTtcbiAgfVxuXG4gIHJlRm9ybWF0SW5wdXQgPSAoKSA9PiB7XG4gICAgdGhpcy5mb3JtYXRJbnB1dERhdGUgPSAodGhpcy5pbmNsdWRlVGltZSkgPyB0aGlzLmZvcm1hdElucHV0VGltZSA6IHRoaXMuZm9ybWF0SW5wdXREYXRlO1xuICAgIHRoaXMuY29uY2F0VmFsdWVJbnB1dCgpO1xuICB9O1xuXG4gIHNlbGVjdERheShkYXk6IGFueSkge1xuICAgIGlmIChkYXkuYXZhaWxhYmxlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRGF0ZSA9IHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIoZGF5LnZhbHVlLCBkYXkubW9udGgsIGRheS55ZWFyKTtcbiAgICAgIGlmICh0aGlzLmluY2x1ZGVFbmREYXRlKSB7XG4gICAgICAgIGNvbnN0IGN1cnJEYXRlID0gdGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihkYXkudmFsdWUsIGRheS5tb250aCwgZGF5LnllYXIpO1xuICAgICAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICBpZiAoY3VyckRhdGUuaXNTYW1lKG1vbWVudCh0aGlzLnN0YXJ0RGF0ZSkuc3RhcnRPZignZGF5JykpKSB7XG4gICAgICAgICAgICAgIHRoaXMubW9kZSA9ICdzdGFydCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJEYXRlLmlzU2FtZU9yQmVmb3JlKHRoaXMuc3RhcnREYXRlKSkge1xuICAgICAgICAgICAgICB0aGlzLmVuZERheSA9IHRoaXMuc3RhcnREYXk7XG4gICAgICAgICAgICAgIHRoaXMuc3RhcnREYXkgPSBkYXk7XG4gICAgICAgICAgICAgIHRoaXMubW9kZSA9ICdzdGFydCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmVuZERheSA9IGRheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgICAgICAgIGlmIChjdXJyRGF0ZS5pc1NhbWUobW9tZW50KHRoaXMuZW5kRGF0ZSkuc3RhcnRPZignZGF5JykpKSB7XG4gICAgICAgICAgICAgIHRoaXMubW9kZSA9ICdlbmQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyRGF0ZS5pc1NhbWVPckFmdGVyKHRoaXMuZW5kRGF0ZSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGFydERheSA9IHRoaXMuZW5kRGF5O1xuICAgICAgICAgICAgICB0aGlzLmVuZERheSA9IGRheTtcbiAgICAgICAgICAgICAgdGhpcy5tb2RlID0gJ2VuZCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gZGF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuZ2VuZXJhdGVEYXRlKHRoaXMuc3RhcnREYXksIHRoaXMuc3RhcnREYXRlKTtcbiAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5nZW5lcmF0ZURhdGUodGhpcy5lbmREYXksIHRoaXMuZW5kRGF0ZSk7XG4gICAgICAgIHRoaXMuYXBwbHlSYW5nZSgpO1xuICAgICAgICB0aGlzLnN0YXJ0RGF5LmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbmREYXkuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0ge1xuICAgICAgICAgIHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUudG9EYXRlKCksXG4gICAgICAgICAgZW5kRGF0ZTogdGhpcy5lbmREYXRlLnRvRGF0ZSgpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc2V0QWN0aXZpdHkoKTtcblxuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuc2VsZWN0ZWREYXRlO1xuICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gZGF5O1xuICAgICAgICB0aGlzLnN0YXJ0RGF5LmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHtcbiAgICAgICAgICBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlLnRvRGF0ZSgpLFxuICAgICAgICAgIGVuZERhdGU6IG51bGxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lbWl0U2VsZWN0ZWQuZW1pdCh0aGlzLnNlbGVjdGVkKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLmVuZERhdGUpIHtcbiAgICAgICAgdGhpcy5lbWl0U2VsZWN0ZWQuZW1pdCh0aGlzLnNlbGVjdGVkKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICAgIH1cbiAgfVxuXG4gIGdlbmVyYXRlRGF0ZShkYXk6IGFueSwgZGF0ZTogYW55KSB7XG4gICAgbGV0IGdlbmVyYXRlZERhdGUgPSB0aGlzLmRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKGRheS52YWx1ZSwgZGF5Lm1vbnRoLCBkYXkueWVhcik7XG4gICAgaWYgKGRhdGUpIHtcbiAgICAgIGdlbmVyYXRlZERhdGUgPSBnZW5lcmF0ZWREYXRlLnNldCh7aG91cjogZGF0ZS5ob3VyKCksIG1pbnV0ZTogZGF0ZS5taW51dGUoKX0pO1xuICAgIH1cbiAgICByZXR1cm4gZ2VuZXJhdGVkRGF0ZTtcbiAgfVxuXG4gIHJlc2V0UmFuZ2UoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5kYXRhTW9udGhzKS5mb3JFYWNoKHllYXIgPT4ge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5kYXRhTW9udGhzW3llYXJdKS5mb3JFYWNoKG1vbnRoID0+IHtcbiAgICAgICAgaWYgKCFpc05hTihOdW1iZXIobW9udGgpKSkge1xuICAgICAgICAgIHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVttb250aF0ubWFwKGRheSA9PiB7XG4gICAgICAgICAgICBkYXkuaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgZGF5LmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXNldEFjdGl2aXR5KCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZGF0YU1vbnRocykuZm9yRWFjaCh5ZWFyID0+IHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZGF0YU1vbnRoc1t5ZWFyXSkuZm9yRWFjaChtb250aCA9PiB7XG4gICAgICAgIGlmICghaXNOYU4oTnVtYmVyKG1vbnRoKSkpIHtcbiAgICAgICAgICB0aGlzLmRhdGFNb250aHNbeWVhcl1bbW9udGhdLm1hcChkYXkgPT4ge1xuICAgICAgICAgICAgZGF5LmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIoZGF5LCBtb250aCwgeWVhcikge1xuICAgIGxldCB0aW1lT2JqZWN0ID0ge2hvdXI6IDAsIG1pbnV0ZTogMCwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMH07XG4gICAgaWYgKHRoaXMuaW5jbHVkZVRpbWUpIHtcbiAgICAgIHRpbWVPYmplY3QgPSB7aG91cjogdGhpcy5zdGFydERhdGUuaG91cigpLCBtaW51dGU6IHRoaXMuc3RhcnREYXRlLm1pbnV0ZSgpLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwfTtcbiAgICAgIHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnaDptbSBBJyk7XG4gICAgfVxuICAgIHJldHVybiBtb21lbnQoYCR7eWVhcn0tJHttb250aH0tJHtkYXl9YCwgJ1lZWVktTS1ERCcpLnNldCh0aW1lT2JqZWN0KTtcbiAgfVxuXG4gIGFwcGx5UmFuZ2UoKSB7XG4gICAgdGhpcy5nZXREaW1lbnNpb25zKHRoaXMuc3RhcnREYXRlKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgKyB0aGlzLnN0YXJ0RGF5LnZhbHVlIC0gMTtcbiAgICBjb25zdCBzdGFydE1vbnRoTGVuZ3RoID0gdGhpcy5hcnJheUxlbmd0aDtcbiAgICB0aGlzLmdldERpbWVuc2lvbnModGhpcy5lbmREYXRlKTtcbiAgICBjb25zdCBlbmRNb250aExlbmd0aCA9IHRoaXMuYXJyYXlMZW5ndGg7XG4gICAgY29uc3QgZW5kID0gdGhpcy5pbml0aWFsRW1wdHlDZWxscyArIHRoaXMuZW5kRGF5LnZhbHVlIC0gMTtcbiAgICB0aGlzLnJlc2V0UmFuZ2UoKTtcbiAgICBpZiAodGhpcy5zdGFydERheS5tb250aCAhPT0gdGhpcy5lbmREYXkubW9udGggfHwgdGhpcy5zdGFydERheS55ZWFyICE9PSB0aGlzLmVuZERheS55ZWFyKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmRhdGFNb250aHMpLmZvckVhY2goeWVhciA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGVuZGFyID0gdGhpcy5kYXRhTW9udGhzW3llYXJdO1xuICAgICAgICBPYmplY3Qua2V5cyhjYWxlbmRhcikuZm9yRWFjaChtb250aCA9PiB7XG4gICAgICAgICAgaWYgKCFpc05hTihOdW1iZXIobW9udGgpKSkge1xuICAgICAgICAgICAgY29uc3QgZGF5cyA9IHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVttb250aF07XG4gICAgICAgICAgICBpZiAoTnVtYmVyKG1vbnRoKSA9PT0gTnVtYmVyKHRoaXMuc3RhcnREYXkubW9udGgpICYmIE51bWJlcih5ZWFyKSA9PT0gTnVtYmVyKHRoaXMuc3RhcnREYXkueWVhcikpIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF5c1tpXS5pblJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgc3RhcnRNb250aExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF5c1tpXS5pblJhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChOdW1iZXIobW9udGgpID09PSBOdW1iZXIodGhpcy5lbmREYXkubW9udGgpICYmIE51bWJlcih5ZWFyKSA9PT0gTnVtYmVyKHRoaXMuZW5kRGF5LnllYXIpKSB7XG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF5c1tpXS5pblJhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gZW5kICsgMTsgaSA8IGVuZE1vbnRoTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkYXlzW2ldLmluUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICgobW9udGggPiB0aGlzLnN0YXJ0RGF5Lm1vbnRoIHx8IHllYXIgPiB0aGlzLnN0YXJ0RGF5LnllYXIpXG4gICAgICAgICAgICAgICYmIChtb250aCA8IHRoaXMuZW5kRGF5Lm1vbnRoIHx8IHllYXIgPCB0aGlzLmVuZERheS55ZWFyKSkge1xuICAgICAgICAgICAgICBkYXlzLmZvckVhY2goZGF5ID0+IGRheS5pblJhbmdlID0gdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtb250aCA9IHRoaXMuc3RhcnREYXkubW9udGg7XG4gICAgICBjb25zdCB5ZWFyID0gdGhpcy5zdGFydERheS55ZWFyO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVttb250aF1baV0uaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVttb250aF1baV0uaW5SYW5nZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gZW5kICsgMTsgaSA8IHRoaXMuYXJyYXlMZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmRhdGFNb250aHNbeWVhcl1bbW9udGhdW2ldLmluUmFuZ2UgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc0F2YWlsYWJsZUxvZ2ljKGRhdGVUb0NoZWNrOiBhbnkpIHtcbiAgICBpZiAodGhpcy5taW5EYXRlIHx8IHRoaXMubWF4RGF0ZSkge1xuICAgICAgcmV0dXJuICEoZGF0ZVRvQ2hlY2suaXNCZWZvcmUodGhpcy5taW5EYXRlKSB8fCBkYXRlVG9DaGVjay5pc0FmdGVyKHRoaXMubWF4RGF0ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gIWRhdGVUb0NoZWNrLmlzQmVmb3JlKG1vbWVudCgpLCAnZGF5Jyk7XG4gICAgfVxuICB9XG5cbiAgY2FuQ2hhbmdlTmF2TW9udGhMb2dpYyhudW0sIGN1cnJlbnREYXRlKSB7XG4gICAgY3VycmVudERhdGUuYWRkKG51bSwgJ21vbnRoJyk7XG4gICAgY29uc3QgbWluRGF0ZSA9IHRoaXMubWluRGF0ZSA/IHRoaXMubWluRGF0ZSA6IG1vbWVudCgpLmFkZCgtMSwgJ21vbnRoJyk7XG4gICAgY29uc3QgbWF4RGF0ZSA9IHRoaXMubWF4RGF0ZSA/IHRoaXMubWF4RGF0ZSA6IG1vbWVudCgpLmFkZCgxLCAneWVhcicpO1xuICAgIHJldHVybiBjdXJyZW50RGF0ZS5pc0JldHdlZW4obWluRGF0ZSwgbWF4RGF0ZSk7XG4gIH1cblxuICB0b2dnbGVDYWxlbmRhcigpOiBhbnkge1xuICAgIHRoaXMuaXNPcGVuID0gIXRoaXMuaXNPcGVuO1xuICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICB9XG5cbiAgb3BlbkNhbGVuZGFyKCk6IGFueSB7XG4gICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuICAgIHRoaXMub25Ub3VjaCgpO1xuICB9XG5cbiAgY2xvc2VDYWxlbmRhcigpOiBhbnkge1xuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgdGhpcy5yZUZvcm1hdElucHV0KCk7XG4gICAgdGhpcy5lbWl0U2VsZWN0ZWQuZW1pdCh0aGlzLnNlbGVjdGVkKTtcblxuICB9XG5cbiAgY2hhbmdlTW9kZShtb2RlOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgIHRoaXMub25Ub3VjaCgpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5yZXNldFJhbmdlKCk7XG4gICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoKTtcbiAgICB0aGlzLmVuZERhdGUgPSBudWxsO1xuICAgIHRoaXMubmF2RGF0ZSA9IHRoaXMudG9kYXlEYXRlO1xuICAgIHRoaXMuY3VycmVudE1vbnRoID0gdGhpcy5uYXZEYXRlLm1vbnRoKCk7XG4gICAgdGhpcy5jdXJyZW50WWVhciA9IHRoaXMubmF2RGF0ZS55ZWFyKCk7XG4gICAgdGhpcy5pbmNsdWRlRW5kRGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuaW5jbHVkZVRpbWUgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG51bGw7XG4gICAgdGhpcy5lbmRUaW1lID0gbnVsbDtcbiAgICB0aGlzLm1vZGUgPSAnc3RhcnQnO1xuICAgIHRoaXMubWFrZUdyaWRDdXN0b20odGhpcy5jdXJyZW50WWVhciwgdGhpcy5jdXJyZW50TW9udGgpO1xuICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICB9XG5cbiAgc2V0VGltZShtb21lbnQsIGhvdXI6IG51bWJlciA9IDAsIG1pbnV0ZTogbnVtYmVyID0gMCkge1xuICAgIHJldHVybiBtb21lbnQuc2V0KHtob3VyLCBtaW51dGUsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDB9KTtcbiAgfVxuXG4gIGhhbmRsZU1vZGVDaGFuZ2UoKSB7XG4gICAgdGhpcy5yZXNldFJhbmdlKCk7XG4gICAgdGhpcy5tb2RlID0gJ2VuZCc7XG4gICAgaWYgKHRoaXMuc3RhcnREYXkpIHtcbiAgICAgIHRoaXMuc3RhcnREYXkuaXNBY3RpdmUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaW5jbHVkZUVuZERhdGUpIHtcbiAgICAgIHRoaXMuZW5kRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLm1vZGUgPSAnc3RhcnQnO1xuICAgICAgdGhpcy5zdGFydERheS5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5lbmREYXkuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdG1wU3RhcnREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcbiAgICAgIC8vIGNvbnN0IG5leHREYXkgPSB0bXBTdGFydERhdGUuYWRkKDIsICdkYXlzJykuZm9ybWF0KGBZWVlZLSR7dG1wU3RhcnREYXRlLmZvcm1hdCgnTScpIC0gMX0tRGApO1xuICAgICAgLy8gdGhpcy5zaW11bGF0ZUNsaWNrKG5leHREYXksICdjYWxlbmRhci1kYXktbm90LXJhbmdlJyk7XG4gICAgfVxuXG4gIH1cblxuICBzZXRTdGFydFRpbWUodGltZSkge1xuICAgIHRoaXMuc3RhcnRUaW1lID0gdGltZTtcbiAgfVxuXG4gIHNldEVuZFRpbWUodGltZSkge1xuICAgIHRoaXMuZW5kVGltZSA9IHRpbWU7XG4gIH1cblxuICBoYW5kbGVUaW1lQ2hhbmdlKHRpbWU6IGFueSwgbW9tZW50OiBhbnksIG1vZGU6IHN0cmluZykge1xuICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICAgIGlmICghdGltZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aW1lID0gdGltZS5yZXBsYWNlKC9bXmEtekEtWjAtOV0vZywgJycpO1xuICAgIG1vbWVudC5zZXQoe2hvdXI6IDAsIG1pbnV0ZTogMCwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMH0pO1xuICAgIGxldCBsYXN0VHdvID0gdGltZS5zdWJzdHIodGltZS5sZW5ndGggLSAyKS50b1VwcGVyQ2FzZSgpO1xuICAgIGxldCBsYXN0ID0gdGltZS5zdWJzdHIodGltZS5sZW5ndGggLSAxKS50b1VwcGVyQ2FzZSgpO1xuICAgIGNvbnN0IGhhc0xhc3RUd28gPSBbJ0FNJywgJ1BNJ10uaW5jbHVkZXMobGFzdFR3byk7XG4gICAgY29uc3QgaGFzTGFzdCA9IFsnQScsICdQJ10uaW5jbHVkZXMobGFzdCk7XG4gICAgbGV0IGlzQW0gPSB0cnVlO1xuICAgIGxldCBpc1BtID0gZmFsc2U7XG4gICAgaWYgKGhhc0xhc3QgfHwgaGFzTGFzdFR3bykge1xuICAgICAgaXNBbSA9IGxhc3QgPT09ICdBJyB8fCBsYXN0VHdvID09PSAnQU0nO1xuICAgICAgaXNQbSA9IGxhc3QgPT09ICdQJyB8fCBsYXN0VHdvID09PSAnUE0nO1xuICAgIH1cbiAgICB0aW1lID0gdGltZS5yZXBsYWNlKC9bXjAtOV0vZywgJycpO1xuICAgIGxhc3RUd28gPSB0aW1lLnN1YnN0cih0aW1lLmxlbmd0aCAtIDIpO1xuICAgIGxhc3QgPSB0aW1lLnN1YnN0cih0aW1lLmxlbmd0aCAtIDEpO1xuICAgIHRpbWUgPSB0aW1lLnN1YnN0cigwLCA0KTtcbiAgICB0aGlzLmlzSW52YWxpZCA9IGZhbHNlO1xuICAgIHN3aXRjaCAodGltZS5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbW9tZW50XG4gICAgICAgICAgPSBpc0FtID8gdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWUpKSA6XG4gICAgICAgICAgdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWUpICsgMTIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaWYgKGxhc3QgPj0gNikge1xuICAgICAgICAgIHRoaXMuaXNJbnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGltZSA9PT0gMTIpIHtcbiAgICAgICAgICBtb21lbnRcbiAgICAgICAgICAgID0gaXNBbSA/IHRoaXMuc2V0VGltZShtb21lbnQsIDApIDpcbiAgICAgICAgICAgIHRoaXMuc2V0VGltZShtb21lbnQsIDEyKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aW1lIDwgMTIpIHtcbiAgICAgICAgICBtb21lbnRcbiAgICAgICAgICAgID0gaXNBbSA/IHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lKSkgOlxuICAgICAgICAgICAgdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWUpICsgMTIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vbWVudFxuICAgICAgICAgICAgPSBpc0FtID8gdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWVbMF0pLCBOdW1iZXIobGFzdCkpIDpcbiAgICAgICAgICAgIHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lWzBdKSArIDEyLCBOdW1iZXIobGFzdCkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBpZiAobGFzdFR3byA+PSA2MCkge1xuICAgICAgICAgIHRoaXMuaXNJbnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb21lbnRcbiAgICAgICAgICAgID0gaXNBbSA/IHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lWzBdKSwgTnVtYmVyKGxhc3RUd28pKSA6XG4gICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSkgKyAxMiwgTnVtYmVyKGxhc3RUd28pKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgaWYgKGxhc3RUd28gPj0gNjApIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbW9tZW50ID0gdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWUuc3Vic3RyKDAsIDIpKSwgTnVtYmVyKGxhc3RUd28pKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLmVtaXRTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWQpO1xuICAgIGlmIChtb2RlID09PSAnc3RhcnQnKSB7XG4gICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudDtcbiAgICAgIHRoaXMuc3RhcnRUaW1lUGlja2VyLm5hdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVuZERhdGUgPSBtb21lbnQ7XG4gICAgICB0aGlzLmVuZFRpbWVQaWNrZXIubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==