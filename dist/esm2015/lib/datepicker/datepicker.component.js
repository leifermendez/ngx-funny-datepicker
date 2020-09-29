import { Component, Input, Output, EventEmitter, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment_ from 'moment';
const moment = moment_;
export class DatepickerComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvTGVpZmVyL1dlYnN0b3JtUHJvamVjdHMvZXhhbXBsZS1saWIvcHJvamVjdHMvbmd4LWZ1bm55LWRhdGVwaWNrZXIvc3JjLyIsInNvdXJjZXMiOlsibGliL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQWMsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xILE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUNsQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFjdkIsTUFBTSxPQUFPLG1CQUFtQjtJQW1EOUI7UUFsRFMsVUFBSyxHQUFRLEVBQUUsQ0FBQztRQVloQixXQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2QsZUFBVSxHQUFHLE9BQU8sQ0FBQztRQUNyQixjQUFTLEdBQUcsTUFBTSxDQUFDO1FBQ25CLGVBQVUsR0FBRyxPQUFPLENBQUM7UUFDcEIsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBR2pELHNCQUFpQixHQUFrQixFQUFFLENBQUM7UUFDdEMsWUFBTyxHQUFRLEVBQUUsQ0FBQztRQUVsQixzQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDekIsa0JBQWEsR0FBRyxJQUFJLENBQUM7UUFDckIsY0FBUyxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRzVFLFNBQUksR0FBRyxLQUFLLENBQUM7UUFTYixjQUFTLEdB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LENBQUM7d0JBQ2xELEtBQUssRUFBRSxJQUFJO3FCQUNaO2lCQUNGOzthQUNGOzs7O29CQUVFLEtBQUs7OEJBRUwsU0FBUyxTQUFDLGlCQUFpQjs0QkFFM0IsU0FBUyxTQUFDLGVBQWU7c0JBQ3pCLEtBQUs7c0JBQ0wsS0FBSzt3QkFDTCxLQUFLO3NCQUNMLEtBQUs7c0JBQ0wsS0FBSztzQkFDTCxLQUFLO3lCQUNMLEtBQUs7cUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3dCQUNMLEtBQUs7eUJBQ0wsS0FBSzsyQkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgKiBhcyBtb21lbnRfIGZyb20gJ21vbWVudCc7XG5jb25zdCBtb21lbnQgPSBtb21lbnRfO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZnVubnktZGF0ZXBpY2tlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9kYXRlcGlja2VyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZGF0ZXBpY2tlci5jb21wb25lbnQuY3NzJ10sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF0ZXBpY2tlckNvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlcGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBJbnB1dCgpIHZhbHVlOiBhbnkgPSAnJztcbiAgLy8gQHRzLWlnbm9yZVxuICBAVmlld0NoaWxkKCdzdGFydFRpbWVQaWNrZXInKSBzdGFydFRpbWVQaWNrZXI6IEVsZW1lbnRSZWY7XG4gIC8vIEB0cy1pZ25vcmVcbiAgQFZpZXdDaGlsZCgnZW5kVGltZVBpY2tlcicpIGVuZFRpbWVQaWNrZXI6IEVsZW1lbnRSZWY7XG4gIEBJbnB1dCgpIGlzUmFuZ2U6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGhhc1RpbWU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHN0YXJ0RGF0ZTogYW55O1xuICBASW5wdXQoKSBlbmREYXRlOiBhbnk7XG4gIEBJbnB1dCgpIG1pbkRhdGU6IGFueTtcbiAgQElucHV0KCkgbWF4RGF0ZTogYW55O1xuICBASW5wdXQoKSBjbGFzc0lucHV0OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGxvY2FsZSA9ICdlbic7XG4gIEBJbnB1dCgpIHJhbmdlTGFiZWwgPSAnUmFuZ2UnO1xuICBASW5wdXQoKSB0aW1lTGFiZWwgPSAnVGltZSc7XG4gIEBJbnB1dCgpIGNsZWFyTGFiZWwgPSAnQ2xlYXInO1xuICBAT3V0cHV0KCkgZW1pdFNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIGlzT3BlbjogYm9vbGVhbjtcbiAgbmF2RGF0ZTogYW55O1xuICB3ZWVrRGF5c0hlYWRlckFycjogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBncmlkQXJyOiBhbnkgPSB7fTtcbiAgc2VsZWN0ZWREYXRlOiBhbnk7XG4gIGNhbkFjY2Vzc1ByZXZpb3VzID0gdHJ1ZTtcbiAgY2FuQWNjZXNzTmV4dCA9IHRydWU7XG4gIHRvZGF5RGF0ZSA9IG1vbWVudCgpLnNldCh7IGhvdXI6IDAsIG1pbnV0ZTogMCwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgc3RhcnREYXk6IGFueTtcbiAgZW5kRGF5OiBhbnk7XG4gIG1vZGUgPSAnZW5kJztcbiAgaW5pdGlhbEVtcHR5Q2VsbHM6IG51bWJlcjtcbiAgbGFzdEVtcHR5Q2VsbHM6IG51bWJlcjtcbiAgYXJyYXlMZW5ndGg6IG51bWJlcjtcbiAgY3VycmVudE1vbnRoOiBudW1iZXI7XG4gIGN1cnJlbnRZZWFyOiBudW1iZXI7XG4gIHNlbGVjdGVkOiBhbnk7XG4gIHN0YXJ0VGltZTogYW55O1xuICBlbmRUaW1lOiBhbnk7XG4gIGlzSW52YWxpZCA9IGZhbHNlO1xuICBpbmNsdWRlRW5kRGF0ZTogYm9vbGVhbjtcbiAgaW5jbHVkZVRpbWU6IGJvb2xlYW47XG4gIGZvcm1hdElucHV0RGF0ZSA9ICdEIE1NTSwgWVlZWSc7XG4gIC8qKlxuICAgKiBDb250cm9sQWNjZXNzb3JcbiAgICovXG4gIG9uVG91Y2hlZDogYm9vbGVhbjtcbiAgaXNEaXNhYmxlZDogYm9vbGVhbjtcbiAgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7IH07XG4gIG9uVG91Y2ggPSAoKSA9PiB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSB0cnVlXG4gIH07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnNldE9wdGlvbnMoKTtcbiAgICBtb21lbnQubG9jYWxlKHRoaXMubG9jYWxlKTtcbiAgICBpZiAoIXRoaXMuc3RhcnREYXRlKSB7XG4gICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudCgpO1xuICAgIH1cbiAgICB0aGlzLm5hdkRhdGUgPSBtb21lbnQoKTtcbiAgICB0aGlzLm1ha2VIZWFkZXIoKTtcbiAgICB0aGlzLmN1cnJlbnRNb250aCA9IHRoaXMubmF2RGF0ZS5tb250aCgpO1xuICAgIHRoaXMuY3VycmVudFllYXIgPSB0aGlzLm5hdkRhdGUueWVhcigpO1xuICAgIHRoaXMubWFrZUdyaWQodGhpcy5jdXJyZW50WWVhciwgdGhpcy5jdXJyZW50TW9udGgpO1xuICAgIHRoaXMuaXNJbnZhbGlkID0gISh0aGlzLnZhbHVlLmxlbmd0aClcbiAgICAvLyB0aGlzLmNvbmNhdFZhbHVlSW5wdXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBjb250cm9sVmFsdWVBY2Nlc3NvclxuICAgKi9cbiAgb25JbnB1dCh2YWx1ZSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLm9uVG91Y2goKTtcbiAgICB0aGlzLm9uQ2hhbmdlKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWUgfHwgJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmFsdWUgPSAnJztcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaCA9IGZuO1xuICB9XG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuaXNEaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuXG5cbiAgc2V0T3B0aW9ucygpIHtcbiAgICB0aGlzLmluY2x1ZGVFbmREYXRlID0gZmFsc2U7XG4gICAgdGhpcy5pbmNsdWRlVGltZSA9IGZhbHNlO1xuICB9XG5cbiAgY29uY2F0VmFsdWVJbnB1dCA9ICgpID0+IHtcbiAgICBjb25zdCBjb25jYXRWYWx1ZSA9IFtcbiAgICAgIHRoaXMuc3RhcnREYXRlLmZvcm1hdCh0aGlzLmZvcm1hdElucHV0RGF0ZSksXG4gICAgICAodGhpcy5lbmREYXRlKSA/ICcgIC0gICcgOiAnJyxcbiAgICAgICh0aGlzLmVuZERhdGUpID8gdGhpcy5lbmREYXRlLmZvcm1hdCh0aGlzLmZvcm1hdElucHV0RGF0ZSkgOiAnJ1xuICAgIF07XG4gICAgdGhpcy52YWx1ZSA9IGNvbmNhdFZhbHVlLmpvaW4oJycpO1xuICAgIHRoaXMuaXNJbnZhbGlkID0gISh0aGlzLnZhbHVlLmxlbmd0aCk7XG5cbiAgfVxuXG4gIHNldEFjY2VzcygpIHtcbiAgICB0aGlzLmNhbkFjY2Vzc1ByZXZpb3VzID0gdGhpcy5jYW5DaGFuZ2VOYXZNb250aCgtMSk7XG4gICAgdGhpcy5jYW5BY2Nlc3NOZXh0ID0gdGhpcy5jYW5DaGFuZ2VOYXZNb250aCgxKTtcbiAgfVxuXG4gIGNoYW5nZU5hdk1vbnRoKG51bTogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuY2FuQ2hhbmdlTmF2TW9udGgobnVtKSkge1xuICAgICAgdGhpcy5uYXZEYXRlLmFkZChudW0sICdtb250aCcpO1xuICAgICAgdGhpcy5jdXJyZW50TW9udGggPSB0aGlzLm5hdkRhdGUubW9udGgoKTtcbiAgICAgIHRoaXMuY3VycmVudFllYXIgPSB0aGlzLm5hdkRhdGUueWVhcigpO1xuICAgICAgdGhpcy5tYWtlR3JpZCh0aGlzLmN1cnJlbnRZZWFyLCB0aGlzLmN1cnJlbnRNb250aCk7XG4gICAgfVxuICB9XG5cbiAgY2FuQ2hhbmdlTmF2TW9udGgobnVtOiBudW1iZXIpIHtcbiAgICBjb25zdCBjbG9uZWREYXRlID0gbW9tZW50KHRoaXMubmF2RGF0ZSk7XG4gICAgcmV0dXJuIHRoaXMuY2FuQ2hhbmdlTmF2TW9udGhMb2dpYyhudW0sIGNsb25lZERhdGUpO1xuICB9XG5cbiAgbWFrZUhlYWRlcigpIHtcbiAgICBjb25zdCB3ZWVrRGF5c0FycjogQXJyYXk8bnVtYmVyPiA9IFswLCAxLCAyLCAzLCA0LCA1LCA2XTtcbiAgICB3ZWVrRGF5c0Fyci5mb3JFYWNoKGRheSA9PiB0aGlzLndlZWtEYXlzSGVhZGVyQXJyLnB1c2gobW9tZW50KCkud2Vla2RheShkYXkpLmZvcm1hdCgnZGRkJykpKTtcbiAgfVxuXG4gIGdldERpbWVuc2lvbnMoZGF0ZTogYW55KSB7XG4gICAgY29uc3QgZmlyc3REYXlEYXRlID0gbW9tZW50KGRhdGUpLnN0YXJ0T2YoJ21vbnRoJyk7XG4gICAgdGhpcy5pbml0aWFsRW1wdHlDZWxscyA9IGZpcnN0RGF5RGF0ZS53ZWVrZGF5KCk7XG4gICAgY29uc3QgbGFzdERheURhdGUgPSBtb21lbnQoZGF0ZSkuZW5kT2YoJ21vbnRoJyk7XG4gICAgdGhpcy5sYXN0RW1wdHlDZWxscyA9IDYgLSBsYXN0RGF5RGF0ZS53ZWVrZGF5KCk7XG4gICAgdGhpcy5hcnJheUxlbmd0aCA9IHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgKyB0aGlzLmxhc3RFbXB0eUNlbGxzICsgZGF0ZS5kYXlzSW5Nb250aCgpO1xuICB9XG5cbiAgbWFrZUdyaWQoeWVhciwgbW9udGgpIHtcbiAgICBpZiAoIXRoaXMuZ3JpZEFyci5oYXNPd25Qcm9wZXJ0eSh5ZWFyKSkge1xuICAgICAgdGhpcy5ncmlkQXJyW3llYXJdID0ge307XG4gICAgfVxuICAgIGlmICghdGhpcy5ncmlkQXJyW3llYXJdLmhhc093blByb3BlcnR5KG1vbnRoKSkge1xuICAgICAgdGhpcy5ncmlkQXJyW3llYXJdW21vbnRoXSA9IFtdO1xuICAgICAgdGhpcy5nZXREaW1lbnNpb25zKHRoaXMubmF2RGF0ZSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXJyYXlMZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvYmo6IGFueSA9IHt9O1xuICAgICAgICBpZiAoaSA8IHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgfHwgaSA+IHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgKyB0aGlzLm5hdkRhdGUuZGF5c0luTW9udGgoKSAtIDEpIHtcbiAgICAgICAgICBvYmoudmFsdWUgPSAwO1xuICAgICAgICAgIG9iai5hdmFpbGFibGUgPSBmYWxzZTtcbiAgICAgICAgICBvYmouaXNUb2RheSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9iai52YWx1ZSA9IGkgLSB0aGlzLmluaXRpYWxFbXB0eUNlbGxzICsgMTtcbiAgICAgICAgICBvYmouYXZhaWxhYmxlID0gdGhpcy5pc0F2YWlsYWJsZShpIC0gdGhpcy5pbml0aWFsRW1wdHlDZWxscyArIDEpO1xuICAgICAgICAgIG9iai5pc1RvZGF5ID0gdGhpcy5pc1RvZGF5KGkgLSB0aGlzLmluaXRpYWxFbXB0eUNlbGxzICsgMSwgbW9udGgsIHllYXIpO1xuICAgICAgICAgIG9iai5tb250aCA9IG1vbnRoO1xuICAgICAgICAgIG9iai5kYXRlID0gdGhpcy5uYXZEYXRlO1xuICAgICAgICAgIG9iai55ZWFyID0geWVhcjtcbiAgICAgICAgICBvYmouaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICBpZiAodGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihvYmoudmFsdWUsIG1vbnRoLCB5ZWFyKS5pc1NhbWUodGhpcy5zdGFydERhdGUpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gb2JqO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihvYmoudmFsdWUsIG1vbnRoLCB5ZWFyKS5pc1NhbWUodGhpcy5lbmREYXRlKSkge1xuICAgICAgICAgICAgdGhpcy5lbmREYXkgPSBvYmo7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvYmouaXNUb2RheSAmJiAhdGhpcy5zdGFydERheSAmJiAhdGhpcy5lbmREYXkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnREYXkgPSBvYmo7XG4gICAgICAgICAgICB0aGlzLmVuZERheSA9IG9iajtcbiAgICAgICAgICAgIG9iai5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG9iai5pblJhbmdlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ3JpZEFyclt5ZWFyXVttb250aF0ucHVzaChvYmopO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNldEFjY2VzcygpO1xuICB9XG5cbiAgaXNBdmFpbGFibGUobnVtOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCBkYXRlVG9DaGVjayA9IHRoaXMuZGF0ZUZyb21OdW0obnVtLCB0aGlzLm5hdkRhdGUpO1xuICAgIHJldHVybiB0aGlzLmlzQXZhaWxhYmxlTG9naWMoZGF0ZVRvQ2hlY2spO1xuICB9XG5cbiAgaXNUb2RheShudW06IG51bWJlciwgbW9udGg6IG51bWJlciwgeWVhcjogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZGF0ZVRvQ2hlY2sgPSBtb21lbnQodGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihudW0sIG1vbnRoLCB5ZWFyKSk7XG4gICAgcmV0dXJuIGRhdGVUb0NoZWNrLmlzU2FtZShtb21lbnQoKS5zZXQoeyBob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSkpO1xuICB9XG5cbiAgZGF0ZUZyb21OdW0obnVtOiBudW1iZXIsIHJlZmVyZW5jZURhdGU6IGFueSk6IGFueSB7XG4gICAgY29uc3QgcmV0dXJuRGF0ZSA9IG1vbWVudChyZWZlcmVuY2VEYXRlKTtcbiAgICByZXR1cm4gcmV0dXJuRGF0ZS5kYXRlKG51bSk7XG4gIH1cblxuICByZUZvcm1hdElucHV0ID0gKCkgPT4ge1xuICAgIHRoaXMuY29uY2F0VmFsdWVJbnB1dCgpO1xuICAgIHRoaXMuZm9ybWF0SW5wdXREYXRlID0gKHRoaXMuaW5jbHVkZVRpbWUpID8gJ0QgTU1NLCBZWVlZIGg6bW0gQScgOiAnRCBNTU0sIFlZWVknO1xuICB9XG5cbiAgc2VsZWN0RGF5KGRheTogYW55KSB7XG4gICAgaWYgKGRheS5hdmFpbGFibGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRlID0gdGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihkYXkudmFsdWUsIGRheS5tb250aCwgZGF5LnllYXIpO1xuICAgICAgaWYgKHRoaXMuaW5jbHVkZUVuZERhdGUpIHtcbiAgICAgICAgY29uc3QgY3VyckRhdGUgPSB0aGlzLmRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKGRheS52YWx1ZSwgZGF5Lm1vbnRoLCBkYXkueWVhcik7XG4gICAgICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgIGlmIChjdXJyRGF0ZS5pc1NhbWUobW9tZW50KHRoaXMuc3RhcnREYXRlKS5zdGFydE9mKCdkYXknKSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5tb2RlID0gJ3N0YXJ0JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyckRhdGUuaXNTYW1lT3JCZWZvcmUodGhpcy5zdGFydERhdGUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuZW5kRGF5ID0gdGhpcy5zdGFydERheTtcbiAgICAgICAgICAgICAgdGhpcy5zdGFydERheSA9IGRheTtcbiAgICAgICAgICAgICAgdGhpcy5tb2RlID0gJ3N0YXJ0JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuZW5kRGF5ID0gZGF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc3RhcnQnOlxuICAgICAgICAgICAgaWYgKGN1cnJEYXRlLmlzU2FtZShtb21lbnQodGhpcy5lbmREYXRlKS5zdGFydE9mKCdkYXknKSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5tb2RlID0gJ2VuZCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJEYXRlLmlzU2FtZU9yQWZ0ZXIodGhpcy5lbmREYXRlKSkge1xuICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gdGhpcy5lbmREYXk7XG4gICAgICAgICAgICAgIHRoaXMuZW5kRGF5ID0gZGF5O1xuICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAnZW5kJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhcnREYXkgPSBkYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuZ2VuZXJhdGVEYXRlKHRoaXMuc3RhcnREYXksIHRoaXMuc3RhcnREYXRlKTtcbiAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5nZW5lcmF0ZURhdGUodGhpcy5lbmREYXksIHRoaXMuZW5kRGF0ZSk7XG4gICAgICAgIHRoaXMuYXBwbHlSYW5nZSgpO1xuICAgICAgICB0aGlzLnN0YXJ0RGF5LmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbmREYXkuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0ge1xuICAgICAgICAgIHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsXG4gICAgICAgICAgZW5kRGF0ZTogdGhpcy5lbmREYXRlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc2V0QWN0aXZpdHkoKTtcbiAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLnNlbGVjdGVkRGF0ZTtcbiAgICAgICAgdGhpcy5zdGFydERheSA9IGRheTtcbiAgICAgICAgdGhpcy5zdGFydERheS5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB7XG4gICAgICAgICAgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVtaXRTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3RhcnREYXRlICYmIHRoaXMuZW5kRGF0ZSkge1xuICAgICAgICB0aGlzLmVtaXRTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWQpO1xuICAgICAgfVxuICAgICAgdGhpcy5yZUZvcm1hdElucHV0KCk7XG4gICAgfVxuICB9XG5cbiAgZ2VuZXJhdGVEYXRlKGRheTogYW55LCBkYXRlOiBhbnkpIHtcbiAgICBsZXQgZ2VuZXJhdGVkRGF0ZSA9IHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIoZGF5LnZhbHVlLCBkYXkubW9udGgsIGRheS55ZWFyKTtcbiAgICBpZiAoZGF0ZSkge1xuICAgICAgZ2VuZXJhdGVkRGF0ZSA9IGdlbmVyYXRlZERhdGUuc2V0KHsgaG91cjogZGF0ZS5ob3VyKCksIG1pbnV0ZTogZGF0ZS5taW51dGUoKSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGdlbmVyYXRlZERhdGU7XG4gIH1cblxuICByZXNldFJhbmdlKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZ3JpZEFycikuZm9yRWFjaCh5ZWFyID0+IHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZ3JpZEFyclt5ZWFyXSkuZm9yRWFjaChtb250aCA9PiB7XG4gICAgICAgIHRoaXMuZ3JpZEFyclt5ZWFyXVttb250aF0ubWFwKGRheSA9PiB7XG4gICAgICAgICAgZGF5LmluUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICBkYXkuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlc2V0QWN0aXZpdHkoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5ncmlkQXJyKS5mb3JFYWNoKHllYXIgPT4ge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5ncmlkQXJyW3llYXJdKS5mb3JFYWNoKG1vbnRoID0+IHtcbiAgICAgICAgdGhpcy5ncmlkQXJyW3llYXJdW21vbnRoXS5tYXAoZGF5ID0+IHtcbiAgICAgICAgICBkYXkuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKGRheSwgbW9udGgsIHllYXIpIHtcbiAgICBsZXQgdGltZU9iamVjdCA9IHsgaG91cjogMCwgbWludXRlOiAwLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH07XG4gICAgaWYgKHRoaXMuaW5jbHVkZVRpbWUpIHtcbiAgICAgIHRpbWVPYmplY3QgPSB7IGhvdXI6IHRoaXMuc3RhcnREYXRlLmhvdXIoKSwgbWludXRlOiB0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9O1xuICAgICAgdGhpcy5zdGFydERhdGUuZm9ybWF0KCdoOm1tIEEnKTtcbiAgICB9XG4gICAgcmV0dXJuIG1vbWVudChbeWVhciwgbW9udGgsIGRheV0pLnNldCh0aW1lT2JqZWN0KTtcbiAgfVxuXG4gIGFwcGx5UmFuZ2UoKSB7XG4gICAgdGhpcy5nZXREaW1lbnNpb25zKHRoaXMuc3RhcnREYXRlKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgKyB0aGlzLnN0YXJ0RGF5LnZhbHVlIC0gMTtcbiAgICBjb25zdCBzdGFydE1vbnRoTGVuZ3RoID0gdGhpcy5hcnJheUxlbmd0aDtcbiAgICB0aGlzLmdldERpbWVuc2lvbnModGhpcy5lbmREYXRlKTtcbiAgICBjb25zdCBlbmRNb250aExlbmd0aCA9IHRoaXMuYXJyYXlMZW5ndGg7XG4gICAgY29uc3QgZW5kID0gdGhpcy5pbml0aWFsRW1wdHlDZWxscyArIHRoaXMuZW5kRGF5LnZhbHVlIC0gMTtcbiAgICB0aGlzLnJlc2V0UmFuZ2UoKTtcbiAgICBpZiAodGhpcy5zdGFydERheS5tb250aCAhPT0gdGhpcy5lbmREYXkubW9udGggfHwgdGhpcy5zdGFydERheS55ZWFyICE9PSB0aGlzLmVuZERheS55ZWFyKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmdyaWRBcnIpLmZvckVhY2goeWVhciA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGVuZGFyID0gdGhpcy5ncmlkQXJyW3llYXJdO1xuICAgICAgICBPYmplY3Qua2V5cyhjYWxlbmRhcikuZm9yRWFjaChtb250aCA9PiB7XG4gICAgICAgICAgY29uc3QgZGF5cyA9IHRoaXMuZ3JpZEFyclt5ZWFyXVttb250aF07XG4gICAgICAgICAgaWYgKG1vbnRoID09IHRoaXMuc3RhcnREYXkubW9udGggJiYgeWVhciA9PSB0aGlzLnN0YXJ0RGF5LnllYXIpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhcnQ7IGkrKykge1xuICAgICAgICAgICAgICBkYXlzW2ldLmluUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IHN0YXJ0TW9udGhMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBkYXlzW2ldLmluUmFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAobW9udGggPT0gdGhpcy5lbmREYXkubW9udGggJiYgeWVhciA9PSB0aGlzLmVuZERheS55ZWFyKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICAgICAgICBkYXlzW2ldLmluUmFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGVuZCArIDE7IGkgPCBlbmRNb250aExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGRheXNbaV0uaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoKG1vbnRoID4gdGhpcy5zdGFydERheS5tb250aCB8fCB5ZWFyID4gdGhpcy5zdGFydERheS55ZWFyKSAmJiAobW9udGggPCB0aGlzLmVuZERheS5tb250aCB8fCB5ZWFyIDwgdGhpcy5lbmREYXkueWVhcikpIHtcbiAgICAgICAgICAgIGRheXMuZm9yRWFjaChkYXkgPT4gZGF5LmluUmFuZ2UgPSB0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1vbnRoID0gdGhpcy5zdGFydERheS5tb250aDtcbiAgICAgIGNvbnN0IHllYXIgPSB0aGlzLnN0YXJ0RGF5LnllYXI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJ0OyBpKyspIHtcbiAgICAgICAgdGhpcy5ncmlkQXJyW3llYXJdW21vbnRoXVtpXS5pblJhbmdlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHtcbiAgICAgICAgdGhpcy5ncmlkQXJyW3llYXJdW21vbnRoXVtpXS5pblJhbmdlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSBlbmQgKyAxOyBpIDwgdGhpcy5hcnJheUxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZ3JpZEFyclt5ZWFyXVttb250aF1baV0uaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlzQXZhaWxhYmxlTG9naWMoZGF0ZVRvQ2hlY2s6IGFueSkge1xuICAgIGlmICh0aGlzLm1pbkRhdGUgfHwgdGhpcy5tYXhEYXRlKSB7XG4gICAgICByZXR1cm4gIShkYXRlVG9DaGVjay5pc0JlZm9yZSh0aGlzLm1pbkRhdGUpIHx8IGRhdGVUb0NoZWNrLmlzQWZ0ZXIodGhpcy5tYXhEYXRlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAhZGF0ZVRvQ2hlY2suaXNCZWZvcmUobW9tZW50KCksICdkYXknKTtcbiAgICB9XG4gIH1cblxuICBjYW5DaGFuZ2VOYXZNb250aExvZ2ljKG51bSwgY3VycmVudERhdGUpIHtcbiAgICBjdXJyZW50RGF0ZS5hZGQobnVtLCAnbW9udGgnKTtcbiAgICBjb25zdCBtaW5EYXRlID0gdGhpcy5taW5EYXRlID8gdGhpcy5taW5EYXRlIDogbW9tZW50KCkuYWRkKC0xLCAnbW9udGgnKTtcbiAgICBjb25zdCBtYXhEYXRlID0gdGhpcy5tYXhEYXRlID8gdGhpcy5tYXhEYXRlIDogbW9tZW50KCkuYWRkKDEsICd5ZWFyJyk7XG4gICAgcmV0dXJuIGN1cnJlbnREYXRlLmlzQmV0d2VlbihtaW5EYXRlLCBtYXhEYXRlKTtcbiAgfVxuXG4gIHRvZ2dsZUNhbGVuZGFyKCk6IGFueSB7XG4gICAgdGhpcy5pc09wZW4gPSAhdGhpcy5pc09wZW47XG4gIH1cblxuICBvcGVuQ2FsZW5kYXIoKTogYW55IHtcbiAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gICAgdGhpcy5vblRvdWNoKCk7XG4gIH1cblxuICBjbG9zZUNhbGVuZGFyKCk6IGFueSB7XG4gICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICB0aGlzLmVtaXRTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWQpO1xuICB9XG5cbiAgY2hhbmdlTW9kZShtb2RlOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgIHRoaXMub25Ub3VjaCgpXG4gIH1cblxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucmVzZXRSYW5nZSgpO1xuICAgIHRoaXMuc3RhcnREYXRlID0gbW9tZW50KCk7XG4gICAgdGhpcy5lbmREYXRlID0gbnVsbDtcbiAgICB0aGlzLm5hdkRhdGUgPSB0aGlzLnRvZGF5RGF0ZTtcbiAgICB0aGlzLmN1cnJlbnRNb250aCA9IHRoaXMubmF2RGF0ZS5tb250aCgpO1xuICAgIHRoaXMuY3VycmVudFllYXIgPSB0aGlzLm5hdkRhdGUueWVhcigpO1xuICAgIHRoaXMuaW5jbHVkZUVuZERhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmluY2x1ZGVUaW1lID0gZmFsc2U7XG4gICAgdGhpcy5zdGFydFRpbWUgPSBudWxsO1xuICAgIHRoaXMuZW5kVGltZSA9IG51bGw7XG4gICAgdGhpcy5tb2RlID0gJ3N0YXJ0JztcbiAgICB0aGlzLm1ha2VHcmlkKHRoaXMuY3VycmVudFllYXIsIHRoaXMuY3VycmVudE1vbnRoKTtcbiAgICB0aGlzLnJlRm9ybWF0SW5wdXQoKTtcbiAgfVxuXG4gIHNldFRpbWUobW9tZW50LCBob3VyOiBudW1iZXIgPSAwLCBtaW51dGU6IG51bWJlciA9IDApIHtcbiAgICByZXR1cm4gbW9tZW50LnNldCh7IGhvdXIsIG1pbnV0ZSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgfVxuXG4gIGhhbmRsZU1vZGVDaGFuZ2UoKSB7XG4gICAgdGhpcy5yZXNldFJhbmdlKCk7XG4gICAgdGhpcy5tb2RlID0gJ2VuZCc7XG4gICAgaWYgKHRoaXMuc3RhcnREYXkpIHtcbiAgICAgIHRoaXMuc3RhcnREYXkuaXNBY3RpdmUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaW5jbHVkZUVuZERhdGUpIHtcbiAgICAgIHRoaXMuZW5kRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLm1vZGUgPSAnc3RhcnQnO1xuICAgICAgdGhpcy5zdGFydERheS5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5lbmREYXkuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdG1wU3RhcnREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcbiAgICAgIGNvbnN0IG5leHREYXkgPSB0bXBTdGFydERhdGUuYWRkKDIsICdkYXlzJykuZm9ybWF0KGBZWVlZLSR7dG1wU3RhcnREYXRlLmZvcm1hdCgnTScpIC0gMX0tRGApO1xuICAgICAgdGhpcy5zaW11bGF0ZUNsaWNrKG5leHREYXkpO1xuICAgIH1cblxuICB9XG5cbiAgc2ltdWxhdGVDbGljayA9IChkYXRlOiBzdHJpbmcpID0+IHtcbiAgICB0cnkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGdldERheU5leHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuY2FsZW5kYXItZGF5LW5vdC1yYW5nZS0ke2RhdGV9ID4gYnV0dG9uYCkgYXMgYW55O1xuICAgICAgICBpZiAoZ2V0RGF5TmV4dCkge1xuICAgICAgICAgIGdldERheU5leHQuY2xpY2soKTtcbiAgICAgICAgfVxuICAgICAgfSwgNTApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHNldFN0YXJ0VGltZSh0aW1lKSB7XG4gICAgdGhpcy5zdGFydFRpbWUgPSB0aW1lO1xuICB9XG5cbiAgc2V0RW5kVGltZSh0aW1lKSB7XG4gICAgdGhpcy5lbmRUaW1lID0gdGltZTtcbiAgfVxuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zaGFkb3dlZC12YXJpYWJsZVxuICBoYW5kbGVUaW1lQ2hhbmdlKHRpbWU6IGFueSwgbW9tZW50OiBhbnksIG1vZGU6IHN0cmluZykge1xuICAgIHRoaXMucmVGb3JtYXRJbnB1dCgpO1xuICAgIGlmICghdGltZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aW1lID0gdGltZS5yZXBsYWNlKC9bXmEtekEtWjAtOV0vZywgJycpO1xuICAgIG1vbWVudC5zZXQoeyBob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSk7XG4gICAgbGV0IGxhc3RUd28gPSB0aW1lLnN1YnN0cih0aW1lLmxlbmd0aCAtIDIpLnRvVXBwZXJDYXNlKCk7XG4gICAgbGV0IGxhc3QgPSB0aW1lLnN1YnN0cih0aW1lLmxlbmd0aCAtIDEpLnRvVXBwZXJDYXNlKCk7XG4gICAgY29uc3QgaGFzTGFzdFR3byA9IFsnQU0nLCAnUE0nXS5pbmNsdWRlcyhsYXN0VHdvKTtcbiAgICBjb25zdCBoYXNMYXN0ID0gWydBJywgJ1AnXS5pbmNsdWRlcyhsYXN0KTtcbiAgICBsZXQgaXNBbSA9IHRydWU7XG4gICAgbGV0IGlzUG0gPSBmYWxzZTtcbiAgICBpZiAoaGFzTGFzdCB8fCBoYXNMYXN0VHdvKSB7XG4gICAgICBpc0FtID0gbGFzdCA9PT0gJ0EnIHx8IGxhc3RUd28gPT09ICdBTSc7XG4gICAgICBpc1BtID0gbGFzdCA9PT0gJ1AnIHx8IGxhc3RUd28gPT09ICdQTSc7XG4gICAgfVxuICAgIHRpbWUgPSB0aW1lLnJlcGxhY2UoL1teMC05XS9nLCAnJyk7XG4gICAgbGFzdFR3byA9IHRpbWUuc3Vic3RyKHRpbWUubGVuZ3RoIC0gMik7XG4gICAgbGFzdCA9IHRpbWUuc3Vic3RyKHRpbWUubGVuZ3RoIC0gMSk7XG4gICAgdGltZSA9IHRpbWUuc3Vic3RyKDAsIDQpO1xuICAgIHRoaXMuaXNJbnZhbGlkID0gZmFsc2U7XG4gICAgc3dpdGNoICh0aW1lLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBtb21lbnRcbiAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZSkpIDpcbiAgICAgICAgICAgIHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lKSArIDEyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGlmIChsYXN0ID49IDYpIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRpbWUgPT09IDEyKSB7XG4gICAgICAgICAgbW9tZW50XG4gICAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCAwKSA6XG4gICAgICAgICAgICAgIHRoaXMuc2V0VGltZShtb21lbnQsIDEyKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aW1lIDwgMTIpIHtcbiAgICAgICAgICBtb21lbnRcbiAgICAgICAgICAgID0gaXNBbSA/IHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lKSkgOlxuICAgICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZSkgKyAxMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9tZW50XG4gICAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSksIE51bWJlcihsYXN0KSkgOlxuICAgICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSkgKyAxMiwgTnVtYmVyKGxhc3QpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaWYgKGxhc3RUd28gPj0gNjApIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbW9tZW50XG4gICAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSksIE51bWJlcihsYXN0VHdvKSkgOlxuICAgICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZVswXSkgKyAxMiwgTnVtYmVyKGxhc3RUd28pKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgaWYgKGxhc3RUd28gPj0gNjApIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbW9tZW50ID0gdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWUuc3Vic3RyKDAsIDIpKSwgTnVtYmVyKGxhc3RUd28pKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnLS0nLCB0aGlzLmlzSW52YWxpZClcbiAgICB0aGlzLmVtaXRTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWQpO1xuICAgIGlmIChtb2RlID09PSAnc3RhcnQnKSB7XG4gICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudDtcbiAgICAgIHRoaXMuc3RhcnRUaW1lUGlja2VyLm5hdGl2ZUVsZW1lbnQuYmx1cigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVuZERhdGUgPSBtb21lbnQ7XG4gICAgICB0aGlzLmVuZFRpbWVQaWNrZXIubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==