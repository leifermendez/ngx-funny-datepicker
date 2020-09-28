/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as moment_ from 'moment';
/** @type {?} */
var moment = moment_;
var DatepickerComponent = /** @class */ (function () {
    function DatepickerComponent() {
        var _this = this;
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
        function () {
            /** @type {?} */
            var concatValue = [
                _this.startDate.format(_this.formatInputDate),
                (_this.endDate) ? '  -  ' : '',
                (_this.endDate) ? _this.endDate.format(_this.formatInputDate) : ''
            ];
            _this.inputValueOutput = concatValue.join('');
        });
        this.reFormatInput = (/**
         * @return {?}
         */
        function () {
            _this.concatValueInput();
            _this.formatInputDate = (_this.includeTime) ? 'D MMM, YYYY h:mm A' : 'D MMM, YYYY';
        });
        this.simulateClick = (/**
         * @param {?} date
         * @return {?}
         */
        function (date) {
            try {
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    /** @type {?} */
                    var getDayNext = (/** @type {?} */ (document.querySelector(".calendar-day-not-range-" + date + " > button")));
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
    DatepickerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @return {?}
     */
    DatepickerComponent.prototype.setOptions = /**
     * @return {?}
     */
    function () {
        this.includeEndDate = false;
        this.includeTime = false;
    };
    /**
     * @return {?}
     */
    DatepickerComponent.prototype.setAccess = /**
     * @return {?}
     */
    function () {
        this.canAccessPrevious = this.canChangeNavMonth(-1);
        this.canAccessNext = this.canChangeNavMonth(1);
    };
    /**
     * @param {?} num
     * @return {?}
     */
    DatepickerComponent.prototype.changeNavMonth = /**
     * @param {?} num
     * @return {?}
     */
    function (num) {
        if (this.canChangeNavMonth(num)) {
            this.navDate.add(num, 'month');
            this.currentMonth = this.navDate.month();
            this.currentYear = this.navDate.year();
            this.makeGrid(this.currentYear, this.currentMonth);
        }
    };
    /**
     * @param {?} num
     * @return {?}
     */
    DatepickerComponent.prototype.canChangeNavMonth = /**
     * @param {?} num
     * @return {?}
     */
    function (num) {
        /** @type {?} */
        var clonedDate = moment(this.navDate);
        return this.canChangeNavMonthLogic(num, clonedDate);
    };
    /**
     * @return {?}
     */
    DatepickerComponent.prototype.makeHeader = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var weekDaysArr = [0, 1, 2, 3, 4, 5, 6];
        weekDaysArr.forEach((/**
         * @param {?} day
         * @return {?}
         */
        function (day) { return _this.weekDaysHeaderArr.push(moment().weekday(day).format('ddd')); }));
    };
    /**
     * @param {?} date
     * @return {?}
     */
    DatepickerComponent.prototype.getDimensions = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        /** @type {?} */
        var firstDayDate = moment(date).startOf('month');
        this.initialEmptyCells = firstDayDate.weekday();
        /** @type {?} */
        var lastDayDate = moment(date).endOf('month');
        this.lastEmptyCells = 6 - lastDayDate.weekday();
        this.arrayLength = this.initialEmptyCells + this.lastEmptyCells + date.daysInMonth();
    };
    /**
     * @param {?} year
     * @param {?} month
     * @return {?}
     */
    DatepickerComponent.prototype.makeGrid = /**
     * @param {?} year
     * @param {?} month
     * @return {?}
     */
    function (year, month) {
        if (!this.gridArr.hasOwnProperty(year)) {
            this.gridArr[year] = {};
        }
        if (!this.gridArr[year].hasOwnProperty(month)) {
            this.gridArr[year][month] = [];
            this.getDimensions(this.navDate);
            for (var i = 0; i < this.arrayLength; i++) {
                /** @type {?} */
                var obj = {};
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
    };
    /**
     * @param {?} num
     * @return {?}
     */
    DatepickerComponent.prototype.isAvailable = /**
     * @param {?} num
     * @return {?}
     */
    function (num) {
        /** @type {?} */
        var dateToCheck = this.dateFromNum(num, this.navDate);
        return this.isAvailableLogic(dateToCheck);
    };
    /**
     * @param {?} num
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    DatepickerComponent.prototype.isToday = /**
     * @param {?} num
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    function (num, month, year) {
        /** @type {?} */
        var dateToCheck = moment(this.dateFromDayAndMonthAndYear(num, month, year));
        return dateToCheck.isSame(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }));
    };
    /**
     * @param {?} num
     * @param {?} referenceDate
     * @return {?}
     */
    DatepickerComponent.prototype.dateFromNum = /**
     * @param {?} num
     * @param {?} referenceDate
     * @return {?}
     */
    function (num, referenceDate) {
        /** @type {?} */
        var returnDate = moment(referenceDate);
        return returnDate.date(num);
    };
    /**
     * @param {?} day
     * @return {?}
     */
    DatepickerComponent.prototype.selectDay = /**
     * @param {?} day
     * @return {?}
     */
    function (day) {
        if (day.available) {
            this.selectedDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
            if (this.includeEndDate) {
                /** @type {?} */
                var currDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
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
    };
    /**
     * @param {?} day
     * @param {?} date
     * @return {?}
     */
    DatepickerComponent.prototype.generateDate = /**
     * @param {?} day
     * @param {?} date
     * @return {?}
     */
    function (day, date) {
        /** @type {?} */
        var generatedDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
        if (date) {
            generatedDate = generatedDate.set({ hour: date.hour(), minute: date.minute() });
        }
        return generatedDate;
    };
    /**
     * @return {?}
     */
    DatepickerComponent.prototype.resetRange = /**
     * @return {?}
     */
    function () {
        var _this = this;
        Object.keys(this.gridArr).forEach((/**
         * @param {?} year
         * @return {?}
         */
        function (year) {
            Object.keys(_this.gridArr[year]).forEach((/**
             * @param {?} month
             * @return {?}
             */
            function (month) {
                _this.gridArr[year][month].map((/**
                 * @param {?} day
                 * @return {?}
                 */
                function (day) {
                    day.inRange = false;
                    day.isActive = false;
                }));
            }));
        }));
    };
    /**
     * @return {?}
     */
    DatepickerComponent.prototype.resetActivity = /**
     * @return {?}
     */
    function () {
        var _this = this;
        Object.keys(this.gridArr).forEach((/**
         * @param {?} year
         * @return {?}
         */
        function (year) {
            Object.keys(_this.gridArr[year]).forEach((/**
             * @param {?} month
             * @return {?}
             */
            function (month) {
                _this.gridArr[year][month].map((/**
                 * @param {?} day
                 * @return {?}
                 */
                function (day) {
                    day.isActive = false;
                }));
            }));
        }));
    };
    /**
     * @param {?} day
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    DatepickerComponent.prototype.dateFromDayAndMonthAndYear = /**
     * @param {?} day
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    function (day, month, year) {
        /** @type {?} */
        var timeObject = { hour: 0, minute: 0, second: 0, millisecond: 0 };
        if (this.includeTime) {
            timeObject = { hour: this.startDate.hour(), minute: this.startDate.minute(), second: 0, millisecond: 0 };
            this.startDate.format('h:mm A');
        }
        return moment([year, month, day]).set(timeObject);
    };
    /**
     * @return {?}
     */
    DatepickerComponent.prototype.applyRange = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.getDimensions(this.startDate);
        /** @type {?} */
        var start = this.initialEmptyCells + this.startDay.value - 1;
        /** @type {?} */
        var startMonthLength = this.arrayLength;
        this.getDimensions(this.endDate);
        /** @type {?} */
        var endMonthLength = this.arrayLength;
        /** @type {?} */
        var end = this.initialEmptyCells + this.endDay.value - 1;
        this.resetRange();
        if (this.startDay.month !== this.endDay.month || this.startDay.year !== this.endDay.year) {
            Object.keys(this.gridArr).forEach((/**
             * @param {?} year
             * @return {?}
             */
            function (year) {
                /** @type {?} */
                var calendar = _this.gridArr[year];
                Object.keys(calendar).forEach((/**
                 * @param {?} month
                 * @return {?}
                 */
                function (month) {
                    /** @type {?} */
                    var days = _this.gridArr[year][month];
                    if (month == _this.startDay.month && year == _this.startDay.year) {
                        for (var i = 0; i < start; i++) {
                            days[i].inRange = false;
                        }
                        for (var i = start; i < startMonthLength; i++) {
                            days[i].inRange = true;
                        }
                    }
                    else if (month == _this.endDay.month && year == _this.endDay.year) {
                        for (var i = 0; i <= end; i++) {
                            days[i].inRange = true;
                        }
                        for (var i = end + 1; i < endMonthLength; i++) {
                            days[i].inRange = false;
                        }
                    }
                    else if ((month > _this.startDay.month || year > _this.startDay.year) && (month < _this.endDay.month || year < _this.endDay.year)) {
                        days.forEach((/**
                         * @param {?} day
                         * @return {?}
                         */
                        function (day) { return day.inRange = true; }));
                    }
                }));
            }));
        }
        else {
            /** @type {?} */
            var month = this.startDay.month;
            /** @type {?} */
            var year = this.startDay.year;
            for (var i = 0; i < start; i++) {
                this.gridArr[year][month][i].inRange = false;
            }
            for (var i = start; i <= end; i++) {
                this.gridArr[year][month][i].inRange = true;
            }
            for (var i = end + 1; i < this.arrayLength; i++) {
                this.gridArr[year][month][i].inRange = false;
            }
        }
    };
    /**
     * @param {?} dateToCheck
     * @return {?}
     */
    DatepickerComponent.prototype.isAvailableLogic = /**
     * @param {?} dateToCheck
     * @return {?}
     */
    function (dateToCheck) {
        if (this.minDate || this.maxDate) {
            return !(dateToCheck.isBefore(this.minDate) || dateToCheck.isAfter(this.maxDate));
        }
        else {
            return !dateToCheck.isBefore(moment(), 'day');
        }
    };
    /**
     * @param {?} num
     * @param {?} currentDate
     * @return {?}
     */
    DatepickerComponent.prototype.canChangeNavMonthLogic = /**
     * @param {?} num
     * @param {?} currentDate
     * @return {?}
     */
    function (num, currentDate) {
        currentDate.add(num, 'month');
        /** @type {?} */
        var minDate = this.minDate ? this.minDate : moment().add(-1, 'month');
        /** @type {?} */
        var maxDate = this.maxDate ? this.maxDate : moment().add(1, 'year');
        return currentDate.isBetween(minDate, maxDate);
    };
    /**
     * @return {?}
     */
    DatepickerComponent.prototype.toggleCalendar = /**
     * @return {?}
     */
    function () {
        this.isOpen = !this.isOpen;
    };
    /**
     * @return {?}
     */
    DatepickerComponent.prototype.openCalendar = /**
     * @return {?}
     */
    function () {
        this.isOpen = true;
    };
    /**
     * @return {?}
     */
    DatepickerComponent.prototype.closeCalendar = /**
     * @return {?}
     */
    function () {
        this.isOpen = false;
    };
    /**
     * @param {?} mode
     * @return {?}
     */
    DatepickerComponent.prototype.changeMode = /**
     * @param {?} mode
     * @return {?}
     */
    function (mode) {
        this.mode = mode;
    };
    /**
     * @return {?}
     */
    DatepickerComponent.prototype.clear = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @param {?} moment
     * @param {?=} hour
     * @param {?=} minute
     * @return {?}
     */
    DatepickerComponent.prototype.setTime = /**
     * @param {?} moment
     * @param {?=} hour
     * @param {?=} minute
     * @return {?}
     */
    function (moment, hour, minute) {
        if (hour === void 0) { hour = 0; }
        if (minute === void 0) { minute = 0; }
        return moment.set({ hour: hour, minute: minute, second: 0, millisecond: 0 });
    };
    /**
     * @return {?}
     */
    DatepickerComponent.prototype.handleModeChange = /**
     * @return {?}
     */
    function () {
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
            var tmpStartDate = this.startDate.clone();
            /** @type {?} */
            var nextDay = tmpStartDate.add(2, 'days').format("YYYY-" + (tmpStartDate.format('M') - 1) + "-D");
            this.simulateClick(nextDay);
        }
    };
    /**
     * @param {?} time
     * @return {?}
     */
    DatepickerComponent.prototype.setStartTime = /**
     * @param {?} time
     * @return {?}
     */
    function (time) {
        this.startTime = time;
    };
    /**
     * @param {?} time
     * @return {?}
     */
    DatepickerComponent.prototype.setEndTime = /**
     * @param {?} time
     * @return {?}
     */
    function (time) {
        this.endTime = time;
    };
    // tslint:disable-next-line:no-shadowed-variable
    // tslint:disable-next-line:no-shadowed-variable
    /**
     * @param {?} time
     * @param {?} moment
     * @param {?} mode
     * @return {?}
     */
    DatepickerComponent.prototype.handleTimeChange = 
    // tslint:disable-next-line:no-shadowed-variable
    /**
     * @param {?} time
     * @param {?} moment
     * @param {?} mode
     * @return {?}
     */
    function (time, moment, mode) {
        this.reFormatInput();
        if (!time) {
            return;
        }
        time = time.replace(/[^a-zA-Z0-9]/g, '');
        moment.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        /** @type {?} */
        var lastTwo = time.substr(time.length - 2).toUpperCase();
        /** @type {?} */
        var last = time.substr(time.length - 1).toUpperCase();
        /** @type {?} */
        var hasLastTwo = ['AM', 'PM'].includes(lastTwo);
        /** @type {?} */
        var hasLast = ['A', 'P'].includes(last);
        /** @type {?} */
        var isAm = true;
        /** @type {?} */
        var isPm = false;
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
    };
    DatepickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'funny-datepicker-single',
                    template: "<!-- ********* INPUT FROM DATE Collaborator https://github.com/leifermendez ***************** --->\n\n<input (click)=\"openCalendar()\" readonly spellcheck=\"false\" class=\"omit-trigger-outside input-date-funny\"\n       autocomplete=\"nope\"\n       [ngClass]=\"{'bg-blue': mode === 'start' && includeEndDate, 'bg-red': isInvalid, 'funny-range':includeEndDate }\"\n       type=\"text\" [value]=\"inputValueOutput\">\n\n<!--- *************** CALENDAR ELEMENTS Author https://github.com/mokshithpyla ************* --->\n<div (clickOutside)=\"closeCalendar()\" class=\"calendar\" *ngIf=\"isOpen\">\n  <div class=\"calendar-nav\">\n    <div class=\"calendar-nav-previous-month\">\n      <button class=\"button is-text\" (click)=\"changeNavMonth(-1)\" [disabled]=\"!canAccessPrevious\">\n        <i class=\"fa fa-chevron-left\"></i>\n      </button>\n    </div>\n    <div>{{navDate.format('MMMM YYYY')}}</div>\n    <div class=\"calendar-nav-next-month\">\n      <button class=\"button is-text\" (click)=\"changeNavMonth(1)\" [disabled]=\"!canAccessNext\">\n        <i class=\"fa fa-chevron-right\"></i>\n      </button>\n    </div>\n  </div>\n  <div class=\"calendar-container\">\n    <div class=\"calendar-header\">\n      <div class=\"calendar-date\" *ngFor=\"let day of weekDaysHeaderArr\">\n        {{day}}\n      </div>\n    </div>\n    <div class=\"calendar-body\" *ngIf=\"includeEndDate; else notRange\">\n      <ng-container *ngIf=\"gridArr\">\n        <div *ngFor=\"let day of gridArr[currentYear][currentMonth]\"\n             class=\"calendar-date calendar-day-not-range-{{currentYear}}-{{currentMonth}}-{{day?.value}}\"\n             [ngClass]=\"{\n          'is-disabled': !day.available,\n          'calendar-range': day.inRange,\n          'calendar-range-start': day.value === startDay?.value &&  day.month === startDay?.month && day.year === startDay?.year ,\n          'calendar-range-end': day.value === endDay?.value && day.month === endDay?.month && day.year === endDay?.year}\">\n          <button *ngIf=\"day.value !== 0\" class=\"date-item\"\n                  [ngClass]=\"{'is-active': day.isActive, 'is-today': day.isToday}\" (click)=\"selectDay(day)\">\n            {{day.value}}</button>\n          <button *ngIf=\"day.value === 0\" class=\"date-item\"></button>\n        </div>\n      </ng-container>\n    </div>\n    <ng-template #notRange>\n      <div class=\"calendar-body\">\n        <div *ngFor=\"let day of gridArr[currentYear][currentMonth]\"\n             class=\"calendar-date calendar-day-range-{{currentYear}}-{{currentMonth}}-{{day?.value}}\"\n             [ngClass]=\"{'is-disabled': !day.available }\">\n          <button *ngIf=\"day.value !== 0\" class=\"date-item\"\n                  [ngClass]=\"{'is-active': day.isActive, 'is-today': day.isToday}\"\n                  (click)=\"selectDay(day)\">{{day.value}}</button>\n          <button *ngIf=\"day.value === 0\" class=\"date-item\"></button>\n        </div>\n      </div>\n    </ng-template>\n    <div class=\"footer-calendar\">\n      <div class=\"flex justify-content-between options-bar divider\">\n        <div class=\"flex\">\n          <div class=\"label-placeholder label-option pr-25\">\n            <input type=\"checkbox\" [(ngModel)]=\"includeEndDate\" (change)=\"handleModeChange()\">\n            <small>RANGO</small>\n          </div>\n          <div class=\"label-placeholder label-option pr-25\">\n            <input\n              (change)=\"reFormatInput();handleTimeChange(startTime, startDate, 'start');handleTimeChange(endTime, endDate, 'end')\"\n              [(ngModel)]=\"includeTime\" type=\"checkbox\">\n            <small>HORAS</small>\n          </div>\n        </div>\n        <div class=\"label-placeholder label-option pr-25\">\n          <div (click)=\"clear()\">Limpiar</div>\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{startDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{startDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{startDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <input #startTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"\n                 [ngModel]=\"startDate.format('h:mm A')\" *ngIf=\"startDate && includeTime\"\n                 (ngModelChange)=\"setStartTime($event)\" (blur)=\"handleTimeChange(startTime, startDate, 'start')\"\n                 (keyup.enter)=\"handleTimeChange(startTime, startDate, 'start')\">\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\" *ngIf=\"includeEndDate\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{endDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{endDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{endDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <ng-container *ngIf=\"endDate\">\n            <input #endTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"\n                   [ngModel]=\"endDate.format('h:mm A')\"\n                   (ngModelChange)=\"setEndTime($event)\" *ngIf=\"isRange && includeTime\"\n                   (blur)=\"handleTimeChange(endTime, endDate, 'end')\"\n                   (keyup.enter)=\"handleTimeChange(endTime, endDate, 'end')\">\n          </ng-container>\n        </div>\n      </div>\n      <!--      -->\n      <!--      <div class=\"divider\" *ngIf=\"hasTime\">-->\n      <!--        <div class=\"label-placeholder\">-->\n      <!--          <small>FROM</small>-->\n      <!--        </div>-->\n      <!--        <div class=\"justify-content-between flex pt-25\">-->\n      <!--          <div class=\" align-left\">-->\n      <!--            <div *ngIf=\"includeTime\" class=\" align-right\">-->\n      <!--              <div *ngIf=\"startDate\">-->\n      <!--                <input #startTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"-->\n      <!--                       [ngModel]=\"startDate.format('h:mm A')\"-->\n      <!--                       (ngModelChange)=\"setStartTime($event)\" (blur)=\"handleTimeChange(startTime, startDate, 'start')\"-->\n      <!--                       (keyup.enter)=\"handleTimeChange(startTime, startDate, 'start')\">-->\n      <!--              </div>-->\n      <!--              <div *ngIf=\"!startDate\" class=\" align-right\">-->\n      <!--                &#45;&#45;-->\n      <!--              </div>-->\n      <!--            </div>-->\n      <!--          </div>-->\n      <!--          <div class=\" align-right\">-->\n      <!--            <label class=\"switch\">-->\n      <!--              <input type=\"checkbox\" (change)=\"reFormatInput()\" [(ngModel)]=\"includeTime\">-->\n      <!--              <span class=\"slider round\"></span>-->\n      <!--            </label>-->\n      <!--          </div>-->\n      <!--        </div>-->\n      <!--      </div>-->\n\n      <!--      <div class=\"divider\" *ngIf=\"isRange\">-->\n      <!--        <div class=\"label-placeholder\">-->\n      <!--          <small>TO</small>-->\n      <!--        </div>-->\n      <!--        <div class=\" justify-content-between flex pt-25\">-->\n      <!--          <div class=\" align-left \">-->\n      <!--            <div *ngIf=\"includeTime\" class=\" align-right\">-->\n      <!--              <div *ngIf=\"endDate\">-->\n      <!--                <input #endTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"-->\n      <!--                       [ngModel]=\"endDate.format('h:mm A')\"-->\n      <!--                       (ngModelChange)=\"setEndTime($event)\"-->\n      <!--                       (blur)=\"handleTimeChange(endTime, endDate, 'end')\"-->\n      <!--                       (keyup.enter)=\"handleTimeChange(endTime, endDate, 'end')\">-->\n      <!--              </div>-->\n      <!--              <div *ngIf=\"!endDate\" class=\" align-right\">-->\n      <!--                &#45;&#45;-->\n      <!--              </div>-->\n      <!--            </div>-->\n      <!--          </div>-->\n      <!--          <div class=\" align-right\">-->\n      <!--            <label class=\"switch\">-->\n      <!--              <input type=\"checkbox\" [(ngModel)]=\"includeEndDate\" (change)=\"handleModeChange()\">-->\n      <!--              <span class=\"slider round\"></span>-->\n      <!--            </label>-->\n      <!--          </div>-->\n      <!--        </div>-->\n      <!--      </div>-->\n\n      <!--      <div class=\"divider\">-->\n      <!--        <button type=\"button\" class=\"datetimepicker-footer-clear has-text-danger button is-small is-text\"-->\n      <!--                (click)=\"clear()\">Clear All-->\n      <!--        </button>-->\n      <!--      </div>-->\n\n    </div>\n  </div>\n</div>\n",
                    styles: [".datetimepicker-footer{display:flex;flex:1;justify-content:space-evenly;margin:0}.datetimepicker-selection-start{display:flex;align-items:center;border-radius:3px;background:rgba(242,241,238,.6);height:28px;line-height:1.2;padding-left:8px;padding-right:8px;flex-basis:50%;box-shadow:rgba(15,15,15,.1) 0 0 0 1px inset,rgba(15,15,15,.1) 0 1px 1px inset;flex-grow:1;font-size:14px}.bg-blue{background:rgba(46,170,220,.15)!important;box-shadow:#2eaadc 0 0 0 2px inset!important}.bg-red{background:rgba(235,87,87,.15)!important;box-shadow:#eb5757 0 0 0 2px inset}.switch{position:relative;display:inline-block;width:60px;height:34px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s}.slider:before{position:absolute;content:\"\";height:26px;width:26px;left:4px;bottom:4px;background-color:#fff;transition:.4s}input:checked+.slider{background-color:#00d1b2}input:focus+.slider{box-shadow:0 0 1px #00d1b2}input:checked+.slider:before{transform:translateX(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}.pb10{padding-bottom:10px}.flex{display:flex}.w33p{width:33.33%}.align-right{text-align:right}.w56p{width:56.33%}.align-left{text-align:left}.pl10{padding-left:10px}"]
                }] }
    ];
    /** @nocollapse */
    DatepickerComponent.ctorParameters = function () { return []; };
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
    return DatepickerComponent;
}());
export { DatepickerComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZnVubnktZGF0ZXBpY2tlci8iLCJzb3VyY2VzIjpbImxpYi9kYXRlcGlja2VyL2RhdGVwaWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEcsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7O0lBQzVCLE1BQU0sR0FBRyxPQUFPO0FBRXRCO0lBMkNFO1FBQUEsaUJBQ0M7UUFoQ1EsY0FBUyxHQUFRLE1BQU0sRUFBRSxDQUFDO1FBSXpCLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUdqRCxXQUFNLEdBQUcsSUFBSSxDQUFDO1FBRWQsc0JBQWlCLEdBQWtCLEVBQUUsQ0FBQztRQUN0QyxZQUFPLEdBQVEsRUFBRSxDQUFDO1FBRWxCLHNCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QixrQkFBYSxHQUFHLElBQUksQ0FBQztRQUNyQixjQUFTLEdBQUcsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFHNUUsU0FBSSxHQUFHLEtBQUssQ0FBQztRQVNiLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFHbEIsb0JBQWUsR0FBRyxhQUFhLENBQUM7UUF3QmhDLHFCQUFnQjs7O1FBQUc7O2dCQUNYLFdBQVcsR0FBRztnQkFDbEIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLGVBQWUsQ0FBQztnQkFDM0MsQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9B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MEI7O0lBQzFCLHdDQUFtQzs7SUFDbkMsc0NBQXNCOztJQUN0QixzQ0FBc0I7O0lBQ3RCLHNDQUFzQjs7SUFDdEIsMkNBQWlEOztJQUNqRCwrQ0FBeUI7O0lBQ3pCLHFDQUFnQjs7SUFDaEIscUNBQWM7O0lBQ2Qsc0NBQWE7O0lBQ2IsZ0RBQXNDOztJQUN0QyxzQ0FBa0I7O0lBQ2xCLDJDQUFrQjs7SUFDbEIsZ0RBQXlCOztJQUN6Qiw0Q0FBcUI7O0lBQ3JCLHdDQUE0RTs7SUFDNUUsdUNBQWM7O0lBQ2QscUNBQVk7O0lBQ1osbUNBQWE7O0lBQ2IsZ0RBQTBCOztJQUMxQiw2Q0FBdUI7O0lBQ3ZCLDBDQUFvQjs7SUFDcEIsMkNBQXFCOztJQUNyQiwwQ0FBb0I7O0lBQ3BCLHVDQUFjOztJQUNkLHdDQUFlOztJQUNmLHNDQUFhOztJQUNiLHdDQUFrQjs7SUFDbEIsNkNBQXdCOztJQUN4QiwwQ0FBcUI7O0lBQ3JCLDhDQUFnQzs7SUF3QmhDLCtDQVFFOztJQXlGRiw0Q0FHRTs7SUFtTkYsNENBV0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIG1vbWVudF8gZnJvbSAnbW9tZW50JztcbmNvbnN0IG1vbWVudCA9IG1vbWVudF87XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Z1bm55LWRhdGVwaWNrZXItc2luZ2xlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2RhdGVwaWNrZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9kYXRlcGlja2VyLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlcGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgLy8gQHRzLWlnbm9yZVxuICBAVmlld0NoaWxkKCdzdGFydFRpbWVQaWNrZXInKSBzdGFydFRpbWVQaWNrZXI6IEVsZW1lbnRSZWY7XG4gIC8vIEB0cy1pZ25vcmVcbiAgQFZpZXdDaGlsZCgnZW5kVGltZVBpY2tlcicpIGVuZFRpbWVQaWNrZXI6IEVsZW1lbnRSZWY7XG4gIEBJbnB1dCgpIGlzUmFuZ2U6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGhhc1RpbWU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHN0YXJ0RGF0ZTogYW55ID0gbW9tZW50KCk7XG4gIEBJbnB1dCgpIGVuZERhdGU6IGFueTtcbiAgQElucHV0KCkgbWluRGF0ZTogYW55O1xuICBASW5wdXQoKSBtYXhEYXRlOiBhbnk7XG4gIEBPdXRwdXQoKSBlbWl0U2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgaW5wdXRWYWx1ZU91dHB1dDogc3RyaW5nO1xuICBpc09wZW46IGJvb2xlYW47XG4gIGxvY2FsZSA9ICdlbic7XG4gIG5hdkRhdGU6IGFueTtcbiAgd2Vla0RheXNIZWFkZXJBcnI6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgZ3JpZEFycjogYW55ID0ge307XG4gIHNlbGVjdGVkRGF0ZTogYW55O1xuICBjYW5BY2Nlc3NQcmV2aW91cyA9IHRydWU7XG4gIGNhbkFjY2Vzc05leHQgPSB0cnVlO1xuICB0b2RheURhdGUgPSBtb21lbnQoKS5zZXQoeyBob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMCwgbWlsbGlzZWNvbmQ6IDAgfSk7XG4gIHN0YXJ0RGF5OiBhbnk7XG4gIGVuZERheTogYW55O1xuICBtb2RlID0gJ2VuZCc7XG4gIGluaXRpYWxFbXB0eUNlbGxzOiBudW1iZXI7XG4gIGxhc3RFbXB0eUNlbGxzOiBudW1iZXI7XG4gIGFycmF5TGVuZ3RoOiBudW1iZXI7XG4gIGN1cnJlbnRNb250aDogbnVtYmVyO1xuICBjdXJyZW50WWVhcjogbnVtYmVyO1xuICBzZWxlY3RlZDogYW55O1xuICBzdGFydFRpbWU6IGFueTtcbiAgZW5kVGltZTogYW55O1xuICBpc0ludmFsaWQgPSBmYWxzZTtcbiAgaW5jbHVkZUVuZERhdGU6IGJvb2xlYW47XG4gIGluY2x1ZGVUaW1lOiBib29sZWFuO1xuICBmb3JtYXRJbnB1dERhdGUgPSAnRCBNTU0sIFlZWVknO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zZXRPcHRpb25zKCk7XG4gICAgbW9tZW50LmxvY2FsZSh0aGlzLmxvY2FsZSk7XG4gICAgaWYgKCF0aGlzLnN0YXJ0RGF0ZSkge1xuICAgICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoKTtcbiAgICB9XG4gICAgdGhpcy5uYXZEYXRlID0gbW9tZW50KCk7XG4gICAgdGhpcy5tYWtlSGVhZGVyKCk7XG4gICAgdGhpcy5jdXJyZW50TW9udGggPSB0aGlzLm5hdkRhdGUubW9udGgoKTtcbiAgICB0aGlzLmN1cnJlbnRZZWFyID0gdGhpcy5uYXZEYXRlLnllYXIoKTtcbiAgICB0aGlzLm1ha2VHcmlkKHRoaXMuY3VycmVudFllYXIsIHRoaXMuY3VycmVudE1vbnRoKTtcbiAgICB0aGlzLmNvbmNhdFZhbHVlSW5wdXQoKTtcbiAgfVxuXG4gIHNldE9wdGlvbnMoKSB7XG4gICAgdGhpcy5pbmNsdWRlRW5kRGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuaW5jbHVkZVRpbWUgPSBmYWxzZTtcbiAgfVxuXG4gIGNvbmNhdFZhbHVlSW5wdXQgPSAoKSA9PiB7XG4gICAgY29uc3QgY29uY2F0VmFsdWUgPSBbXG4gICAgICB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQodGhpcy5mb3JtYXRJbnB1dERhdGUpLFxuICAgICAgKHRoaXMuZW5kRGF0ZSkgPyAnICAtICAnIDogJycsXG4gICAgICAodGhpcy5lbmREYXRlKSA/IHRoaXMuZW5kRGF0ZS5mb3JtYXQodGhpcy5mb3JtYXRJbnB1dERhdGUpIDogJydcbiAgICBdO1xuICAgIHRoaXMuaW5wdXRWYWx1ZU91dHB1dCA9IGNvbmNhdFZhbHVlLmpvaW4oJycpO1xuXG4gIH07XG5cbiAgc2V0QWNjZXNzKCkge1xuICAgIHRoaXMuY2FuQWNjZXNzUHJldmlvdXMgPSB0aGlzLmNhbkNoYW5nZU5hdk1vbnRoKC0xKTtcbiAgICB0aGlzLmNhbkFjY2Vzc05leHQgPSB0aGlzLmNhbkNoYW5nZU5hdk1vbnRoKDEpO1xuICB9XG5cbiAgY2hhbmdlTmF2TW9udGgobnVtOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5jYW5DaGFuZ2VOYXZNb250aChudW0pKSB7XG4gICAgICB0aGlzLm5hdkRhdGUuYWRkKG51bSwgJ21vbnRoJyk7XG4gICAgICB0aGlzLmN1cnJlbnRNb250aCA9IHRoaXMubmF2RGF0ZS5tb250aCgpO1xuICAgICAgdGhpcy5jdXJyZW50WWVhciA9IHRoaXMubmF2RGF0ZS55ZWFyKCk7XG4gICAgICB0aGlzLm1ha2VHcmlkKHRoaXMuY3VycmVudFllYXIsIHRoaXMuY3VycmVudE1vbnRoKTtcbiAgICB9XG4gIH1cblxuICBjYW5DaGFuZ2VOYXZNb250aChudW06IG51bWJlcikge1xuICAgIGNvbnN0IGNsb25lZERhdGUgPSBtb21lbnQodGhpcy5uYXZEYXRlKTtcbiAgICByZXR1cm4gdGhpcy5jYW5DaGFuZ2VOYXZNb250aExvZ2ljKG51bSwgY2xvbmVkRGF0ZSk7XG4gIH1cblxuICBtYWtlSGVhZGVyKCkge1xuICAgIGNvbnN0IHdlZWtEYXlzQXJyOiBBcnJheTxudW1iZXI+ID0gWzAsIDEsIDIsIDMsIDQsIDUsIDZdO1xuICAgIHdlZWtEYXlzQXJyLmZvckVhY2goZGF5ID0+IHRoaXMud2Vla0RheXNIZWFkZXJBcnIucHVzaChtb21lbnQoKS53ZWVrZGF5KGRheSkuZm9ybWF0KCdkZGQnKSkpO1xuICB9XG5cbiAgZ2V0RGltZW5zaW9ucyhkYXRlOiBhbnkpIHtcbiAgICBjb25zdCBmaXJzdERheURhdGUgPSBtb21lbnQoZGF0ZSkuc3RhcnRPZignbW9udGgnKTtcbiAgICB0aGlzLmluaXRpYWxFbXB0eUNlbGxzID0gZmlyc3REYXlEYXRlLndlZWtkYXkoKTtcbiAgICBjb25zdCBsYXN0RGF5RGF0ZSA9IG1vbWVudChkYXRlKS5lbmRPZignbW9udGgnKTtcbiAgICB0aGlzLmxhc3RFbXB0eUNlbGxzID0gNiAtIGxhc3REYXlEYXRlLndlZWtkYXkoKTtcbiAgICB0aGlzLmFycmF5TGVuZ3RoID0gdGhpcy5pbml0aWFsRW1wdHlDZWxscyArIHRoaXMubGFzdEVtcHR5Q2VsbHMgKyBkYXRlLmRheXNJbk1vbnRoKCk7XG4gIH1cblxuICBtYWtlR3JpZCh5ZWFyLCBtb250aCkge1xuICAgIGlmICghdGhpcy5ncmlkQXJyLmhhc093blByb3BlcnR5KHllYXIpKSB7XG4gICAgICB0aGlzLmdyaWRBcnJbeWVhcl0gPSB7fTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmdyaWRBcnJbeWVhcl0uaGFzT3duUHJvcGVydHkobW9udGgpKSB7XG4gICAgICB0aGlzLmdyaWRBcnJbeWVhcl1bbW9udGhdID0gW107XG4gICAgICB0aGlzLmdldERpbWVuc2lvbnModGhpcy5uYXZEYXRlKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hcnJheUxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9iajogYW55ID0ge307XG4gICAgICAgIGlmIChpIDwgdGhpcy5pbml0aWFsRW1wdHlDZWxscyB8fCBpID4gdGhpcy5pbml0aWFsRW1wdHlDZWxscyArIHRoaXMubmF2RGF0ZS5kYXlzSW5Nb250aCgpIC0gMSkge1xuICAgICAgICAgIG9iai52YWx1ZSA9IDA7XG4gICAgICAgICAgb2JqLmF2YWlsYWJsZSA9IGZhbHNlO1xuICAgICAgICAgIG9iai5pc1RvZGF5ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2JqLnZhbHVlID0gaSAtIHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgKyAxO1xuICAgICAgICAgIG9iai5hdmFpbGFibGUgPSB0aGlzLmlzQXZhaWxhYmxlKGkgLSB0aGlzLmluaXRpYWxFbXB0eUNlbGxzICsgMSk7XG4gICAgICAgICAgb2JqLmlzVG9kYXkgPSB0aGlzLmlzVG9kYXkoaSAtIHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgKyAxLCBtb250aCwgeWVhcik7XG4gICAgICAgICAgb2JqLm1vbnRoID0gbW9udGg7XG4gICAgICAgICAgb2JqLmRhdGUgPSB0aGlzLm5hdkRhdGU7XG4gICAgICAgICAgb2JqLnllYXIgPSB5ZWFyO1xuICAgICAgICAgIG9iai5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgIGlmICh0aGlzLmRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKG9iai52YWx1ZSwgbW9udGgsIHllYXIpLmlzU2FtZSh0aGlzLnN0YXJ0RGF0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnREYXkgPSBvYmo7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKG9iai52YWx1ZSwgbW9udGgsIHllYXIpLmlzU2FtZSh0aGlzLmVuZERhdGUpKSB7XG4gICAgICAgICAgICB0aGlzLmVuZERheSA9IG9iajtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG9iai5pc1RvZGF5ICYmICF0aGlzLnN0YXJ0RGF5ICYmICF0aGlzLmVuZERheSkge1xuICAgICAgICAgICAgdGhpcy5zdGFydERheSA9IG9iajtcbiAgICAgICAgICAgIHRoaXMuZW5kRGF5ID0gb2JqO1xuICAgICAgICAgICAgb2JqLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb2JqLmluUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ncmlkQXJyW3llYXJdW21vbnRoXS5wdXNoKG9iaik7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2V0QWNjZXNzKCk7XG4gIH1cblxuICBpc0F2YWlsYWJsZShudW06IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGRhdGVUb0NoZWNrID0gdGhpcy5kYXRlRnJvbU51bShudW0sIHRoaXMubmF2RGF0ZSk7XG4gICAgcmV0dXJuIHRoaXMuaXNBdmFpbGFibGVMb2dpYyhkYXRlVG9DaGVjayk7XG4gIH1cblxuICBpc1RvZGF5KG51bTogbnVtYmVyLCBtb250aDogbnVtYmVyLCB5ZWFyOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCBkYXRlVG9DaGVjayA9IG1vbWVudCh0aGlzLmRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKG51bSwgbW9udGgsIHllYXIpKTtcbiAgICByZXR1cm4gZGF0ZVRvQ2hlY2suaXNTYW1lKG1vbWVudCgpLnNldCh7IGhvdXI6IDAsIG1pbnV0ZTogMCwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KSk7XG4gIH1cblxuICBkYXRlRnJvbU51bShudW06IG51bWJlciwgcmVmZXJlbmNlRGF0ZTogYW55KTogYW55IHtcbiAgICBjb25zdCByZXR1cm5EYXRlID0gbW9tZW50KHJlZmVyZW5jZURhdGUpO1xuICAgIHJldHVybiByZXR1cm5EYXRlLmRhdGUobnVtKTtcbiAgfVxuXG4gIHJlRm9ybWF0SW5wdXQgPSAoKSA9PiB7XG4gICAgdGhpcy5jb25jYXRWYWx1ZUlucHV0KCk7XG4gICAgdGhpcy5mb3JtYXRJbnB1dERhdGUgPSAodGhpcy5pbmNsdWRlVGltZSkgPyAnRCBNTU0sIFlZWVkgaDptbSBBJyA6ICdEIE1NTSwgWVlZWSc7XG4gIH07XG5cbiAgc2VsZWN0RGF5KGRheTogYW55KSB7XG4gICAgaWYgKGRheS5hdmFpbGFibGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXRlID0gdGhpcy5kYXRlRnJvbURheUFuZE1vbnRoQW5kWWVhcihkYXkudmFsdWUsIGRheS5tb250aCwgZGF5LnllYXIpO1xuICAgICAgaWYgKHRoaXMuaW5jbHVkZUVuZERhdGUpIHtcbiAgICAgICAgY29uc3QgY3VyckRhdGUgPSB0aGlzLmRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKGRheS52YWx1ZSwgZGF5Lm1vbnRoLCBkYXkueWVhcik7XG4gICAgICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgIGlmIChjdXJyRGF0ZS5pc1NhbWUobW9tZW50KHRoaXMuc3RhcnREYXRlKS5zdGFydE9mKCdkYXknKSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5tb2RlID0gJ3N0YXJ0JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyckRhdGUuaXNTYW1lT3JCZWZvcmUodGhpcy5zdGFydERhdGUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuZW5kRGF5ID0gdGhpcy5zdGFydERheTtcbiAgICAgICAgICAgICAgdGhpcy5zdGFydERheSA9IGRheTtcbiAgICAgICAgICAgICAgdGhpcy5tb2RlID0gJ3N0YXJ0JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuZW5kRGF5ID0gZGF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc3RhcnQnOlxuICAgICAgICAgICAgaWYgKGN1cnJEYXRlLmlzU2FtZShtb21lbnQodGhpcy5lbmREYXRlKS5zdGFydE9mKCdkYXknKSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5tb2RlID0gJ2VuZCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJEYXRlLmlzU2FtZU9yQWZ0ZXIodGhpcy5lbmREYXRlKSkge1xuICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF5ID0gdGhpcy5lbmREYXk7XG4gICAgICAgICAgICAgIHRoaXMuZW5kRGF5ID0gZGF5O1xuICAgICAgICAgICAgICB0aGlzLm1vZGUgPSAnZW5kJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhcnREYXkgPSBkYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuZ2VuZXJhdGVEYXRlKHRoaXMuc3RhcnREYXksIHRoaXMuc3RhcnREYXRlKTtcbiAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5nZW5lcmF0ZURhdGUodGhpcy5lbmREYXksIHRoaXMuZW5kRGF0ZSk7XG4gICAgICAgIHRoaXMuYXBwbHlSYW5nZSgpO1xuICAgICAgICB0aGlzLnN0YXJ0RGF5LmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbmREYXkuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0ge1xuICAgICAgICAgIHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsXG4gICAgICAgICAgZW5kRGF0ZTogdGhpcy5lbmREYXRlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc2V0QWN0aXZpdHkoKTtcbiAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLnNlbGVjdGVkRGF0ZTtcbiAgICAgICAgdGhpcy5zdGFydERheSA9IGRheTtcbiAgICAgICAgdGhpcy5zdGFydERheS5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB7XG4gICAgICAgICAgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVtaXRTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3RhcnREYXRlICYmIHRoaXMuZW5kRGF0ZSkge1xuICAgICAgICB0aGlzLmVtaXRTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWQpO1xuICAgICAgfVxuICAgICAgdGhpcy5yZUZvcm1hdElucHV0KCk7XG4gICAgfVxuICB9XG5cbiAgZ2VuZXJhdGVEYXRlKGRheTogYW55LCBkYXRlOiBhbnkpIHtcbiAgICBsZXQgZ2VuZXJhdGVkRGF0ZSA9IHRoaXMuZGF0ZUZyb21EYXlBbmRNb250aEFuZFllYXIoZGF5LnZhbHVlLCBkYXkubW9udGgsIGRheS55ZWFyKTtcbiAgICBpZiAoZGF0ZSkge1xuICAgICAgZ2VuZXJhdGVkRGF0ZSA9IGdlbmVyYXRlZERhdGUuc2V0KHsgaG91cjogZGF0ZS5ob3VyKCksIG1pbnV0ZTogZGF0ZS5taW51dGUoKSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGdlbmVyYXRlZERhdGU7XG4gIH1cblxuICByZXNldFJhbmdlKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZ3JpZEFycikuZm9yRWFjaCh5ZWFyID0+IHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZ3JpZEFyclt5ZWFyXSkuZm9yRWFjaChtb250aCA9PiB7XG4gICAgICAgIHRoaXMuZ3JpZEFyclt5ZWFyXVttb250aF0ubWFwKGRheSA9PiB7XG4gICAgICAgICAgZGF5LmluUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICBkYXkuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlc2V0QWN0aXZpdHkoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5ncmlkQXJyKS5mb3JFYWNoKHllYXIgPT4ge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5ncmlkQXJyW3llYXJdKS5mb3JFYWNoKG1vbnRoID0+IHtcbiAgICAgICAgdGhpcy5ncmlkQXJyW3llYXJdW21vbnRoXS5tYXAoZGF5ID0+IHtcbiAgICAgICAgICBkYXkuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGRhdGVGcm9tRGF5QW5kTW9udGhBbmRZZWFyKGRheSwgbW9udGgsIHllYXIpIHtcbiAgICBsZXQgdGltZU9iamVjdCA9IHsgaG91cjogMCwgbWludXRlOiAwLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH07XG4gICAgaWYgKHRoaXMuaW5jbHVkZVRpbWUpIHtcbiAgICAgIHRpbWVPYmplY3QgPSB7IGhvdXI6IHRoaXMuc3RhcnREYXRlLmhvdXIoKSwgbWludXRlOiB0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9O1xuICAgICAgdGhpcy5zdGFydERhdGUuZm9ybWF0KCdoOm1tIEEnKTtcbiAgICB9XG4gICAgcmV0dXJuIG1vbWVudChbeWVhciwgbW9udGgsIGRheV0pLnNldCh0aW1lT2JqZWN0KTtcbiAgfVxuXG4gIGFwcGx5UmFuZ2UoKSB7XG4gICAgdGhpcy5nZXREaW1lbnNpb25zKHRoaXMuc3RhcnREYXRlKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuaW5pdGlhbEVtcHR5Q2VsbHMgKyB0aGlzLnN0YXJ0RGF5LnZhbHVlIC0gMTtcbiAgICBjb25zdCBzdGFydE1vbnRoTGVuZ3RoID0gdGhpcy5hcnJheUxlbmd0aDtcbiAgICB0aGlzLmdldERpbWVuc2lvbnModGhpcy5lbmREYXRlKTtcbiAgICBjb25zdCBlbmRNb250aExlbmd0aCA9IHRoaXMuYXJyYXlMZW5ndGg7XG4gICAgY29uc3QgZW5kID0gdGhpcy5pbml0aWFsRW1wdHlDZWxscyArIHRoaXMuZW5kRGF5LnZhbHVlIC0gMTtcbiAgICB0aGlzLnJlc2V0UmFuZ2UoKTtcbiAgICBpZiAodGhpcy5zdGFydERheS5tb250aCAhPT0gdGhpcy5lbmREYXkubW9udGggfHwgdGhpcy5zdGFydERheS55ZWFyICE9PSB0aGlzLmVuZERheS55ZWFyKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmdyaWRBcnIpLmZvckVhY2goeWVhciA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGVuZGFyID0gdGhpcy5ncmlkQXJyW3llYXJdO1xuICAgICAgICBPYmplY3Qua2V5cyhjYWxlbmRhcikuZm9yRWFjaChtb250aCA9PiB7XG4gICAgICAgICAgY29uc3QgZGF5cyA9IHRoaXMuZ3JpZEFyclt5ZWFyXVttb250aF07XG4gICAgICAgICAgaWYgKG1vbnRoID09IHRoaXMuc3RhcnREYXkubW9udGggJiYgeWVhciA9PSB0aGlzLnN0YXJ0RGF5LnllYXIpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhcnQ7IGkrKykge1xuICAgICAgICAgICAgICBkYXlzW2ldLmluUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IHN0YXJ0TW9udGhMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBkYXlzW2ldLmluUmFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAobW9udGggPT0gdGhpcy5lbmREYXkubW9udGggJiYgeWVhciA9PSB0aGlzLmVuZERheS55ZWFyKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICAgICAgICBkYXlzW2ldLmluUmFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGVuZCArIDE7IGkgPCBlbmRNb250aExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGRheXNbaV0uaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoKG1vbnRoID4gdGhpcy5zdGFydERheS5tb250aCB8fCB5ZWFyID4gdGhpcy5zdGFydERheS55ZWFyKSAmJiAobW9udGggPCB0aGlzLmVuZERheS5tb250aCB8fCB5ZWFyIDwgdGhpcy5lbmREYXkueWVhcikpIHtcbiAgICAgICAgICAgIGRheXMuZm9yRWFjaChkYXkgPT4gZGF5LmluUmFuZ2UgPSB0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1vbnRoID0gdGhpcy5zdGFydERheS5tb250aDtcbiAgICAgIGNvbnN0IHllYXIgPSB0aGlzLnN0YXJ0RGF5LnllYXI7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJ0OyBpKyspIHtcbiAgICAgICAgdGhpcy5ncmlkQXJyW3llYXJdW21vbnRoXVtpXS5pblJhbmdlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHtcbiAgICAgICAgdGhpcy5ncmlkQXJyW3llYXJdW21vbnRoXVtpXS5pblJhbmdlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSBlbmQgKyAxOyBpIDwgdGhpcy5hcnJheUxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZ3JpZEFyclt5ZWFyXVttb250aF1baV0uaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlzQXZhaWxhYmxlTG9naWMoZGF0ZVRvQ2hlY2s6IGFueSkge1xuICAgIGlmICh0aGlzLm1pbkRhdGUgfHwgdGhpcy5tYXhEYXRlKSB7XG4gICAgICByZXR1cm4gIShkYXRlVG9DaGVjay5pc0JlZm9yZSh0aGlzLm1pbkRhdGUpIHx8IGRhdGVUb0NoZWNrLmlzQWZ0ZXIodGhpcy5tYXhEYXRlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAhZGF0ZVRvQ2hlY2suaXNCZWZvcmUobW9tZW50KCksICdkYXknKTtcbiAgICB9XG4gIH1cblxuICBjYW5DaGFuZ2VOYXZNb250aExvZ2ljKG51bSwgY3VycmVudERhdGUpIHtcbiAgICBjdXJyZW50RGF0ZS5hZGQobnVtLCAnbW9udGgnKTtcbiAgICBjb25zdCBtaW5EYXRlID0gdGhpcy5taW5EYXRlID8gdGhpcy5taW5EYXRlIDogbW9tZW50KCkuYWRkKC0xLCAnbW9udGgnKTtcbiAgICBjb25zdCBtYXhEYXRlID0gdGhpcy5tYXhEYXRlID8gdGhpcy5tYXhEYXRlIDogbW9tZW50KCkuYWRkKDEsICd5ZWFyJyk7XG4gICAgcmV0dXJuIGN1cnJlbnREYXRlLmlzQmV0d2VlbihtaW5EYXRlLCBtYXhEYXRlKTtcbiAgfVxuXG4gIHRvZ2dsZUNhbGVuZGFyKCk6IGFueSB7XG4gICAgdGhpcy5pc09wZW4gPSAhdGhpcy5pc09wZW47XG4gIH1cblxuICBvcGVuQ2FsZW5kYXIoKTogYW55IHtcbiAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gIH1cblxuICBjbG9zZUNhbGVuZGFyKCk6IGFueSB7XG4gICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgfVxuXG4gIGNoYW5nZU1vZGUobW9kZTogc3RyaW5nKSB7XG4gICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucmVzZXRSYW5nZSgpO1xuICAgIHRoaXMuc3RhcnREYXRlID0gbW9tZW50KCk7XG4gICAgdGhpcy5lbmREYXRlID0gbnVsbDtcbiAgICB0aGlzLm5hdkRhdGUgPSB0aGlzLnRvZGF5RGF0ZTtcbiAgICB0aGlzLmN1cnJlbnRNb250aCA9IHRoaXMubmF2RGF0ZS5tb250aCgpO1xuICAgIHRoaXMuY3VycmVudFllYXIgPSB0aGlzLm5hdkRhdGUueWVhcigpO1xuICAgIHRoaXMuaW5jbHVkZUVuZERhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmluY2x1ZGVUaW1lID0gZmFsc2U7XG4gICAgdGhpcy5zdGFydFRpbWUgPSBudWxsO1xuICAgIHRoaXMuZW5kVGltZSA9IG51bGw7XG4gICAgdGhpcy5tb2RlID0gJ3N0YXJ0JztcbiAgICB0aGlzLm1ha2VHcmlkKHRoaXMuY3VycmVudFllYXIsIHRoaXMuY3VycmVudE1vbnRoKTtcbiAgfVxuXG4gIHNldFRpbWUobW9tZW50LCBob3VyOiBudW1iZXIgPSAwLCBtaW51dGU6IG51bWJlciA9IDApIHtcbiAgICByZXR1cm4gbW9tZW50LnNldCh7IGhvdXIsIG1pbnV0ZSwgc2Vjb25kOiAwLCBtaWxsaXNlY29uZDogMCB9KTtcbiAgfVxuXG4gIGhhbmRsZU1vZGVDaGFuZ2UoKSB7XG4gICAgdGhpcy5yZXNldFJhbmdlKCk7XG4gICAgdGhpcy5tb2RlID0gJ2VuZCc7XG4gICAgaWYgKHRoaXMuc3RhcnREYXkpIHtcbiAgICAgIHRoaXMuc3RhcnREYXkuaXNBY3RpdmUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaW5jbHVkZUVuZERhdGUpIHtcbiAgICAgIHRoaXMuZW5kRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLm1vZGUgPSAnc3RhcnQnO1xuICAgICAgdGhpcy5zdGFydERheS5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5lbmREYXkuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdG1wU3RhcnREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcbiAgICAgIGNvbnN0IG5leHREYXkgPSB0bXBTdGFydERhdGUuYWRkKDIsICdkYXlzJykuZm9ybWF0KGBZWVlZLSR7dG1wU3RhcnREYXRlLmZvcm1hdCgnTScpIC0gMX0tRGApO1xuICAgICAgdGhpcy5zaW11bGF0ZUNsaWNrKG5leHREYXkpO1xuICAgIH1cblxuICB9XG5cbiAgc2ltdWxhdGVDbGljayA9IChkYXRlOiBzdHJpbmcpID0+IHtcbiAgICB0cnkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGdldERheU5leHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuY2FsZW5kYXItZGF5LW5vdC1yYW5nZS0ke2RhdGV9ID4gYnV0dG9uYCkgYXMgYW55O1xuICAgICAgICBpZiAoZ2V0RGF5TmV4dCkge1xuICAgICAgICAgIGdldERheU5leHQuY2xpY2soKTtcbiAgICAgICAgfVxuICAgICAgfSwgNTApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcblxuICBzZXRTdGFydFRpbWUodGltZSkge1xuICAgIHRoaXMuc3RhcnRUaW1lID0gdGltZTtcbiAgfVxuXG4gIHNldEVuZFRpbWUodGltZSkge1xuICAgIHRoaXMuZW5kVGltZSA9IHRpbWU7XG4gIH1cblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tc2hhZG93ZWQtdmFyaWFibGVcbiAgaGFuZGxlVGltZUNoYW5nZSh0aW1lOiBhbnksIG1vbWVudDogYW55LCBtb2RlOiBzdHJpbmcpIHtcbiAgICB0aGlzLnJlRm9ybWF0SW5wdXQoKTtcbiAgICBpZiAoIXRpbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGltZSA9IHRpbWUucmVwbGFjZSgvW15hLXpBLVowLTldL2csICcnKTtcbiAgICBtb21lbnQuc2V0KHsgaG91cjogMCwgbWludXRlOiAwLCBzZWNvbmQ6IDAsIG1pbGxpc2Vjb25kOiAwIH0pO1xuICAgIGxldCBsYXN0VHdvID0gdGltZS5zdWJzdHIodGltZS5sZW5ndGggLSAyKS50b1VwcGVyQ2FzZSgpO1xuICAgIGxldCBsYXN0ID0gdGltZS5zdWJzdHIodGltZS5sZW5ndGggLSAxKS50b1VwcGVyQ2FzZSgpO1xuICAgIGNvbnN0IGhhc0xhc3RUd28gPSBbJ0FNJywgJ1BNJ10uaW5jbHVkZXMobGFzdFR3byk7XG4gICAgY29uc3QgaGFzTGFzdCA9IFsnQScsICdQJ10uaW5jbHVkZXMobGFzdCk7XG4gICAgbGV0IGlzQW0gPSB0cnVlO1xuICAgIGxldCBpc1BtID0gZmFsc2U7XG4gICAgaWYgKGhhc0xhc3QgfHwgaGFzTGFzdFR3bykge1xuICAgICAgaXNBbSA9IGxhc3QgPT09ICdBJyB8fCBsYXN0VHdvID09PSAnQU0nO1xuICAgICAgaXNQbSA9IGxhc3QgPT09ICdQJyB8fCBsYXN0VHdvID09PSAnUE0nO1xuICAgIH1cbiAgICB0aW1lID0gdGltZS5yZXBsYWNlKC9bXjAtOV0vZywgJycpO1xuICAgIGxhc3RUd28gPSB0aW1lLnN1YnN0cih0aW1lLmxlbmd0aCAtIDIpO1xuICAgIGxhc3QgPSB0aW1lLnN1YnN0cih0aW1lLmxlbmd0aCAtIDEpO1xuICAgIHRpbWUgPSB0aW1lLnN1YnN0cigwLCA0KTtcbiAgICB0aGlzLmlzSW52YWxpZCA9IGZhbHNlO1xuICAgIHN3aXRjaCAodGltZS5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbW9tZW50XG4gICAgICAgICAgPSBpc0FtID8gdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWUpKSA6XG4gICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZSkgKyAxMik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBpZiAobGFzdCA+PSA2KSB7XG4gICAgICAgICAgdGhpcy5pc0ludmFsaWQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aW1lID09PSAxMikge1xuICAgICAgICAgIG1vbWVudFxuICAgICAgICAgICAgPSBpc0FtID8gdGhpcy5zZXRUaW1lKG1vbWVudCwgMCkgOlxuICAgICAgICAgICAgICB0aGlzLnNldFRpbWUobW9tZW50LCAxMik7XG4gICAgICAgIH0gZWxzZSBpZiAodGltZSA8IDEyKSB7XG4gICAgICAgICAgbW9tZW50XG4gICAgICAgICAgICA9IGlzQW0gPyB0aGlzLnNldFRpbWUobW9tZW50LCBOdW1iZXIodGltZSkpIDpcbiAgICAgICAgICAgICAgdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWUpICsgMTIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vbWVudFxuICAgICAgICAgICAgPSBpc0FtID8gdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWVbMF0pLCBOdW1iZXIobGFzdCkpIDpcbiAgICAgICAgICAgICAgdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWVbMF0pICsgMTIsIE51bWJlcihsYXN0KSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGlmIChsYXN0VHdvID49IDYwKSB7XG4gICAgICAgICAgdGhpcy5pc0ludmFsaWQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vbWVudFxuICAgICAgICAgICAgPSBpc0FtID8gdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWVbMF0pLCBOdW1iZXIobGFzdFR3bykpIDpcbiAgICAgICAgICAgICAgdGhpcy5zZXRUaW1lKG1vbWVudCwgTnVtYmVyKHRpbWVbMF0pICsgMTIsIE51bWJlcihsYXN0VHdvKSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQ6XG4gICAgICAgIGlmIChsYXN0VHdvID49IDYwKSB7XG4gICAgICAgICAgdGhpcy5pc0ludmFsaWQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG1vbWVudCA9IHRoaXMuc2V0VGltZShtb21lbnQsIE51bWJlcih0aW1lLnN1YnN0cigwLCAyKSksIE51bWJlcihsYXN0VHdvKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5pc0ludmFsaWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKG1vZGUgPT09ICdzdGFydCcpIHtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gbW9tZW50O1xuICAgICAgdGhpcy5zdGFydFRpbWVQaWNrZXIubmF0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW5kRGF0ZSA9IG1vbWVudDtcbiAgICAgIHRoaXMuZW5kVGltZVBpY2tlci5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB9XG4gIH1cblxufVxuIl19