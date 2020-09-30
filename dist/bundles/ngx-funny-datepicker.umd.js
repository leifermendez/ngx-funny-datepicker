(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('moment'), require('@angular/forms'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('ngx-funny-datepicker', ['exports', '@angular/core', 'moment', '@angular/forms', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ngx-funny-datepicker'] = {}, global.ng.core, global.moment$1, global.ng.forms, global.ng.common));
}(this, (function (exports, i0, moment$1, forms, common) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) { return e; } else {
            var n = Object.create(null);
            if (e) {
                Object.keys(e).forEach(function (k) {
                    if (k !== 'default') {
                        var d = Object.getOwnPropertyDescriptor(e, k);
                        Object.defineProperty(n, k, d.get ? d : {
                            enumerable: true,
                            get: function () {
                                return e[k];
                            }
                        });
                    }
                });
            }
            n['default'] = e;
            return Object.freeze(n);
        }
    }

    var moment__namespace = /*#__PURE__*/_interopNamespace(moment$1);

    var NgxFunnyDatepickerService = /** @class */ (function () {
        function NgxFunnyDatepickerService() {
        }
        return NgxFunnyDatepickerService;
    }());
    NgxFunnyDatepickerService.ɵprov = i0.ɵɵdefineInjectable({ factory: function NgxFunnyDatepickerService_Factory() { return new NgxFunnyDatepickerService(); }, token: NgxFunnyDatepickerService, providedIn: "root" });
    NgxFunnyDatepickerService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    NgxFunnyDatepickerService.ctorParameters = function () { return []; };

    var NgxFunnyDatepickerComponent = /** @class */ (function () {
        function NgxFunnyDatepickerComponent() {
            var _this = this;
            this.valueDate = new i0.EventEmitter();
            this.startDate = moment__namespace();
            this.locale = 'en';
            this.rangeLabel = 'Range';
            this.timeLabel = 'Time';
            this.clearLabel = 'Clear';
            this.emitValue = function (data) { return _this.valueDate.emit(data); };
        }
        NgxFunnyDatepickerComponent.prototype.ngOnInit = function () {
        };
        return NgxFunnyDatepickerComponent;
    }());
    NgxFunnyDatepickerComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'ngx-funny-datepicker-dummy',
                    template: "\n    Please use ngx-funny-datepicker\n  "
                },] }
    ];
    NgxFunnyDatepickerComponent.ctorParameters = function () { return []; };
    NgxFunnyDatepickerComponent.propDecorators = {
        valueDate: [{ type: i0.Output }],
        isRange: [{ type: i0.Input }],
        hasTime: [{ type: i0.Input }],
        startDate: [{ type: i0.Input }],
        endDate: [{ type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        locale: [{ type: i0.Input }],
        rangeLabel: [{ type: i0.Input }],
        timeLabel: [{ type: i0.Input }],
        clearLabel: [{ type: i0.Input }],
        classInput: [{ type: i0.Input }]
    };

    // tslint:disable-next-line: radix
    var moment = moment__namespace;
    var DatepickerComponent = /** @class */ (function () {
        function DatepickerComponent(renderer) {
            var _this = this;
            this.renderer = renderer;
            this.value = '';
            this.locale = 'en';
            this.rangeLabel = 'Range';
            this.timeLabel = 'Time';
            this.clearLabel = 'Clear';
            this.emitSelected = new i0.EventEmitter();
            this.weekDaysHeaderArr = [];
            this.gridArr = {};
            this.canAccessPrevious = true;
            this.canAccessNext = true;
            this.todayDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            this.renderedFlag = true;
            this.mode = 'end';
            this.isInvalid = false;
            this.formatInputDate = 'D MMM, YYYY';
            this.onChange = function (_) { };
            this.onTouch = function () {
                _this.onTouched = true;
            };
            /**
             * Concat values date to string format for show in input
             */
            this.concatValueInput = function () {
                var concatValue = [
                    _this.startDate.format(_this.formatInputDate),
                    (_this.endDate) ? '  -  ' : '',
                    (_this.endDate) ? _this.endDate.format(_this.formatInputDate) : ''
                ];
                _this.value = concatValue.join('');
                _this.isInvalid = !(_this.value.length);
            };
            this.generateAllYear = function () {
                _this.currentYear = _this.navDate.year();
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(function (a) {
                    _this.navDate = moment(_this.navDate.year() + "-" + a + "-" + _this.navDate.days(), 'YYYY-M-DD');
                    _this.makeGrid(_this.currentYear, a);
                });
            };
            this.reFormatInput = function () {
                _this.concatValueInput();
                _this.formatInputDate = (_this.includeTime) ? 'D MMM, YYYY h:mm A' : 'D MMM, YYYY';
            };
            this.simulateClicks = function () {
                if (_this.startDate && !_this.endDate) {
                    var tmpStartDate = _this.startDate.clone();
                    var nextDay = tmpStartDate.format("YYYY-" + (tmpStartDate.format('M') - 1) + "-D");
                    _this.simulateClick(nextDay, 'calendar-day-range');
                }
                if (_this.startDate && _this.endDate) {
                    var tmpEndDate = _this.endDate.clone();
                    var nextDayEnd = tmpEndDate.format("YYYY-" + (tmpEndDate.format('M') - 1) + "-D");
                    _this.simulateClick(nextDayEnd, 'calendar-day-not-range', true);
                    _this.changeNavMonth(tmpEndDate.format('M'), 'fix');
                }
            };
            this.simulateClick = function (date, mode, infinity) {
                if (mode === void 0) { mode = 'calendar-day-range'; }
                if (infinity === void 0) { infinity = false; }
                try {
                    setTimeout(function () {
                        var getDayNext = document.querySelector("." + mode + "-" + date + " > button");
                        if (getDayNext) {
                            getDayNext.click();
                        }
                        if (!getDayNext && infinity) {
                            var endDate = _this.endDate.clone();
                            var obj = {
                                available: true,
                                inRange: true,
                                isActive: false,
                                date: _this.navDate,
                                isToday: false,
                                month: parseInt(endDate.format('M')) - 1,
                                value: parseInt(endDate.format('D')),
                                year: parseInt(endDate.format('YYYY'))
                            };
                            _this.selectDay(obj);
                            var tmpGrid = _this.gridArr;
                            _this.gridArr = false;
                            _this.gridArr = tmpGrid;
                            var startDate = _this.startDate.clone();
                            var nextDay = startDate.format("YYYY-" + (startDate.format('M') - 1) + "-D");
                            var getFixClick = document.querySelector(".calendar-day-not-range-" + nextDay + " > button");
                            // getFixClick.click();
                        }
                    }, 1);
                }
                catch (e) {
                    return null;
                }
            };
        }
        DatepickerComponent.prototype.ngOnInit = function () {
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
        };
        /**
         *
         * controlValueAccessor
         */
        DatepickerComponent.prototype.onInput = function (value) {
            this.value = value;
            this.onTouch();
            this.onChange(this.value);
        };
        DatepickerComponent.prototype.writeValue = function (value) {
            if (value) {
                this.value = value || '';
            }
            else {
                this.value = '';
            }
        };
        DatepickerComponent.prototype.registerOnChange = function (fn) {
            this.onChange = fn;
        };
        DatepickerComponent.prototype.registerOnTouched = function (fn) {
            this.onTouch = fn;
        };
        DatepickerComponent.prototype.setDisabledState = function (isDisabled) {
            this.isDisabled = isDisabled;
        };
        /**
         *
         * @param value
         */
        DatepickerComponent.prototype.setOptions = function () {
            moment.locale(this.locale);
            this.includeEndDate = false;
            this.includeTime = false;
        };
        DatepickerComponent.prototype.setAccess = function () {
            this.canAccessPrevious = this.canChangeNavMonth(-1);
            this.canAccessNext = this.canChangeNavMonth(1);
        };
        DatepickerComponent.prototype.changeNavMonth = function (num, mode) {
            if (mode === void 0) { mode = 'next'; }
            if (this.canChangeNavMonth(num)) {
                if (mode === 'next') {
                    this.navDate.add(num, 'month');
                }
                else {
                    console.log(num);
                    this.navDate = moment(this.navDate.year() + "-" + num + "-" + this.navDate.days(), 'YYYY-MM-DD');
                }
                this.currentMonth = this.navDate.month();
                this.currentYear = this.navDate.year();
                this.makeGrid(this.currentYear, this.currentMonth);
            }
        };
        DatepickerComponent.prototype.canChangeNavMonth = function (num) {
            var clonedDate = moment(this.navDate);
            return this.canChangeNavMonthLogic(num, clonedDate);
        };
        DatepickerComponent.prototype.makeHeader = function () {
            var _this = this;
            var weekDaysArr = [0, 1, 2, 3, 4, 5, 6];
            weekDaysArr.forEach(function (day) { return _this.weekDaysHeaderArr.push(moment().weekday(day).format('ddd')); });
        };
        DatepickerComponent.prototype.getDimensions = function (date) {
            var firstDayDate = moment(date).startOf('month');
            this.initialEmptyCells = firstDayDate.weekday();
            var lastDayDate = moment(date).endOf('month');
            this.lastEmptyCells = 6 - lastDayDate.weekday();
            this.arrayLength = this.initialEmptyCells + this.lastEmptyCells + date.daysInMonth();
        };
        DatepickerComponent.prototype.makeGrid = function (year, month) {
            console.log(month, year);
            if (!this.gridArr.hasOwnProperty(year)) {
                this.gridArr[year] = {};
            }
            if (!this.gridArr[year].hasOwnProperty(month)) {
                this.gridArr[year][month] = [];
                this.getDimensions(this.navDate);
                for (var i = 0; i < this.arrayLength; i++) {
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
        DatepickerComponent.prototype.isAvailable = function (num) {
            var dateToCheck = this.dateFromNum(num, this.navDate);
            return this.isAvailableLogic(dateToCheck);
        };
        DatepickerComponent.prototype.isToday = function (num, month, year) {
            var dateToCheck = moment(this.dateFromDayAndMonthAndYear(num, month, year));
            return dateToCheck.isSame(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }));
        };
        DatepickerComponent.prototype.dateFromNum = function (num, referenceDate) {
            var returnDate = moment(referenceDate);
            return returnDate.date(num);
        };
        DatepickerComponent.prototype.selectDay = function (day) {
            if (day.available) {
                this.selectedDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
                if (this.includeEndDate) {
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
        DatepickerComponent.prototype.generateDate = function (day, date) {
            console.log(day);
            var generatedDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
            if (date) {
                generatedDate = generatedDate.set({ hour: date.hour(), minute: date.minute() });
            }
            return generatedDate;
        };
        DatepickerComponent.prototype.resetRange = function () {
            var _this = this;
            Object.keys(this.gridArr).forEach(function (year) {
                Object.keys(_this.gridArr[year]).forEach(function (month) {
                    _this.gridArr[year][month].map(function (day) {
                        day.inRange = false;
                        day.isActive = false;
                    });
                });
            });
        };
        DatepickerComponent.prototype.resetActivity = function () {
            var _this = this;
            Object.keys(this.gridArr).forEach(function (year) {
                Object.keys(_this.gridArr[year]).forEach(function (month) {
                    _this.gridArr[year][month].map(function (day) {
                        day.isActive = false;
                    });
                });
            });
        };
        DatepickerComponent.prototype.dateFromDayAndMonthAndYear = function (day, month, year) {
            var timeObject = { hour: 0, minute: 0, second: 0, millisecond: 0 };
            if (this.includeTime) {
                timeObject = { hour: this.startDate.hour(), minute: this.startDate.minute(), second: 0, millisecond: 0 };
                this.startDate.format('h:mm A');
            }
            return moment([year, month, day]).set(timeObject);
        };
        DatepickerComponent.prototype.applyRange = function () {
            var _this = this;
            this.getDimensions(this.startDate);
            var start = this.initialEmptyCells + this.startDay.value - 1;
            var startMonthLength = this.arrayLength;
            this.getDimensions(this.endDate);
            var endMonthLength = this.arrayLength;
            var end = this.initialEmptyCells + this.endDay.value - 1;
            this.resetRange();
            if (this.startDay.month !== this.endDay.month || this.startDay.year !== this.endDay.year) {
                Object.keys(this.gridArr).forEach(function (year) {
                    var calendar = _this.gridArr[year];
                    Object.keys(calendar).forEach(function (month) {
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
                            days.forEach(function (day) { return day.inRange = true; });
                        }
                    });
                });
            }
            else {
                var month = this.startDay.month;
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
        DatepickerComponent.prototype.isAvailableLogic = function (dateToCheck) {
            if (this.minDate || this.maxDate) {
                return !(dateToCheck.isBefore(this.minDate) || dateToCheck.isAfter(this.maxDate));
            }
            else {
                return !dateToCheck.isBefore(moment(), 'day');
            }
        };
        DatepickerComponent.prototype.canChangeNavMonthLogic = function (num, currentDate) {
            currentDate.add(num, 'month');
            var minDate = this.minDate ? this.minDate : moment().add(-1, 'month');
            var maxDate = this.maxDate ? this.maxDate : moment().add(1, 'year');
            return currentDate.isBetween(minDate, maxDate);
        };
        DatepickerComponent.prototype.toggleCalendar = function () {
            this.isOpen = !this.isOpen;
        };
        DatepickerComponent.prototype.openCalendar = function () {
            this.isOpen = true;
            this.onTouch();
            this.simulateClicks();
        };
        DatepickerComponent.prototype.closeCalendar = function () {
            this.isOpen = false;
            this.emitSelected.emit(this.selected);
        };
        DatepickerComponent.prototype.changeMode = function (mode) {
            this.mode = mode;
            this.onTouch();
        };
        DatepickerComponent.prototype.clear = function () {
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
        };
        DatepickerComponent.prototype.setTime = function (moment, hour, minute) {
            if (hour === void 0) { hour = 0; }
            if (minute === void 0) { minute = 0; }
            return moment.set({ hour: hour, minute: minute, second: 0, millisecond: 0 });
        };
        DatepickerComponent.prototype.handleModeChange = function () {
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
                var tmpStartDate = this.startDate.clone();
                var nextDay = tmpStartDate.add(2, 'days').format("YYYY-" + (tmpStartDate.format('M') - 1) + "-D");
                this.simulateClick(nextDay, 'calendar-day-not-range');
            }
        };
        DatepickerComponent.prototype.setStartTime = function (time) {
            this.startTime = time;
        };
        DatepickerComponent.prototype.setEndTime = function (time) {
            this.endTime = time;
        };
        // tslint:disable-next-line:no-shadowed-variable
        DatepickerComponent.prototype.handleTimeChange = function (time, moment, mode) {
            this.reFormatInput();
            if (!time) {
                return;
            }
            time = time.replace(/[^a-zA-Z0-9]/g, '');
            moment.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            var lastTwo = time.substr(time.length - 2).toUpperCase();
            var last = time.substr(time.length - 1).toUpperCase();
            var hasLastTwo = ['AM', 'PM'].includes(lastTwo);
            var hasLast = ['A', 'P'].includes(last);
            var isAm = true;
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
        };
        return DatepickerComponent;
    }());
    DatepickerComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'ngx-funny-datepicker',
                    template: "<!-- ********* INPUT FROM DATE Collaborator https://github.com/leifermendez ***************** --->\n\n<input (click)=\"openCalendar()\" readonly spellcheck=\"false\" class=\"omit-trigger-outside input-date-funny {{classInput}}\"\n  autocomplete=\"nope\" [value]=\"value\" [disabled]=\"isDisabled\" (input)=\"onInput($event.target.value)\" [ngClass]=\"{\n    'date-picker-valid ng-valid': !isInvalid,\n     'date-picker-invalid ng-invalid': isInvalid,\n     'funny-range':includeEndDate,\n     'ng-opened': isOpen,\n     'ng-touched': onTouched,\n     'ng-untouched': !onTouched\n    }\" type=\"text\">\n\n<!--- *************** CALENDAR ELEMENTS Author https://github.com/mokshithpyla ************* --->\n<div (clickOutside)=\"closeCalendar()\" class=\"calendar\" *ngIf=\"isOpen\">\n\n  <!-- **** CALENDAR NAVIGATION ****-->\n  <div class=\"calendar-nav\">\n    <div class=\"calendar-nav-previous-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(-1)\" [disabled]=\"!canAccessPrevious\">\n        <i class=\"fa fa-chevron-left\"></i>\n      </button>\n    </div>\n    <div>{{navDate.format('MMMM YYYY')}}</div>\n    <div class=\"calendar-nav-next-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(1)\" [disabled]=\"!canAccessNext\">\n        <i class=\"fa fa-chevron-right\"></i>\n      </button>\n    </div>\n  </div>\n\n  <!--- **** CALENDAR CONTAINER ****-->\n\n\n  <div class=\"calendar-container\">\n    <div class=\"calendar-header\">\n      <div class=\"calendar-date\" *ngFor=\"let day of weekDaysHeaderArr\">\n        {{day}}\n      </div>\n    </div>\n    <div class=\"calendar-body\" *ngIf=\"includeEndDate; else notRange\">\n      <ng-container *ngIf=\"gridArr\">\n        <div *ngFor=\"let day of gridArr[currentYear][currentMonth]\"\n          class=\"calendar-date calendar-day-not-range-{{currentYear}}-{{currentMonth}}-{{day?.value}}\"\n          [ngClass]=\"{\n          'is-disabled': !day.available,\n          'calendar-range': day.inRange,\n          'calendar-range-start': day.value === startDay?.value &&  day.month === startDay?.month && day.year === startDay?.year ,\n          'calendar-range-end': day.value === endDay?.value && day.month === endDay?.month && day.year === endDay?.year}\">\n          <button type=\"button\" *ngIf=\"day.value !== 0\" class=\"date-item\"\n            [ngClass]=\"{'is-active': day.isActive, 'is-today': day.isToday}\" (click)=\"selectDay(day)\">\n            {{day.value}}</button>\n          <button type=\"button\" *ngIf=\"day.value === 0\" class=\"date-item\"></button>\n        </div>\n      </ng-container>\n    </div>\n    <ng-template #notRange>\n      <div class=\"calendar-body\">\n        <div *ngFor=\"let day of gridArr[currentYear][currentMonth]\"\n          class=\"calendar-date calendar-day-range-{{currentYear}}-{{currentMonth}}-{{day?.value}}\"\n          [ngClass]=\"{'is-disabled': !day.available }\">\n          <button type=\"button\" *ngIf=\"day.value !== 0\" class=\"date-item\"\n            [ngClass]=\"{'is-active': day.isActive, 'is-today': day.isToday}\"\n            (click)=\"selectDay(day)\">{{day.value}}</button>\n          <button type=\"button\" *ngIf=\"day.value === 0\" class=\"date-item\"></button>\n        </div>\n      </div>\n    </ng-template>\n    <div class=\"footer-calendar\">\n      <div class=\"flex justify-content-between options-bar divider\">\n        <div class=\"flex\">\n          <div class=\"label-placeholder label-option pr-25\">\n            <input type=\"checkbox\" [(ngModel)]=\"includeEndDate\" (change)=\"handleModeChange()\">\n            <small>{{rangeLabel}}</small>\n          </div>\n          <div class=\"label-placeholder label-option pr-25\">\n            <input\n              (change)=\"reFormatInput();handleTimeChange(startTime, startDate, 'start');handleTimeChange(endTime, endDate, 'end')\"\n              [(ngModel)]=\"includeTime\" type=\"checkbox\">\n            <small>{{timeLabel}}</small>\n          </div>\n        </div>\n        <div class=\"label-placeholder label-option pr-25\">\n          <div (click)=\"clear()\">{{clearLabel}}</div>\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{startDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{startDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{startDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <input #startTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"\n            [ngModel]=\"startDate.format('h:mm A')\" *ngIf=\"startDate && includeTime\"\n            (ngModelChange)=\"setStartTime($event)\" (blur)=\"handleTimeChange(startTime, startDate, 'start')\"\n            (keyup.enter)=\"handleTimeChange(startTime, startDate, 'start')\">\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\" *ngIf=\"includeEndDate\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{endDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{endDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{endDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n\n          <ng-container *ngIf=\"endDate\">\n            <input #endTimePicker type=\"text\" class=\"input-hour\" autocomplete=\"nope\" spellcheck=\"false\"\n              [ngModel]=\"endDate.format('h:mm A')\" (ngModelChange)=\"setEndTime($event)\" *ngIf=\"includeTime\"\n              (blur)=\"handleTimeChange(endTime, endDate, 'end')\"\n              (keyup.enter)=\"handleTimeChange(endTime, endDate, 'end')\">\n          </ng-container>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n",
                    providers: [
                        {
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: i0.forwardRef(function () { return DatepickerComponent; }),
                            multi: true
                        }
                    ],
                    styles: [".datetimepicker-footer{display:flex;flex:1;justify-content:space-evenly;margin:0}.datetimepicker-selection-start{align-items:center;background:rgba(242,241,238,.6);border-radius:3px;box-shadow:inset 0 0 0 1px rgba(15,15,15,.1),inset 0 1px 1px rgba(15,15,15,.1);display:flex;flex-basis:50%;flex-grow:1;font-size:14px;height:28px;line-height:1.2;padding-left:8px;padding-right:8px}.slider{background-color:#ccc;bottom:0;cursor:pointer;left:0;right:0;top:0}.slider,.slider:before{position:absolute;transition:.4s}.slider:before{background-color:#fff;bottom:4px;content:\"\";height:26px;left:4px;width:26px}input:checked+.slider{background-color:#00d1b2}input:focus+.slider{box-shadow:0 0 1px #00d1b2}input:checked+.slider:before{transform:translateX(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}.pb10{padding-bottom:10px}.flex{display:flex}.w33p{width:33.33%}.align-right{text-align:right}.w56p{width:56.33%}.align-left{text-align:left}.pl10{padding-left:10px}.calendar-nav-next-month>button,.calendar-nav-previous-month>button{background-size:100%;height:25px}.calendar-nav>div{align-items:center;display:flex;height:25px}"]
                },] }
    ];
    DatepickerComponent.ctorParameters = function () { return [
        { type: i0.Renderer2 }
    ]; };
    DatepickerComponent.propDecorators = {
        value: [{ type: i0.Input }],
        startTimePicker: [{ type: i0.ViewChild, args: ['startTimePicker',] }],
        endTimePicker: [{ type: i0.ViewChild, args: ['endTimePicker',] }],
        isRange: [{ type: i0.Input }],
        hasTime: [{ type: i0.Input }],
        startDate: [{ type: i0.Input }],
        endDate: [{ type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        classInput: [{ type: i0.Input }],
        locale: [{ type: i0.Input }],
        rangeLabel: [{ type: i0.Input }],
        timeLabel: [{ type: i0.Input }],
        clearLabel: [{ type: i0.Input }],
        includeEndDate: [{ type: i0.Input }],
        emitSelected: [{ type: i0.Output }]
    };

    var OutSideDirective = /** @class */ (function () {
        function OutSideDirective(elementRef) {
            this.elementRef = elementRef;
            this.clickOutside = new i0.EventEmitter();
        }
        OutSideDirective.prototype.onClick = function (target) {
            var classElement = target.classList || [];
            if (!Array.from(classElement).includes('omit-trigger-outside')) {
                var clickedInside = this.elementRef.nativeElement.contains(target);
                if (!clickedInside) {
                    this.clickOutside.emit();
                }
            }
        };
        return OutSideDirective;
    }());
    OutSideDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[clickOutside]'
                },] }
    ];
    OutSideDirective.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };
    OutSideDirective.propDecorators = {
        clickOutside: [{ type: i0.Output }],
        onClick: [{ type: i0.HostListener, args: ['document:click', ['$event.target'],] }]
    };

    var NgxFunnyDatepickerModule = /** @class */ (function () {
        function NgxFunnyDatepickerModule() {
        }
        return NgxFunnyDatepickerModule;
    }());
    NgxFunnyDatepickerModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [NgxFunnyDatepickerComponent, DatepickerComponent, OutSideDirective],
                    imports: [
                        common.CommonModule,
                        forms.FormsModule
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

    exports.DatepickerComponent = DatepickerComponent;
    exports.NgxFunnyDatepickerComponent = NgxFunnyDatepickerComponent;
    exports.NgxFunnyDatepickerModule = NgxFunnyDatepickerModule;
    exports.NgxFunnyDatepickerService = NgxFunnyDatepickerService;
    exports.ɵa = OutSideDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-funny-datepicker.umd.js.map
