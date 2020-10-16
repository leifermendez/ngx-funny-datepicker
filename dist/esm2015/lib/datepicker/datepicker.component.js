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
                (this.endDate) ? '  -  ' : '',
                (this.endDate) ? this.endDate.format(this.formatInputDate) : ''
            ];
            this.value = concatValue.join('');
            this.isInvalid = !(this.value.length);
            this.selected = {
                startDate: (this.startDate) ? this.startDate.toDate() : null,
                endDate: (this.endDate) ? this.endDate.toDate() : null
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
            this.startDate = moment();
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
                template: "<!-- ********* INPUT FROM DATE Collaborator https://github.com/leifermendez ***************** --->\n\n<input (click)=\"openCalendar()\" readonly spellcheck=\"false\" class=\"omit-trigger-outside input-date-funny {{classInput}}\"\n  autocomplete=\"nope\" [value]=\"value\" [disabled]=\"isDisabled\" (input)=\"onInput($event.target.value)\" [ngClass]=\"{\n    'date-picker-valid ng-valid': !isInvalid,\n     'date-picker-invalid ng-invalid': isInvalid,\n     'funny-range':includeEndDate,\n     'ng-opened': isOpen,\n     'ng-touched': onTouched,\n     'ng-untouched': !onTouched\n    }\" type=\"text\">\n\n<!--- *************** CALENDAR ELEMENTS Author https://github.com/mokshithpyla ************* --->\n<div (clickOutside)=\"closeCalendar()\" class=\"calendar\" *ngIf=\"isOpen\">\n  <!-- **** CALENDAR NAVIGATION ****-->\n  <div class=\"calendar-nav\">\n    <div class=\"calendar-nav-previous-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(-1)\" [disabled]=\"!canAccessPrevious\">\n        <i class=\"fa fa-chevron-left\"></i>\n      </button>\n    </div>\n    <div>{{navDate.format('MMMM YYYY')}}</div>\n    <div class=\"calendar-nav-next-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(1)\" [disabled]=\"!canAccessNext\">\n        <i class=\"fa fa-chevron-right\"></i>\n      </button>\n    </div>\n  </div>\n\n  <!--- **** CALENDAR CONTAINER ****-->\n\n  <div class=\"calendar-container\">\n    <div class=\"calendar-header\">\n      <div class=\"calendar-date\" *ngFor=\"let day of weekDaysHeaderArr\" [innerText]=\"day\"></div>\n    </div>\n    <div class=\"calendar-body\">\n      <!---**** LOAD TEMPLATE*** --->\n      <ng-container *ngTemplateOutlet=\"templateCalendar;context:{\n      data:dataMonths,\n      year:navDate.format('YYYY'),\n      month:navDate.format('M'),\n      includeEndDate:includeEndDate,\n      startDay:null,\n      endDate:null}\"></ng-container>\n    </div>\n\n    <div class=\"footer-calendar\">\n      <div class=\"flex justify-content-between options-bar divider\">\n        <div class=\"flex\">\n          <div class=\"label-placeholder label-option pr-25\">\n            <input type=\"checkbox\" [(ngModel)]=\"includeEndDate\" (change)=\"handleModeChange()\">\n            <small>{{rangeLabel}}</small>\n          </div>\n          <div class=\"label-placeholder label-option pr-25\">\n            <input\n              (change)=\"reFormatInput();handleTimeChange(startTime, startDate, 'start');handleTimeChange(endTime, endDate, 'end')\"\n              [(ngModel)]=\"includeTime\" type=\"checkbox\">\n            <small>{{timeLabel}}</small>\n          </div>\n        </div>\n        <div class=\"label-placeholder label-option pr-25\">\n          <div (click)=\"clear()\">{{clearLabel}}</div>\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{startDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{startDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{startDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <ng-container\n            *ngTemplateOutlet=\"templateTimeInput;context:{mode:'start',startDate:startDate,timeShow:includeTime}\">\n          </ng-container>\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\" *ngIf=\"includeEndDate\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{endDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{endDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{endDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <ng-container *ngTemplateOutlet=\"templateTimeInput;context:{mode:'end',endDate:endDate,timeShow:includeTime}\">\n          </ng-container>\n        </div>\n      </div>\n    </div>\n  </div>\n\n</div>\n\n<!--- ********** TEMPLATE BODY CALENDAR*************** -->\n<ng-template #templateCalendar let-data=\"data\" let-year=\"year\" let-includedend=\"includeEndDate\" let-month=\"month\"\n  let-start=\"startDay\" let-end=\"endDate\">\n  <ng-container *ngIf=\"includeEndDate\">\n    <div *ngFor=\"let day of data[year][month]\"\n      class=\"calendar-date calendar-day-not-range-{{year}}-{{month}}-{{day?.value}}\" [ngClass]=\"{\n          'is-disabled': !day?.available,\n          'calendar-range': day?.inRange,\n          'calendar-range-start': day?.value === start?.value && day?.month === start?.month && day?.year === start?.year ,\n          'calendar-range-end': day?.value === end?.value && day?.month === end?.month && day?.year === end?.year}\">\n      <button type=\"button\" *ngIf=\"day.value !== 0\" class=\"date-item\"\n        [ngClass]=\"{'is-active': day?.isActive, 'is-today': day?.isToday}\" (click)=\"selectDay(day)\">\n        {{day.value}}</button>\n      <button type=\"button\" *ngIf=\"day?.value === 0\" class=\"date-item\"></button>\n    </div>\n  </ng-container>\n\n  <ng-container *ngIf=\"!includeEndDate\">\n    <div *ngFor=\"let day of data[year][month]\" class=\"calendar-date\" [ngClass]=\"{'is-disabled': !day?.available }\">\n      <button *ngIf=\"day?.value !== 0\" class=\"date-item\" type=\"button\"\n        [ngClass]=\"{'is-active': day?.isActive, 'is-today': day?.isToday}\"\n        (click)=\"selectDay(day)\">{{day?.value}}</button>\n      <button type=\"button\" *ngIf=\"day?.value === 0\" class=\"date-item\"></button>\n    </div>\n  </ng-container>\n</ng-template>\n<!--- ********** TEMPLATE INPUT TIME*************** -->\n<ng-template #templateTimeInput let-mode=\"mode\" let-show=\"timeShow\" let-start=\"startDate\" let-end=\"endDate\">\n\n  <ng-container *ngIf=\"show\">\n    <div class=\"meridian-buttons\" *ngIf=\"meridianTime && mode === 'start'\">\n      <div>\n        <button (click)=\"changeMeridianTime('AM','start')\" [disabled]=\"startDate && startDate.format('A') === 'AM'\"\n          type=\"button\">AM\n        </button>\n      </div>\n      <div>\n        <button (click)=\"changeMeridianTime('PM','start')\" [disabled]=\"startDate && startDate.format('A') === 'PM'\"\n          type=\"button\">PM\n        </button>\n      </div>\n    </div>\n    <div class=\"meridian-buttons\" *ngIf=\"meridianTime && endDate && mode === 'end'\">\n      <div>\n        <button (click)=\"changeMeridianTime('AM','end')\" [disabled]=\"endDate && endDate.format('A') === 'AM'\"\n          type=\"button\">AM\n        </button>\n      </div>\n      <div>\n        <button (click)=\"changeMeridianTime('PM','end')\" [disabled]=\"endDate && endDate.format('A') === 'PM'\"\n          type=\"button\">PM\n        </button>\n      </div>\n    </div>\n    <div class=\"calendar-time-input-cells\" *ngIf=\"mode === 'start'\">\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkHourValidate($event,'start')\"\n          [max]=\"maxInputHour\" [min]=\"minInputHour\" [(ngModel)]=\"valueInputHour.start\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubHour(1,'start')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubHour(-1,'start')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkMinuteValidate($event,'start')\"\n          [max]=\"maxInputMinute\" [min]=\"minInputMinute\" [(ngModel)]=\"valueInputMinute.start\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubMinute(1,'start')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubMinute(-1,'start')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n    </div>\n    <div class=\"calendar-time-input-cells\" *ngIf=\"endDate && mode === 'end'\">\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkHourValidate($event,'end')\"\n          type=\"button\" [max]=\"maxInputHour\" [min]=\"minInputHour\" [(ngModel)]=\"valueInputHour.end\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubHour(1,'end')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubHour(-1,'end')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkMinuteValidate($event,'end')\"\n          [max]=\"maxInputMinute\" [min]=\"minInputMinute\" [(ngModel)]=\"valueInputMinute.end\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubMinute(1,'end')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubMinute(-1,'end')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n    </div>\n  </ng-container>\n\n</ng-template>\n",
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => DatepickerComponent),
                        multi: true
                    }
                ],
                styles: [".datetimepicker-footer{display:flex;flex:1;justify-content:space-evenly;margin:0}.datetimepicker-selection-start{align-items:center;background:rgba(242,241,238,.6);border-radius:3px;box-shadow:inset 0 0 0 1px rgba(15,15,15,.1),inset 0 1px 1px rgba(15,15,15,.1);display:flex;flex-basis:50%;flex-grow:1;font-size:14px;height:28px;line-height:1.2;padding-left:8px;padding-right:8px}.slider{background-color:#ccc;bottom:0;cursor:pointer;left:0;right:0;top:0}.slider,.slider:before{position:absolute;transition:.4s}.slider:before{background-color:#fff;bottom:4px;content:\"\";height:26px;left:4px;width:26px}input:checked+.slider{background-color:#00d1b2}input:focus+.slider{box-shadow:0 0 1px #00d1b2}input:checked+.slider:before{transform:translateX(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}.pb10{padding-bottom:10px}.flex{display:flex}.w33p{width:33.33%}.align-right{text-align:right}.w56p{width:56.33%}.align-left{text-align:left}.pl10{padding-left:10px}.calendar-nav-next-month>button,.calendar-nav-previous-month>button{background-size:100%;height:25px}.calendar-nav>div{align-items:center;display:flex;height:25px}.calendar-time-input-cells{display:flex;justify-content:center;width:100%}.group-input-item{background:#f7f7f7;display:flex;height:34px;padding:2px}.group-input-item input{border:none;font-size:15px;text-align:center;width:30px}.meridian-buttons button{background:#f7f7f7;border:0;cursor:pointer;font-size:11px;padding:3px}.meridian-buttons div:first-child button{margin-bottom:2px}.meridian-buttons button:disabled,button[disabled]{background-color:#3b3b98;border:0 solid #fff;border-radius:1px;color:#fff}.group-input-item button{align-content:normal;align-items:center;background:#f7f7f7;border:1px solid #f7f7f7;cursor:pointer;display:flex;height:15px;justify-content:center;margin:0;padding:0;width:18px}.group-input-item button:hover{background-color:#d3d3d3}.group-input-item button.up-time:before{border-color:transparent transparent #303438;border-style:solid;border-width:0 4px 5px;content:\"\"}.group-input-item button.down-time:before{border-color:#303438 transparent transparent;border-style:solid;border-width:5px 4px 0;content:\"\"}.group-input-item>div{display:flex;flex-flow:column}input::-webkit-inner-spin-button,input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}input[type=number]{-moz-appearance:textfield}"]
            },] }
];
DatepickerComponent.ctorParameters = () => [
    { type: Renderer2 }
];
DatepickerComponent.propDecorators = {
    value: [{ type: Input }],
    startTimePicker: [{ type: ViewChild, args: ['startTimePicker',] }],
    endTimePicker: [{ type: ViewChild, args: ['endTimePicker',] }],
    showInitialValue: [{ type: Input }],
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
    meridianTime: [{ type: Input }],
    formatInputDate: [{ type: Input }],
    formatInputTime: [{ type: Input }],
    emitSelected: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvTGVpZmVyL1dlYnN0b3JtUHJvamVjdHMvZXhhbXBsZS1saWIvcHJvamVjdHMvbmd4LWZ1bm55LWRhdGVwaWNrZXIvc3JjLyIsInNvdXJjZXMiOlsibGliL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBYyxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEgsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sS0FBSyxPQUFPLE1BQU0sUUFBUSxDQUFDO0FBRWxDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQWN2QixNQUFNLE9BQU8sbUJBQW1CO0lBa0U5QixZQUFvQixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBakU5QixVQUFLLEdBQVEsRUFBRSxDQUFDO1FBV2hCLFdBQU0sR0FBRyxJQUFJLENBQUM7UUFDZCxlQUFVLEdBQUcsT0FBTyxDQUFDO1FBQ3JCLGNBQVMsR0FBRyxNQUFNLENBQUM7UUFDbkIsZUFBVSxHQUFHLE9BQU8sQ0FBQztRQUdyQixvQkFBZSxHQUFHLGFBQWEsQ0FBQztRQUNoQyxvQkFBZSxHQUFHLG1CQUFtQixDQUFDO1FBQ3JDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUdqRCxzQkFBaUIsR0FBa0IsRUFBRSxDQUFDO1FBQ3RDLGVBQVUsR0FBUSxFQUFFLENBQUM7UUFFckIsc0JBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLGtCQUFhLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLGNBQVMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENB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LFNBQUMsZUFBZTsrQkFDekIsS0FBSztzQkFDTCxLQUFLO3NCQUNMLEtBQUs7d0JBQ0wsS0FBSztzQkFDTCxLQUFLO3NCQUNMLEtBQUs7c0JBQ0wsS0FBSzt5QkFDTCxLQUFLO3FCQUNMLEtBQUs7eUJBQ0wsS0FBSzt3QkFDTCxLQUFLO3lCQUNMLEtBQUs7NkJBQ0wsS0FBSzsyQkFDTCxLQUFLOzhCQUNMLEtBQUs7OEJBQ0wsS0FBSzsyQkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCAqIGFzIG1vbWVudF8gZnJvbSAnbW9tZW50JztcblxuY29uc3QgbW9tZW50ID0gbW9tZW50XztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWZ1bm55LWRhdGVwaWNrZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0ZXBpY2tlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2RhdGVwaWNrZXIuY29tcG9uZW50LmNzcyddLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVwaWNrZXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgRGF0ZXBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICBASW5wdXQoKSB2YWx1ZTogYW55ID0gJyc7XG4gIEBWaWV3Q2hpbGQoJ3N0YXJ0VGltZVBpY2tlcicpIHN0YXJ0VGltZVBpY2tlcjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnZW5kVGltZVBpY2tlcicpIGVuZFRpbWVQaWNrZXI6IEVsZW1lbnRSZWY7XG4gIEBJbnB1dCgpIHNob3dJbml0aWFsVmFsdWU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGlzUmFuZ2U6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGhhc1RpbWU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHN0YXJ0RGF0ZTogYW55O1xuICBASW5wdXQoKSBlbmREYXRlOiBhbnk7XG4gIEBJbnB1dCgpIG1pbkRhdGU6IGFueTtcbiAgQElucHV0KCkgbWF4RGF0ZTogYW55O1xuICBASW5wdXQoKSBjbGFzc0lucHV0OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGxvY2FsZSA9ICdlbic7XG4gIEBJbnB1dCgpIHJhbmdlTGFiZWwgPSAnUmFuZ2UnO1xuICBASW5wdXQoKSB0aW1lTGFiZWwgPSAnVGltZSc7XG4gIEBJbnB1dCgpIGNsZWFyTGFiZWwgPSAnQ2xlYXInO1xuICBASW5wdXQoKSBpbmNsdWRlRW5kRGF0ZTogYm9vbGVhbjtcbiAgQElucHV0KCkgbWVyaWRpYW5UaW1lOiBib29sZWFuO1xuICBASW5wdXQoKSBmb3JtYXRJbnB1dERhdGUgPSAnRCBNTU0sIFlZWVknO1xuICBASW5wdXQoKSBmb3JtYXRJbnB1dFRpbWUgPSAnRCBNTU0sIFlZWVkgSEg6bW0nO1xuICBAT3V0cHV0KCkgZW1pdFNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIGlzT3BlbjogYm9vbGVhbjtcbiAgbmF2RGF0ZTogYW55O1xuICB3ZWVrRGF5c0hlYWRlckFycjogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBkYXRhTW9udGhzOiBhbnkgPSB7fTtcbiAgc2VsZWN0ZWREYXRlOiBhbnk7XG4gIGNhbkFjY2Vzc1ByZXZpb3VzID0gdHJ1ZTtcbiAgY2FuQWNjZXNzTmV4dCA9IHRydWU7XG4gIHRvZGF5RGF0ZSA9IG1vbWVudCgpLnNldCh7IGhvdXI6IDAsIG1pbnV0ZTogMCwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgc3RhcnREYXk6IGFueTtcbiAgZW5kRGF5OiBhbnk7XG4gIHJlbmRlcmVkRmxhZyA9IHRydWU7XG4gIG1vZGUgPSAnZW5kJztcbiAgaW5pdGlhbEVtcHR5Q2VsbHM6IG51bWJlcjtcbiAgbGFzdEVtcHR5Q2VsbHM6IG51bWJlcjtcbiAgYXJyYXlMZW5ndGg6IG51bWJlcjtcbiAgY3VycmVudE1vbnRoOiBudW1iZXI7XG4gIGN1cnJlbnRZZWFyOiBudW1iZXI7XG4gIHNlbGVjdGVkOiBhbnk7XG4gIHN0YXJ0VGltZTogYW55O1xuICBlbmRUaW1lOiBhbnk7XG4gIGlzSW52YWxpZCA9IGZhbHNlO1xuICBpbmNsdWRlVGltZTogYm9vbGVhbjtcbiAgbWluSW5wdXRIb3VyID0gMDtcbiAgbWF4SW5wdXRIb3VyID0gMjM7XG4gIHZhbHVlSW5wdXRIb3VyOiBhbnkgPSB7XG4gICAgc3RhcnQ6IHt9LFxuICAgIGVuZDoge31cbiAgfTtcbiAgbWluSW5wdXRNaW51dGUgPSAwO1xuICBtYXhJbnB1dE1pbnV0ZSA9IDU5O1xuICB2YWx1ZUlucHV0TWludXRlOiBhbnkgPSB7XG4gICAgc3RhcnQ6IHt9LFxuICAgIGVuZDoge31cbiAgfTtcbiAgLyoqXG4gICAqIENvbnRyb2xBY2Nlc3NvclxuICAgKi9cbiAgb25Ub3VjaGVkOiBib29sZWFuO1xuICBpc0Rpc2FibGVkOiBib29sZWFuO1xuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHtcbiAgfTtcbiAgb25Ub3VjaCA9ICgpID0+IHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IHRydWU7XG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG5cblxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zZXRPcHRpb25zKCk7XG4gICAgdGhpcy5tYWtlSGVhZGVyKCk7XG4gICAgLyoqXG4gICAgICogU2V0IHN0YXJ0RGF0ZSBhbmQgcGFyc2VcbiAgICAgKi9cblxuICAgIHRoaXMubmF2RGF0ZSA9IG1vbWVudCgpO1xuICAgIHRoaXMudmFsdWVJbnB1dEhvdXIuc3RhcnQgPSB0aGlzLm5hdkRhdGUuZm9ybWF0KCdoaCcpO1xuICAgIHRoaXMudmFsdWVJbnB1dE1pbnV0ZS5zdGFydCA9IHRoaXMubmF2RGF0ZS5mb3JtYXQoJ21tJyk7XG5cbiAgICB0aGlzLnZhbHVlSW5wdXRNaW51dGUuZW5kID0gdGhpcy5uYXZEYXRlLmZvcm1hdCgnbW0nKTtcbiAgICB0aGlzLnZhbHVlSW5wdXRIb3VyLmVuZCA9IHRoaXMubmF2RGF0ZS5mb3JtYXQoJ2hoJyk7XG5cbiAgICBpZiAodGhpcy5zdGFydERhdGUgJiYgbW9tZW50KHRoaXMuc3RhcnREYXRlKS5pc1ZhbGlkKCkpIHtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gbW9tZW50KHRoaXMuc3RhcnREYXRlKTtcbiAgICAgIHRoaXMubmF2RGF0ZSA9IHRoaXMuc3RhcnREYXRlO1xuICAgICAgdGhpcy52YWx1ZUlucHV0SG91ci5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnaGgnKTtcbiAgICAgIHRoaXMudmFsdWVJbnB1dE1pbnV0ZS5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnbW0nKTtcbiAgICAgIGNvbnN0IHN0YXJ0RGF5ID0ge1xuICAgICAgICBtb250aDogTnVtYmVyKHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnTScpKSxcbiAgICAgICAgeWVhcjogdGhpcy5zdGFydERhdGUueWVhcigpLFxuICAgICAgICBkYXk6IE51bWJlcih0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ0REJykpXG4gICAgICB9O1xuICAgICAgdGhpcy5kYXRhTW9udGhzW3N0YXJ0RGF5LnllYXJdW3N0YXJ0RGF5Lm1vbnRoXS5mb3JFYWNoKGQgPT4gZC5pc0FjdGl2ZSA9IChkLnZhbHVlID09PSBzdGFydERheS5kYXkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgZW5kRGF0ZSBhbmQgcGFyc2VcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLmVuZERhdGUgJiYgbW9tZW50KHRoaXMuZW5kRGF0ZSkuaXNWYWxpZCgpKSB7XG4gICAgICB0aGlzLmVuZERhdGUgPSBtb21lbnQodGhpcy5lbmREYXRlKTtcbiAgICAgIHRoaXMubmF2RGF0ZSA9IHRoaXMuZW5kRGF0ZTtcbiAgICAgIHRoaXMudmFsdWVJbnB1dE1pbnV0ZS5lbmQgPSB0aGlzLmVuZERhdGUuZm9ybWF0KCdtbScpO1xuICAgICAgdGhpcy52YWx1ZUlucHV0SG91ci5lbmQgPSB0aGlzLmVuZERhdGUuZm9ybWF0KCdoaCcpO1xuICAgICAgdGhpcy5pbmNsdWRlRW5kRGF0ZSA9IHRydWU7XG4gICAgICBjb25zdCBlbmREYXkgPSB7XG4gICAgICAgIG1vbnRoOiBOdW1iZXIodGhpcy5lbmREYXRlLmZvcm1hdCgnTScpKSxcbiAgICAgICAgeWVhcjogdGhpcy5lbmREYXRlLnllYXIoKSxcbiAgICAgICAgZGF5OiBOdW1iZXIodGhpcy5lbmREYXRlLmZvcm1hdCgnREQnKSlcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuYXBwbHlSYW5nZSgpO1xuICAgICAgY29uc3Qgc3RhcnREYXkgPSB7XG4gICAgICAgIG1vbnRoOiBOdW1iZXIodGhpcy5zdGFydERhdGUuZm9ybWF0KCdNJykpLFxuICAgICAgICB5ZWFyOiB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCksXG4gICAgICAgIGRheTogTnVtYmVyKHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnREQnKSlcbiAgICAgIH07XG4gICAgICB0aGlzLmRhdGFNb250aHNbc3RhcnREYXkueWVhcl1bc3RhcnREYXkubW9udGhdLmZvckVhY2goZCA9PiBkLmlzQWN0aXZlID0gKGQudmFsdWUgPT09IHN0YXJ0RGF5LmRheSkpO1xuICAgICAgdGhpcy5kYXRhTW9udGhzW2VuZERheS55ZWFyXVtlbmREYXkubW9udGhdLmZvckVhY2goZCA9PiB7XG4gICAgICAgIGlmICghZC5pc0FjdGl2ZSkge1xuICAgICAgICAgIGQuaXNBY3RpdmUgPSAoZC52YWx1ZSA9PT0gZW5kRGF5LmRheSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVuZERhdGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudE1vbnRoID0gdGhpcy5uYXZEYXRlLm1vbnRoKCk7XG4gICAgdGhpcy5jdXJyZW50WWVhciA9IHRoaXMubmF2RGF0ZS55ZWFyKCk7XG4gICAgaWYgKCF0aGlzLm1heERhdGUpIHtcbiAgICAgIHRoaXMubWF4RGF0ZSA9IHRoaXMubmF2RGF0ZS5jbG9uZSgpLmVuZE9mKCd5ZWFyJykuYWRkKDEsICd5ZWFyJyk7XG4gICAgfVxuICAgIGlmICghdGhpcy5taW5EYXRlKSB7XG4gICAgICB0aGlzLm1pbkRhdGUgPSB0aGlzLm5hdkRhdGUuY2xvbmUoKS5zdGFydE9mKCd5ZWFyJykuc3VidHJhY3QoMSwgJ3llYXInKTtcbiAgICB9XG4gICAgLy8gdGhpcy5hcHBseVJhbmdlKClcbiAgICBpZiAodGhpcy5zaG93SW5pdGlhbFZhbHVlKSB7XG4gICAgICB0aGlzLmNvbmNhdFZhbHVlSW5wdXQoKTtcbiAgICB9XG5cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBjb250cm9sVmFsdWVBY2Nlc3NvclxuICAgKi9cbiAgb25JbnB1dCh2YWx1ZSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLm9uVG91Y2goKTtcbiAgICB0aGlzLm9uQ2hhbmdlKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWUgfHwgJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmFsdWUgPSAnJztcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoID0gZm47XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmlzRGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBudW1cbiAgICogQHBhcmFtIG1vZGVcbiAgICovXG4gIGFkZE9yU3ViSG91ciA9IChudW06IG51bWJlciwgbW9kZTogc3RyaW5nKSA9PiB7XG4gICAgaWYgKG51bSA+IDApIHtcbiAgICAgIHRoaXMuY2hlY2tIb3VyVmFsaWRhdGUoKE51bWJlcih0aGlzLnZhbHVlSW5wdXRIb3VyW21vZGVdKSArIDEpLCBtb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jaGVja0hvdXJWYWxpZGF0ZSgoTnVtYmVyKHRoaXMudmFsdWVJbnB1dEhvdXJbbW9kZV0pIC0gMSksIG1vZGUpO1xuICAgIH1cbiAgfTtcblxuICBhZGRPclN1Yk1pbnV0ZSA9IChudW06IG51bWJlciwgbW9kZTogc3RyaW5nKSA9PiB7XG4gICAgaWYgKG51bSA+IDApIHtcbiAgICAgIHRoaXMuY2hlY2tNaW51dGVWYWxpZGF0ZSgoTnVtYmVyKHRoaXMudmFsdWVJbnB1dE1pbnV0ZVttb2RlXSkgKyAxKSwgbW9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2hlY2tNaW51dGVWYWxpZGF0ZSgoTnVtYmVyKHRoaXMudmFsdWVJbnB1dE1pbnV0ZVttb2RlXSkgLSAxKSwgbW9kZSk7XG4gICAgfVxuICB9O1xuXG4gIGNoZWNrSG91clZhbGlkYXRlID0gKCRldmVudCwgbW9kZSkgPT4ge1xuICAgIGNvbnN0IHRvSG91ciA9IChtb2RlID09PSAnc3RhcnQnKSA/ICdzdGFydCcgOiAnZW5kJztcbiAgICBpZiAodGhpcy5tZXJpZGlhblRpbWUpIHtcbiAgICAgIHRoaXMudmFsdWVJbnB1dEhvdXJbdG9Ib3VyXSA9ICRldmVudDtcbiAgICAgIGlmICgkZXZlbnQgPD0gMTIgJiYgJGV2ZW50ID4gMCkge1xuICAgICAgICBpZiAobW9kZSA9PT0gJ3N0YXJ0JyAmJiB0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ0EnKSA9PT0gJ1BNJykge1xuICAgICAgICAgIGlmICgkZXZlbnQgPT09IDEyKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5zZXQoeyBob3VyOiAoJGV2ZW50KSwgbWludXRlOiB0aGlzLnZhbHVlSW5wdXRNaW51dGVbdG9Ib3VyXSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUuc2V0KHsgaG91cjogKCRldmVudCArIDEyKSwgbWludXRlOiB0aGlzLnZhbHVlSW5wdXRNaW51dGVbdG9Ib3VyXSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vZGUgPT09ICdzdGFydCcgJiYgdGhpcy5zdGFydERhdGUgJiYgdGhpcy5zdGFydERhdGUuZm9ybWF0KCdBJykgPT09ICdBTScpIHtcbiAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5zZXQoeyBob3VyOiAoJGV2ZW50KSwgbWludXRlOiB0aGlzLnZhbHVlSW5wdXRNaW51dGVbdG9Ib3VyXSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb2RlID09PSAnZW5kJyAmJiB0aGlzLmVuZERhdGUgJiYgdGhpcy5lbmREYXRlLmZvcm1hdCgnQScpID09PSAnUE0nKSB7XG4gICAgICAgICAgaWYgKCRldmVudCA9PT0gMTIpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZS5zZXQoeyBob3VyOiAoJGV2ZW50KSwgbWludXRlOiB0aGlzLnZhbHVlSW5wdXRNaW51dGVbdG9Ib3VyXSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbmREYXRlLnNldCh7IGhvdXI6ICgkZXZlbnQgKyAxMiksIG1pbnV0ZTogdGhpcy52YWx1ZUlucHV0TWludXRlW3RvSG91cl0sIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtb2RlID09PSAnZW5kJyAmJiB0aGlzLmVuZERhdGUgJiYgdGhpcy5lbmREYXRlLmZvcm1hdCgnQScpID09PSAnQU0nKSB7XG4gICAgICAgICAgdGhpcy5lbmREYXRlLnNldCh7IGhvdXI6ICgkZXZlbnQpLCBtaW51dGU6IHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb2RlID09PSAnc3RhcnQnICYmIHRoaXMuZW5kRGF0ZSAmJiB0aGlzLmVuZERhdGUuZm9ybWF0KCdBJykgPT09ICdQTScpIHtcbiAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5zZXQoeyBob3VyOiB0aGlzLnZhbHVlSW5wdXRIb3VyW3RvSG91cl0gKyAxMiwgbWludXRlOiB0aGlzLnZhbHVlSW5wdXRNaW51dGVbdG9Ib3VyXSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoJGV2ZW50ID49IDAgJiYgJGV2ZW50IDw9IDIzKSB7XG4gICAgICAgIHRoaXMudmFsdWVJbnB1dEhvdXJbdG9Ib3VyXSA9ICRldmVudDtcbiAgICAgICAgaWYgKG1vZGUgPT09ICdlbmQnKSB7XG4gICAgICAgICAgdGhpcy5lbmREYXRlLnNldCh7IGhvdXI6ICgkZXZlbnQpLCBtaW51dGU6IHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb2RlID09PSAnc3RhcnQnKSB7XG4gICAgICAgICAgdGhpcy5zdGFydERhdGUuc2V0KHsgaG91cjogdGhpcy52YWx1ZUlucHV0SG91clt0b0hvdXJdLCBtaW51dGU6IHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZUZvcm1hdElucHV0KCk7XG4gIH07XG5cbiAgY2hlY2tNaW51dGVWYWxpZGF0ZSA9ICgkZXZlbnQsIG1vZGU6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHRvSG91ciA9IChtb2RlID09PSAnc3RhcnQnKSA/ICdzdGFydCcgOiAnZW5kJztcbiAgICB0aGlzLnZhbHVlSW5wdXRNaW51dGVbdG9Ib3VyXSA9ICRldmVudDtcbiAgICBpZiAoJGV2ZW50IDwgMCkge1xuICAgICAgdGhpcy52YWx1ZUlucHV0TWludXRlW3RvSG91cl0gPSA1OTtcbiAgICB9IGVsc2UgaWYgKCRldmVudCA+IDU5KSB7XG4gICAgICB0aGlzLnZhbHVlSW5wdXRNaW51dGVbdG9Ib3VyXSA9IDA7XG4gICAgfVxuICAgIGlmIChtb2RlID09PSAnc3RhcnQnKSB7XG4gICAgICB0aGlzLnN0YXJ0RGF0ZS5zZXQoeyBtaW51dGU6IHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICAgIH1cbiAgICBpZiAobW9kZSA9PT0gJ2VuZCcpIHtcbiAgICAgIHRoaXMuZW5kRGF0ZS5zZXQoeyBtaW51dGU6IHRoaXMudmFsdWVJbnB1dE1pbnV0ZVt0b0hvdXJdLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICAgIH1cbiAgICB0aGlzLnJlRm9ybWF0SW5wdXQoKTtcbiAgfTtcblxuICBjaGFuZ2VNZXJpZGlhblRpbWUgPSAobmV3TWVyaWRpYW4sIG1vZGUpID0+IHtcbiAgICBjb25zdCBpc1N0YXJ0T3JFbmQgPSAobW9kZSA9PT0gJ3N0YXJ0JykgPyAnc3RhcnREYXRlJyA6ICdlbmREYXRlJztcbiAgICBpZiAobmV3TWVyaWRpYW4gPT09ICdBTScgJiYgdGhpc1tpc1N0YXJ0T3JFbmRdLmhvdXJzKCkgPiAxMikge1xuICAgICAgdGhpc1tpc1N0YXJ0T3JFbmRdLmhvdXJzKHRoaXNbaXNTdGFydE9yRW5kXS5ob3VycygpIC0gMTIpO1xuICAgIH0gZWxzZSBpZiAobmV3TWVyaWRpYW4gPT09ICdQTScgJiYgdGhpc1tpc1N0YXJ0T3JFbmRdLmhvdXJzKCkgPD0gMTIpIHtcbiAgICAgIHRoaXNbaXNTdGFydE9yRW5kXS5ob3Vycyh0aGlzW2lzU3RhcnRPckVuZF0uaG91cnMoKSArIDEyKTtcbiAgICB9IGVsc2UgaWYgKG5ld01lcmlkaWFuID09PSAnQU0nICYmIHRoaXMuc3RhcnREYXRlLmhvdXJzKCkgPD0gMTIpIHtcbiAgICAgIHRoaXNbaXNTdGFydE9yRW5kXS5ob3Vycyh0aGlzW2lzU3RhcnRPckVuZF0uaG91cnMoKSAtIDEpO1xuICAgIH1cbiAgICBpZiAobW9kZSA9PT0gJ3N0YXJ0Jykge1xuICAgICAgdGhpcy52YWx1ZUlucHV0SG91clttb2RlXSA9IHRoaXNbaXNTdGFydE9yRW5kXS5ob3Vycyh0aGlzW2lzU3RhcnRPckVuZF0uaG91cnMoKSkuZm9ybWF0KCdoaCcpO1xuICAgIH1cbiAgICBpZiAobW9kZSA9PT0gJ2VuZCcpIHtcbiAgICAgIHRoaXMudmFsdWVJbnB1dEhvdXJbbW9kZV0gPSB0aGlzW2lzU3RhcnRPckVuZF0uaG91cnModGhpc1tpc1N0YXJ0T3JFbmRdLmhvdXJzKCkpLmZvcm1hdCgnaGgnKTtcbiAgICB9XG4gICAgdGhpcy5yZUZvcm1hdElucHV0KCk7XG4gIH07XG5cbiAgc2V0T3B0aW9ucygpIHtcbiAgICBtb21lbnQubG9jYWxlKHRoaXMubG9jYWxlKTtcbiAgICB0aGlzLmdlbmVyYXRlQWxsR3JpZCgpO1xuICAgIHRoaXMuZm9ybWF0SW5wdXRUaW1lID0gKHRoaXMubWVyaWRpYW5UaW1lKSA/IGBEIE1NTSwgWVlZWSBoaDptbSBBYCA6IGBEIE1NTSwgWVlZWSBISDptbWA7XG4gICAgLy8gdGhpcy5pbmNsdWRlRW5kRGF0ZSA9IGZhbHNlO1xuICAgIC8vIHRoaXMuaW5jbHVkZVRpbWUgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25jYXQgdmFsdWVzIGRhdGUgdG8gc3RyaW5nIGZvcm1hdCBmb3Igc2hvdyBpbiBpbnB1dFxuICAgKi9cbiAgY29uY2F0VmFsdWVJbnB1dCA9ICgpID0+IHtcbiAgICBjb25zdCBjb25jYXRWYWx1ZSA9IFtcbiAgICAgIHRoaXMuc3RhcnREYXRlLmZvcm1hdCh0aGlzLmZvcm1hdElucHV0RGF0ZSksXG4gICAgICAodGhpcy5lbmREYXRlKSA/ICcgIC0gICcgOiAnJyxcbiAgICAgICh0aGlzLmVuZERhdGUpID8gdGhpcy5lbmREYXRlLmZvcm1hdCh0aGlzLmZvcm1hdElucHV0RGF0ZSkgOiAnJ1xuICAgIF07XG4gICAgdGhpcy52YWx1ZSA9IGNvbmNhdFZhbHVlLmpvaW4oJycpO1xuICAgIHRoaXMuaXNJbnZhbGlkID0gISh0aGlzLnZhbHVlLmxlbmd0aCk7XG4gICAgdGhpcy5zZWxlY3RlZCA9IHtcbiAgICAgIHN0YXJ0RGF0ZTogKHRoaXMuc3RhcnREYXRlKSA/IHRoaXMuc3RhcnREYXRlLnRvRGF0ZSgpIDogbnVsbCxcbiAgICAgIGVuZERhdGU6ICh0aGlzLmVuZERhdGUpID8gdGhpcy5lbmREYXRlLnRvRGF0ZSgpIDogbnVsbFxuICAgIH07XG5cbiAgfTtcblxuICBzZXRBY2Nlc3MoKSB7XG4gICAgdGhpcy5jYW5BY2Nlc3NQcmV2aW91cyA9IHRoaXMuY2FuQ2hhbmdlTmF2TW9udGgoLTEpO1xuICAgIHRoaXMuY2FuQWNjZXNzTmV4dCA9IHRoaXMuY2FuQ2hhbmdlTmF2TW9udGgoMSk7XG4gIH1cblxuICBjaGFuZ2VOYXZNb250aChudW06IG51bWJlciwgbW9kZSA9ICduZXh0Jykge1xuICAgIGlmICh0aGlzLmNhbkNoYW5nZU5hdk1vbnRoKG51bSkpIHtcbiAgICAgIHRoaXMubmF2RGF0ZS5hZGQobnVtLCAnbW9udGgnKTtcbiAgICAgIHRoaXMuY3VycmVudE1vbnRoID0gdGhpcy5uYXZEYXRlLm1vbnRoKCkgKyAxO1xuICAgICAgdGhpcy5jdXJyZW50WWVhciA9IHRoaXMubmF2RGF0ZS55ZWFyKCk7XG4gICAgICB0aGlzLm1ha2VHcmlkQ3VzdG9tKHRoaXMuY3VycmVudFllYXIsIHRoaXMuY3VycmVudE1vbnRoKTtcbiAgICB9XG4gIH1cblxuICBnZW5lcmF0ZUFsbEdyaWQgPSAoKSA9PiB7XG4gICAgY29uc3QgZGF0ZU9iamVjdEN1cnJlbnQgPSBtb21lbnQoKS5zdGFydE9mKCd5ZWFyJykuY2xvbmUoKTtcbiAgICBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMl0uZm9yRWFjaChhID0+IHtcbiAgICAgIHRoaXMubWFrZUdyaWRDdXN0b20oZGF0ZU9iamVjdEN1cnJlbnQueWVhcigpLCBhKTtcbiAgICB9KTtcblxuICB9O1xuXG4gIGNhbkNoYW5nZU5hdk1vbnRoKG51bTogbnVtYmVyKSB7XG4gICAgY29uc3QgY2xvbmVkRGF0ZSA9IG1vbWVudCh0aGlzLm5hdkRhdGUpO1xuICAgIHJldHVybiB0aGlzLmNhbkNoYW5nZU5hdk1vbnRoTG9naWMobnVtLCBjbG9uZWREYXRlKTtcbiAgfVxuXG4gIG1ha2VIZWFkZXIoKSB7XG4gICAgY29uc3Qgd2Vla0RheXNBcnI6IEFycmF5PG51bWJlcj4gPSBbMCwgMSwgMiwgMywgNCwgNSwgNl07XG4gICAgd2Vla0RheXNBcnIuZm9yRWFjaChkYXkgPT4gdGhpcy53ZWVrRGF5c0hlYWRlckFyci5wdXNoKG1vbWVudCgpLndlZWtkYXkoZGF5KS5mb3JtYXQoJ2RkZCcpKSk7XG4gIH1cblxuICBnZXREaW1lbnNpb25zKGRhdGU6IGFueSkge1xuICAgIGNvbnN0IGZpcnN0RGF5RGF0ZSA9IG1vbWVudChkYXRlKS5zdGFydE9mKCdtb250aCcpO1xuICAgIHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgPSBmaXJzdERheURhdGUud2Vla2RheSgpO1xuICAgIGNvbnN0IGxhc3REYXlEYXRlID0gbW9tZW50KGRhdGUpLmVuZE9mKCdtb250aCcpO1xuICAgIHRoaXMubGFzdEVtcHR5Q2VsbHMgPSA2IC0gbGFzdERheURhdGUud2Vla2RheSgpO1xuICAgIHRoaXMuYXJyYXlMZW5ndGggPSB0aGlzLmluaXRpYWxFbXB0eUNlbGxzICsgdGhpcy5sYXN0RW1wdHlDZWxscyArIGRhdGUuZGF5c0luTW9udGgoKTtcbiAgfVxuXG4gIG1ha2VHcmlkQ3VzdG9tID0gKHllYXIgPSBudWxsLCBtb250aCA9IG51bGwpID0+IHtcbiAgICAvKipcbiAgICAgKiBGaXhcbiAgICAgKi9cblxuICAgIGNvbnN0IGRhdGVPZlR1cm4gPSBtb21lbnQoYCR7eWVhcn0tJHttb250aH0tMDFgLCAnWVlZWS1NLUREJyk7XG5cbiAgICAvKipcbiAgICAgKiBJcyBPS1xuICAgICAqL1xuICAgIGlmICghdGhpcy5kYXRhTW9udGhzLmhhc093blByb3BlcnR5KHllYXIpKSB7XG4gICAgICB0aGlzLmRhdGFNb250aHNbeWVhcl0gPSB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJcyBPS1xuICAgICAqL1xuICAgIGlmICghdGhpcy5kYXRhTW9udGhzW3llYXJdLmhhc093blByb3BlcnR5KG1vbnRoKSkge1xuICAgICAgdGhpcy5kYXRhTW9udGhzW3llYXJdW21vbnRoXSA9IFtdO1xuXG4gICAgICAvKipcbiAgICAgICAqIEZpeFxuICAgICAgICovXG5cbiAgICAgIGNvbnN0IGZpcnN0RGF5RGF0ZSA9IG1vbWVudChkYXRlT2ZUdXJuKS5zdGFydE9mKCdtb250aCcpO1xuICAgICAgY29uc3QgbGFzdERheURhdGUgPSBtb21lbnQoZGF0ZU9mVHVybikuZW5kT2YoJ21vbnRoJyk7XG4gICAgICB0aGlzLmRhdGFNb250aHNbeWVhcl1bYGluaXRpYWxFbXB0eUNlbGxzJHttb250aH1gXSA9IGZpcnN0RGF5RGF0ZS53ZWVrZGF5KCk7XG4gICAgICB0aGlzLmRhdGFNb250aHNbeWVhcl1bYGxhc3RFbXB0eUNlbGxzJHttb250aH1gXSA9IDYgLSBsYXN0RGF5RGF0ZS53ZWVrZGF5KCk7XG5cbiAgICAgIGNvbnN0IGluaXRFbXB0eUNlbGwgPSB0aGlzLmRhdGFNb250aHNbeWVhcl1bYGluaXRpYWxFbXB0eUNlbGxzJHttb250aH1gXTtcbiAgICAgIGNvbnN0IGxhc3RFbXB0eUNlbGwgPSB0aGlzLmRhdGFNb250aHNbeWVhcl1bYGxhc3RFbXB0eUNlbGxzJHttb250aH1gXTtcblxuICAgICAgdGhpcy5kYXRhTW9udGhzW3llYXJdW2BhcnJheUxlbmd0aCR7bW9udGh9YF0gPSBpbml0RW1wdHlDZWxsICsgbGFzdEVtcHR5Q2VsbCArIGRhdGVPZlR1cm4uZGF5c0luTW9udGgoKTtcblxuICAgICAgY29uc3QgYXJyYXlMZW5ndGhzID0gdGhpcy5kYXRhTW9udGhzW3llYXJdW2BhcnJheUxlbmd0aCR7bW9udGh9YF07XG5cbiAgICAgIHRoaXMuZ2V0RGltZW5zaW9ucyhkYXRlT2ZUdXJuKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXlMZW5ndGhzOyBpKyspIHtcbiAgICAgICAgY29uc3Qgb2JqOiBhbnkgPSB7fTtcbiAgICAgICAgaWYgKGkgPCBpbml0RW1wdHlDZWxsIHx8IGkgPiBpbml0RW1wdHlDZWxsICsgZGF0ZU9mVHVybi5kYXlzSW5Nb250aCgpIC0gMSkge1xuICAgICAgICAgIG9iai52YWx1ZSA9IDA7XG4gICAgICAgICAgb2JqLmF2YWlsYWJsZSA9IGZhbHNlO1xuICAgICAgICAgIG9iai5pc1RvZGF5ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2JqLnZhbHVlID0gaSAtIGluaXRFbXB0eUNlbGwgKyAxO1xuICAgICAgICAgIG9iai5hdmFpbGFibGUgPSB0aGlzLmlzQXZhaWxhYmxlKGkgLSBpbml0RW1wdHlDZWxsICsgMSk7XG4gICAgICAgICAgb2JqLmlzVG9kYXkgPSB0aGlzLmlzVG9kYXkoaSAtIGluaXRFbXB0eUNlbGwgKyAxLCBtb250aCwgeWVhcik7XG4gICAgICAgICAgb2JqLm1vbnRoID0gbW9udGg7XG4gICAgICAgICAgb2JqLmRhdGUgPSBkYXRlT2ZUdXJuO1xuICAgICAgICAgIG9iai55ZWFyID0geWVhcjtcbiAgICAgICAgICBvYmouaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICBpZiAodGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihvYmoudmFsdWUsIG1vbnRoLCB5ZWFyKS5pc1NhbWUodGhpcy5zdGFydERhdGUpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gb2JqO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihvYmoudmFsdWUsIG1vbnRoLCB5ZWFyKS5pc1NhbWUodGhpcy5lbmREYXRlKSkge1xuICAgICAgICAgICAgdGhpcy5lbmREYXkgPSBvYmo7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvYmouaXNUb2RheSAmJiAhdGhpcy5zdGFydERheSAmJiAhdGhpcy5lbmREYXkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnREYXkgPSBvYmo7XG4gICAgICAgICAgICB0aGlzLmVuZERheSA9IG9iajtcbiAgICAgICAgICAgIG9iai5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG9iai5pblJhbmdlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVttb250aF0ucHVzaChvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBpc0F2YWlsYWJsZShudW06IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGRhdGVUb0NoZWNrID0gdGhpcy5kYXRlRnJvbU51bShudW0sIHRoaXMubmF2RGF0ZSk7XG4gICAgcmV0dXJuIHRoaXMuaXNBdmFpbGFibGVMb2dpYyhkYXRlVG9DaGVjayk7XG4gIH1cblxuICBpc1RvZGF5KG51bTogbnVtYmVyLCBtb250aDogbnVtYmVyLCB5ZWFyOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCBkYXRlVG9DaGVjayA9IG1vbWVudCh0aGlzLmRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKG51bSwgbW9udGgsIHllYXIpKTtcbiAgICByZXR1cm4gZGF0ZVRvQ2hlY2suaXNTYW1lKG1vbWVudCgpLnNldCh7IGhvdXI6IDAsIG1pbnV0ZTogMCwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KSk7XG4gIH1cblxuICBkYXRlRnJvbU51bShudW06IG51bWJlciwgcmVmZXJlbmNlRGF0ZTogYW55KTogYW55IHtcbiAgICBjb25zdCByZXR1cm5EYXRlID0gbW9tZW50KHJlZmVyZW5jZURhdGUpO1xuICAgIHJldHVybiByZXR1cm5EYXRlLmRhdGUobnVtKTtcbiAgfVxuXG4gIHJlRm9ybWF0SW5wdXQgPSAoKSA9PiB7XG4gICAgdGhpcy5mb3JtYXRJbnB1dERhdGUgPSAodGhpcy5pbmNsdWRlVGltZSkgPyB0aGlzLmZvcm1hdElucHV0VGltZSA6IHRoaXMuZm9ybWF0SW5wdXREYXRlO1xuICAgIHRoaXMuY29uY2F0VmFsdWVJbnB1dCgpO1xuICB9O1xuXG4gIHNlbGVjdERheShkYXk6IGFueSkge1xuICAgIGlmIChkYXkuYXZhaWxhYmxlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRGF0ZSA9IHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIoZGF5LnZhbHVlLCBkYXkubW9udGgsIGRheS55ZWFyKTtcbiAgICAgIGlmICh0aGlzLmluY2x1ZGVFbmREYXRlKSB7XG4gICAgICAgIGNvbnN0IGN1cnJEYXRlID0gdGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihkYXkudmFsdWUsIGRheS5tb250aCwgZGF5LnllYXIpO1xuICAgICAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICBpZiAoY3VyckRhdGUuaXNTYW1lKG1vbWVudCh0aGlzLnN0YXJ0RGF0ZSkuc3RhcnRPZignZGF5JykpKSB7XG4gICAgICAgICAgICAgIHRoaXMubW9kZSA9ICdzdGFydCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJEYXRlLmlzU2FtZU9yQmVmb3JlKHRoaXMuc3RhcnREYXRlKSkge1xuICAgICAgICAgICAgICB0aGlzLmVuZERheSA9IHRoaXMuc3RhcnREYXk7XG4gICAgICAgICAgICAgIHRoaXMuc3RhcnREYXkgPSBkYXk7XG4gICAgICAgICAgICAgIHRoaXMubW9kZSA9ICdzdGFydCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmVuZERheSA9IGRheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgICAgICAgIGlmIChjdXJyRGF0ZS5pc1NhbWUobW9tZW50KHRoaXMuZW5kRGF0ZSkuc3RhcnRPZignZGF5JykpKSB7XG4gICAgICAgICAgICAgIHRoaXMubW9kZSA9ICdlbmQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyRGF0ZS5pc1NhbWVPckFmdGVyKHRoaXMuZW5kRGF0ZSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGFydERheSA9IHRoaXMuZW5kRGF5O1xuICAgICAgICAgICAgICB0aGlzLmVuZERheSA9IGRheTtcbiAgICAgICAgICAgICAgdGhpcy5tb2RlID0gJ2VuZCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gZGF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuZ2VuZXJhdGVEYXRlKHRoaXMuc3RhcnREYXksIHRoaXMuc3RhcnREYXRlKTtcbiAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5nZW5lcmF0ZURhdGUodGhpcy5lbmREYXksIHRoaXMuZW5kRGF0ZSk7XG4gICAgICAgIHRoaXMuYXBwbHlSYW5nZSgpO1xuICAgICAgICB0aGlzLnN0YXJ0RGF5LmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbmREYXkuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0ge1xuICAgICAgICAgIHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUudG9EYXRlKCksXG4gICAgICAgICAgZW5kRGF0ZTogdGhpcy5lbmREYXRlLnRvRGF0ZSgpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc2V0QWN0aXZpdHkoKTtcblxuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuc2VsZWN0ZWREYXRlO1xuICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gZGF5O1xuICAgICAgICB0aGlzLnN0YXJ0RGF5LmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHtcbiAgICAgICAgICBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlLnRvRGF0ZSgpLFxuICAgICAgICAgIGVuZERhdGU6IG51bGxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lbWl0U2VsZWN0ZWQuZW1pdCh0aGlzLnNlbGVjdGVkKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLmVuZERhdGUpIHtcbiAgICAgICAgdGhpcy5lbWl0U2VsZWN0ZWQuZW1pdCh0aGlzLnNlbGVjdGVkKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICAgIH1cbiAgfVxuXG4gIGdlbmVyYXRlRGF0ZShkYXk6IGFueSwgZGF0ZTogYW55KSB7XG4gICAgbGV0IGdlbmVyYXRlZERhdGUgPSB0aGlzLmRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKGRheS52YWx1ZSwgZGF5Lm1vbnRoLCBkYXkueWVhcik7XG4gICAgaWYgKGRhdGUpIHtcbiAgICAgIGdlbmVyYXRlZERhdGUgPSBnZW5lcmF0ZWREYXRlLnNldCh7IGhvdXI6IGRhdGUuaG91cigpLCBtaW51dGU6IGRhdGUubWludXRlKCkgfSk7XG4gICAgfVxuICAgIHJldHVybiBnZW5lcmF0ZWREYXRlO1xuICB9XG5cbiAgcmVzZXRSYW5nZSgpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmRhdGFNb250aHMpLmZvckVhY2goeWVhciA9PiB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmRhdGFNb250aHNbeWVhcl0pLmZvckVhY2gobW9udGggPT4ge1xuICAgICAgICBpZiAoIWlzTmFOKE51bWJlcihtb250aCkpKSB7XG4gICAgICAgICAgdGhpcy5kYXRhTW9udGhzW3llYXJdW21vbnRoXS5tYXAoZGF5ID0+IHtcbiAgICAgICAgICAgIGRheS5pblJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICBkYXkuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlc2V0QWN0aXZpdHkoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5kYXRhTW9udGhzKS5mb3JFYWNoKHllYXIgPT4ge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5kYXRhTW9udGhzW3llYXJdKS5mb3JFYWNoKG1vbnRoID0+IHtcbiAgICAgICAgaWYgKCFpc05hTihOdW1iZXIobW9udGgpKSkge1xuICAgICAgICAgIHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVttb250aF0ubWFwKGRheSA9PiB7XG4gICAgICAgICAgICBkYXkuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBkYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihkYXksIG1vbnRoLCB5ZWFyKSB7XG4gICAgbGV0IHRpbWVPYmplY3QgPSB7IGhvdXI6IDAsIG1pbnV0ZTogMCwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9O1xuICAgIGlmICh0aGlzLmluY2x1ZGVUaW1lKSB7XG4gICAgICB0aW1lT2JqZWN0ID0geyBob3VyOiB0aGlzLnN0YXJ0RGF0ZS5ob3VyKCksIG1pbnV0ZTogdGhpcy5zdGFydERhdGUubWludXRlKCksIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfTtcbiAgICAgIHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnaDptbSBBJyk7XG4gICAgfVxuICAgIHJldHVybiBtb21lbnQoYCR7eWVhcn0tJHttb250aH0tJHtkYXl9YCwgJ1lZWVktTS1ERCcpLnNldCh0aW1lT2JqZWN0KTtcbiAgfVxuXG4gIGFwcGx5UmFuZ2UoKSB7XG4gICAgdGhpcy5nZXREaW1lbnNpb25zKHRoaXMuc3RhcnREYXRlKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgKyB0aGlzLnN0YXJ0RGF5LnZhbHVlIC0gMTtcbiAgICBjb25zdCBzdGFydE1vbnRoTGVuZ3RoID0gdGhpcy5hcnJheUxlbmd0aDtcbiAgICB0aGlzLmdldERpbWVuc2lvbnModGhpcy5lbmREYXRlKTtcbiAgICBjb25zdCBlbmRNb250aExlbmd0aCA9IHRoaXMuYXJyYXlMZW5ndGg7XG4gICAgY29uc3QgZW5kID0gdGhpcy5pbml0aWFsRW1wdHlDZWxscyArIHRoaXMuZW5kRGF5LnZhbHVlIC0gMTtcbiAgICB0aGlzLnJlc2V0UmFuZ2UoKTtcbiAgICBpZiAodGhpcy5zdGFydERheS5tb250aCAhPT0gdGhpcy5lbmREYXkubW9udGggfHwgdGhpcy5zdGFydERheS55ZWFyICE9PSB0aGlzLmVuZERheS55ZWFyKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmRhdGFNb250aHMpLmZvckVhY2goeWVhciA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGVuZGFyID0gdGhpcy5kYXRhTW9udGhzW3llYXJdO1xuICAgICAgICBPYmplY3Qua2V5cyhjYWxlbmRhcikuZm9yRWFjaChtb250aCA9PiB7XG4gICAgICAgICAgaWYgKCFpc05hTihOdW1iZXIobW9udGgpKSkge1xuICAgICAgICAgICAgY29uc3QgZGF5cyA9IHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVttb250aF07XG4gICAgICAgICAgICBpZiAoTnVtYmVyKG1vbnRoKSA9PT0gTnVtYmVyKHRoaXMuc3RhcnREYXkubW9udGgpICYmIE51bWJlcih5ZWFyKSA9PT0gTnVtYmVyKHRoaXMuc3RhcnREYXkueWVhcikpIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF5c1tpXS5pblJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgc3RhcnRNb250aExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF5c1tpXS5pblJhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChOdW1iZXIobW9udGgpID09PSBOdW1iZXIodGhpcy5lbmREYXkubW9udGgpICYmIE51bWJlcih5ZWFyKSA9PT0gTnVtYmVyKHRoaXMuZW5kRGF5LnllYXIpKSB7XG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF5c1tpXS5pblJhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gZW5kICsgMTsgaSA8IGVuZE1vbnRoTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkYXlzW2ldLmluUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICgobW9udGggPiB0aGlzLnN0YXJ0RGF5Lm1vbnRoIHx8IHllYXIgPiB0aGlzLnN0YXJ0RGF5LnllYXIpXG4gICAgICAgICAgICAgICYmIChtb250aCA8IHRoaXMuZW5kRGF5Lm1vbnRoIHx8IHllYXIgPCB0aGlzLmVuZERheS55ZWFyKSkge1xuICAgICAgICAgICAgICBkYXlzLmZvckVhY2goZGF5ID0+IGRheS5pblJhbmdlID0gdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtb250aCA9IHRoaXMuc3RhcnREYXkubW9udGg7XG4gICAgICBjb25zdCB5ZWFyID0gdGhpcy5zdGFydERheS55ZWFyO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVttb250aF1baV0uaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZGF0YU1vbnRoc1t5ZWFyXVttb250aF1baV0uaW5SYW5nZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gZW5kICsgMTsgaSA8IHRoaXMuYXJyYXlMZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmRhdGFNb250aHNbeWVhcl1bbW9udGhdW2ldLmluUmFuZ2UgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc0F2YWlsYWJsZUxvZ2ljKGRhdGVUb0NoZWNrOiBhbnkpIHtcbiAgICBpZiAodGhpcy5taW5EYXRlIHx8IHRoaXMubWF4RGF0ZSkge1xuICAgICAgcmV0dXJuICEoZGF0ZVRvQ2hlY2suaXNCZWZvcmUodGhpcy5taW5EYXRlKSB8fCBkYXRlVG9DaGVjay5pc0FmdGVyKHRoaXMubWF4RGF0ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gIWRhdGVUb0NoZWNrLmlzQmVmb3JlKG1vbWVudCgpLCAnZGF5Jyk7XG4gICAgfVxuICB9XG5cbiAgY2FuQ2hhbmdlTmF2TW9udGhMb2dpYyhudW0sIGN1cnJlbnREYXRlKSB7XG4gICAgY3VycmVudERhdGUuYWRkKG51bSwgJ21vbnRoJyk7XG4gICAgY29uc3QgbWluRGF0ZSA9IHRoaXMubWluRGF0ZSA/IHRoaXMubWluRGF0ZSA6IG1vbWVudCgpLmFkZCgtMSwgJ21vbnRoJyk7XG4gICAgY29uc3QgbWF4RGF0ZSA9IHRoaXMubWF4RGF0ZSA/IHRoaXMubWF4RGF0ZSA6IG1vbWVudCgpLmFkZCgxLCAneWVhcicpO1xuICAgIHJldHVybiBjdXJyZW50RGF0ZS5pc0JldHdlZW4obWluRGF0ZSwgbWF4RGF0ZSk7XG4gIH1cblxuICB0b2dnbGVDYWxlbmRhcigpOiBhbnkge1xuICAgIHRoaXMuaXNPcGVuID0gIXRoaXMuaXNPcGVuO1xuICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICB9XG5cbiAgb3BlbkNhbGVuZGFyKCk6IGFueSB7XG4gICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuICAgIHRoaXMub25Ub3VjaCgpO1xuICB9XG5cbiAgY2xvc2VDYWxlbmRhcigpOiBhbnkge1xuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgdGhpcy5yZUZvcm1hdElucHV0KCk7XG4gICAgdGhpcy5lbWl0U2VsZWN0ZWQuZW1pdCh0aGlzLnNlbGVjdGVkKTtcblxuICB9XG5cbiAgY2hhbmdlTW9kZShtb2RlOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgIHRoaXMub25Ub3VjaCgpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5yZXNldFJhbmdlKCk7XG4gICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoKTtcbiAgICB0aGlzLmVuZERhdGUgPSBudWxsO1xuICAgIHRoaXMubmF2RGF0ZSA9IHRoaXMudG9kYXlEYXRlO1xuICAgIHRoaXMuY3VycmVudE1vbnRoID0gdGhpcy5uYXZEYXRlLm1vbnRoKCk7XG4gICAgdGhpcy5jdXJyZW50WWVhciA9IHRoaXMubmF2RGF0ZS55ZWFyKCk7XG4gICAgdGhpcy5pbmNsdWRlRW5kRGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuaW5jbHVkZVRpbWUgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG51bGw7XG4gICAgdGhpcy5lbmRUaW1lID0gbnVsbDtcbiAgICB0aGlzLm1vZGUgPSAnc3RhcnQnO1xuICAgIHRoaXMubWFrZUdyaWRDdXN0b20odGhpcy5jdXJyZW50WWVhciwgdGhpcy5jdXJyZW50TW9udGgpO1xuICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICB9XG5cbiAgc2V0VGltZShtb21lbnQsIGhvdXI6IG51bWJlciA9IDAsIG1pbnV0ZTogbnVtYmVyID0gMCkge1xuICAgIHJldHVybiBtb21lbnQuc2V0KHsgaG91ciwgbWludXRlLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICB9XG5cbiAgaGFuZGxlTW9kZUNoYW5nZSgpIHtcbiAgICB0aGlzLnJlc2V0UmFuZ2UoKTtcbiAgICB0aGlzLm1vZGUgPSAnZW5kJztcbiAgICBpZiAodGhpcy5zdGFydERheSkge1xuICAgICAgdGhpcy5zdGFydERheS5pc0FjdGl2ZSA9IHRydWU7XG4gICAgfVxuICAgIGlmICghdGhpcy5pbmNsdWRlRW5kRGF0ZSkge1xuICAgICAgdGhpcy5lbmREYXRlID0gbnVsbDtcbiAgICAgIHRoaXMubW9kZSA9ICdzdGFydCc7XG4gICAgICB0aGlzLnN0YXJ0RGF5LmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLmVuZERheS5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0bXBTdGFydERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuICAgICAgLy8gY29uc3QgbmV4dERheSA9IHRtcFN0YXJ0RGF0ZS5hZGQoMiwgJ2RheXMnKS5mb3JtYXQoYFlZWVktJHt0bXBTdGFydERhdGUuZm9ybWF0KCdNJykgLSAxfS1EYCk7XG4gICAgICAvLyB0aGlzLnNpbXVsYXRlQ2xpY2sobmV4dERheSwgJ2NhbGVuZGFyLWRheS1ub3QtcmFuZ2UnKTtcbiAgICB9XG5cbiAgfVxuXG4gIHNldFN0YXJ0VGltZSh0aW1lKSB7XG4gICAgdGhpcy5zdGFydFRpbWUgPSB0aW1lO1xuICB9XG5cbiAgc2V0RW5kVGltZSh0aW1lKSB7XG4gICAgdGhpcy5lbmRUaW1lID0gdGltZTtcbiAgfVxuXG4gIGhhbmRsZVRpbWVDaGFuZ2UodGltZTogYW55LCBtb21lbnQ6IGFueSwgbW9kZTogc3RyaW5nKSB7XG4gICAgdGhpcy5yZUZvcm1hdElucHV0KCk7XG4gICAgaWYgKCF0aW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRpbWUgPSB0aW1lLnJlcGxhY2UoL1teYS16QS1aMC05XS9nLCAnJyk7XG4gICAgbW9tZW50LnNldCh7IGhvdXI6IDAsIG1pbnV0ZTogMCwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgICBsZXQgbGFzdFR3byA9IHRpbWUuc3Vic3RyKHRpbWUubGVuZ3RoIC0gMikudG9VcHBlckNhc2UoKTtcbiAgICBsZXQgbGFzdCA9IHRpbWUuc3Vic3RyKHRpbWUubGVuZ3RoIC0gMSkudG9VcHBlckNhc2UoKTtcbiAgICBjb25zdCBoYXNMYXN0VHdvID0gWydBTScsICdQTSddLmluY2x1ZGVzKGxhc3RUd28pO1xuICAgIGNvbnN0IGhhc0xhc3QgPSBbJ0EnLCAnUCddLmluY2x1ZGVzKGxhc3QpO1xuICAgIGxldCBpc0FtID0gdHJ1ZTtcbiAgICBsZXQgaXNQbSA9IGZhbHNlO1xuICAgIGlmIChoYXNMYXN0IHx8IGhhc0xhc3RUd28pIHtcbiAgICAgIGlzQW0gPSBsYXN0ID09PSAnQScgfHwgbGFzdFR3byA9PT0gJ0FNJztcbiAgICAgIGlzUG0gPSBsYXN0ID09PSAnUCcgfHwgbGFzdFR3byA9PT0gJ1BNJztcbiAgICB9XG4gICAgdGltZSA9IHRpbWUucmVwbGFjZSgvW14wLTldL2csICcnKTtcbiAgICBsYXN0VHdvID0gdGltZS5zdWJzdHIodGltZS5sZW5ndGggLSAyKTtcbiAgICBsYXN0ID0gdGltZS5zdWJzdHIodGltZS5sZW5ndGggLSAxKTtcbiAgICB0aW1lID0gdGltZS5zdWJzdHIoMCwgNCk7XG4gICAgdGhpcy5pc0ludmFsaWQgPSBmYWxzZTtcbiAgICBzd2l0Y2ggKHRpbWUubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIG1vbWVudFxuICAgICAgICAgID0gaXNBbSA/IHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lKSkgOlxuICAgICAgICAgICAgdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWUpICsgMTIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaWYgKGxhc3QgPj0gNikge1xuICAgICAgICAgIHRoaXMuaXNJbnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGltZSA9PT0gMTIpIHtcbiAgICAgICAgICBtb21lbnRcbiAgICAgICAgICAgID0gaXNBbSA/IHRoaXMuc2V0VGltZShtb21lbnQsIDApIDpcbiAgICAgICAgICAgICAgdGhpcy5zZXRUaW1lKG1vbWVudCwgMTIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRpbWUgPCAxMikge1xuICAgICAgICAgIG1vbWVudFxuICAgICAgICAgICAgPSBpc0FtID8gdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWUpKSA6XG4gICAgICAgICAgICAgIHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lKSArIDEyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb21lbnRcbiAgICAgICAgICAgID0gaXNBbSA/IHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lWzBdKSwgTnVtYmVyKGxhc3QpKSA6XG4gICAgICAgICAgICAgIHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lWzBdKSArIDEyLCBOdW1iZXIobGFzdCkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBpZiAobGFzdFR3byA+PSA2MCkge1xuICAgICAgICAgIHRoaXMuaXNJbnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb21lbnRcbiAgICAgICAgICAgID0gaXNBbSA/IHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lWzBdKSwgTnVtYmVyKGxhc3RUd28pKSA6XG4gICAgICAgICAgICAgIHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lWzBdKSArIDEyLCBOdW1iZXIobGFzdFR3bykpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0OlxuICAgICAgICBpZiAobGFzdFR3byA+PSA2MCkge1xuICAgICAgICAgIHRoaXMuaXNJbnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBtb21lbnQgPSB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZS5zdWJzdHIoMCwgMikpLCBOdW1iZXIobGFzdFR3bykpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuaXNJbnZhbGlkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMuZW1pdFNlbGVjdGVkLmVtaXQodGhpcy5zZWxlY3RlZCk7XG4gICAgaWYgKG1vZGUgPT09ICdzdGFydCcpIHtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gbW9tZW50O1xuICAgICAgdGhpcy5zdGFydFRpbWVQaWNrZXIubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW5kRGF0ZSA9IG1vbWVudDtcbiAgICAgIHRoaXMuZW5kVGltZVBpY2tlci5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB9XG4gIH1cblxufVxuIl19