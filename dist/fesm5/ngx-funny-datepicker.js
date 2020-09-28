import { Injectable, ɵɵdefineInjectable, EventEmitter, Component, Output, ViewChild, Input, Directive, ElementRef, HostListener, NgModule } from '@angular/core';
import * as moment_ from 'moment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NgxFunnyDatepickerService = /** @class */ (function () {
    function NgxFunnyDatepickerService() {
    }
    NgxFunnyDatepickerService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    NgxFunnyDatepickerService.ctorParameters = function () { return []; };
    /** @nocollapse */ NgxFunnyDatepickerService.ngInjectableDef = ɵɵdefineInjectable({ factory: function NgxFunnyDatepickerService_Factory() { return new NgxFunnyDatepickerService(); }, token: NgxFunnyDatepickerService, providedIn: "root" });
    return NgxFunnyDatepickerService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NgxFunnyDatepickerComponent = /** @class */ (function () {
    function NgxFunnyDatepickerComponent() {
        var _this = this;
        this.valueDate = new EventEmitter();
        this.isRange = true;
        this.hasTime = true;
        this.emitValue = (/**
         * @param {?} data
         * @return {?}
         */
        function (data) { return _this.valueDate.emit(data); });
    }
    /**
     * @return {?}
     */
    NgxFunnyDatepickerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    NgxFunnyDatepickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-funny-datepicker',
                    template: "\n    <funny-datepicker-single\n      [isRange]=\"isRange\"\n      [hasTime]=\"hasTime\"\n      [startDate]=\"startDate\"\n      [endDate]=\"endDate\"\n      [maxDate]=\"maxDate\"\n      [minDate]=\"minDate\"\n      (emitSelected)=\"emitValue($event)\"\n    ></funny-datepicker-single>\n\n  "
                }] }
    ];
    /** @nocollapse */
    NgxFunnyDatepickerComponent.ctorParameters = function () { return []; };
    NgxFunnyDatepickerComponent.propDecorators = {
        valueDate: [{ type: Output }]
    };
    return NgxFunnyDatepickerComponent;
}());
if (false) {
    /** @type {?} */
    NgxFunnyDatepickerComponent.prototype.valueDate;
    /** @type {?} */
    NgxFunnyDatepickerComponent.prototype.isRange;
    /** @type {?} */
    NgxFunnyDatepickerComponent.prototype.hasTime;
    /** @type {?} */
    NgxFunnyDatepickerComponent.prototype.startDate;
    /** @type {?} */
    NgxFunnyDatepickerComponent.prototype.endDate;
    /** @type {?} */
    NgxFunnyDatepickerComponent.prototype.maxDate;
    /** @type {?} */
    NgxFunnyDatepickerComponent.prototype.minDate;
    /** @type {?} */
    NgxFunnyDatepickerComponent.prototype.emitValue;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var OutSideDirective = /** @class */ (function () {
    function OutSideDirective(elementRef) {
        this.elementRef = elementRef;
        this.clickOutside = new EventEmitter();
    }
    /**
     * @param {?} target
     * @return {?}
     */
    OutSideDirective.prototype.onClick = /**
     * @param {?} target
     * @return {?}
     */
    function (target) {
        /** @type {?} */
        var classElement = target.classList || [];
        if (!Array.from(classElement).includes('omit-trigger-outside')) {
            /** @type {?} */
            var clickedInside = this.elementRef.nativeElement.contains(target);
            if (!clickedInside) {
                this.clickOutside.emit();
            }
        }
    };
    OutSideDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[clickOutside]'
                },] }
    ];
    /** @nocollapse */
    OutSideDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    OutSideDirective.propDecorators = {
        clickOutside: [{ type: Output }],
        onClick: [{ type: HostListener, args: ['document:click', ['$event.target'],] }]
    };
    return OutSideDirective;
}());
if (false) {
    /** @type {?} */
    OutSideDirective.prototype.clickOutside;
    /**
     * @type {?}
     * @private
     */
    OutSideDirective.prototype.elementRef;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NgxFunnyDatepickerModule = /** @class */ (function () {
    function NgxFunnyDatepickerModule() {
    }
    NgxFunnyDatepickerModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [NgxFunnyDatepickerComponent, DatepickerComponent, OutSideDirective],
                    imports: [
                        CommonModule,
                        FormsModule
                    ],
                    exports: [NgxFunnyDatepickerComponent]
                },] }
    ];
    return NgxFunnyDatepickerModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NgxFunnyDatepickerComponent, NgxFunnyDatepickerModule, NgxFunnyDatepickerService, DatepickerComponent as ɵa, OutSideDirective as ɵb };
//# sourceMappingURL=ngx-funny-datepicker.js.map
