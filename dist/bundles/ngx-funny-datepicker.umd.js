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

    var moment = moment__namespace;
    var DatepickerComponent = /** @class */ (function () {
        function DatepickerComponent(cdr) {
            var _this = this;
            this.cdr = cdr;
            this.value = '';
            this.startDateChange = new i0.EventEmitter();
            this.endDateChange = new i0.EventEmitter();
            this.locale = 'en';
            this.rangeLabel = 'Range';
            this.timeLabel = 'Time';
            this.clearLabel = 'Clear';
            this.formatInputDate = 'D MMM, YYYY';
            this.formatInputTime = 'D MMM, YYYY HH:mm';
            this.emitSelected = new i0.EventEmitter();
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
            this.onChange = function (_) {
            };
            this.onTouch = function () {
                _this.onTouched = true;
            };
            /**
             *
             * @param num
             * @param mode
             */
            this.addOrSubHour = function (num, mode) {
                if (num > 0) {
                    _this.checkHourValidate((Number(_this.valueInputHour[mode]) + 1), mode);
                }
                else {
                    _this.checkHourValidate((Number(_this.valueInputHour[mode]) - 1), mode);
                }
            };
            this.addOrSubMinute = function (num, mode) {
                if (num > 0) {
                    _this.checkMinuteValidate((Number(_this.valueInputMinute[mode]) + 1), mode);
                }
                else {
                    _this.checkMinuteValidate((Number(_this.valueInputMinute[mode]) - 1), mode);
                }
            };
            this.checkHourValidate = function ($event, mode) {
                var toHour = (mode === 'start') ? 'start' : 'end';
                if (_this.meridianTime) {
                    _this.valueInputHour[toHour] = $event;
                    if ($event <= 12 && $event > 0) {
                        if (mode === 'start' && _this.startDate && _this.startDate.format('A') === 'PM') {
                            if ($event === 12) {
                                _this.startDate.set({ hour: ($event), minute: _this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                            }
                            else {
                                _this.startDate.set({ hour: ($event + 12), minute: _this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                            }
                        }
                        if (mode === 'start' && _this.startDate && _this.startDate.format('A') === 'AM') {
                            _this.startDate.set({ hour: ($event), minute: _this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                        }
                        if (mode === 'end' && _this.endDate && _this.endDate.format('A') === 'PM') {
                            if ($event === 12) {
                                _this.endDate.set({ hour: ($event), minute: _this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                            }
                            else {
                                _this.endDate.set({ hour: ($event + 12), minute: _this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                            }
                        }
                        if (mode === 'end' && _this.endDate && _this.endDate.format('A') === 'AM') {
                            _this.endDate.set({ hour: ($event), minute: _this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                        }
                        if (mode === 'start' && _this.endDate && _this.endDate.format('A') === 'PM') {
                            _this.startDate.set({ hour: _this.valueInputHour[toHour] + 12, minute: _this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                        }
                    }
                }
                else {
                    if ($event >= 0 && $event <= 23) {
                        _this.valueInputHour[toHour] = $event;
                        if (mode === 'end') {
                            _this.endDate.set({ hour: ($event), minute: _this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                        }
                        if (mode === 'start') {
                            _this.startDate.set({ hour: _this.valueInputHour[toHour], minute: _this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                        }
                    }
                }
                _this.reFormatInput();
            };
            this.checkMinuteValidate = function ($event, mode) {
                var toHour = (mode === 'start') ? 'start' : 'end';
                _this.valueInputMinute[toHour] = $event;
                if ($event < 0) {
                    _this.valueInputMinute[toHour] = 59;
                }
                else if ($event > 59) {
                    _this.valueInputMinute[toHour] = 0;
                }
                if (mode === 'start') {
                    _this.startDate.set({ minute: _this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                }
                if (mode === 'end') {
                    _this.endDate.set({ minute: _this.valueInputMinute[toHour], second: 0, millisecond: 0 });
                }
                _this.reFormatInput();
            };
            this.changeMeridianTime = function (newMeridian, mode) {
                var isStartOrEnd = (mode === 'start') ? 'startDate' : 'endDate';
                if (newMeridian === 'AM' && _this[isStartOrEnd].hours() > 12) {
                    _this[isStartOrEnd].hours(_this[isStartOrEnd].hours() - 12);
                }
                else if (newMeridian === 'PM' && _this[isStartOrEnd].hours() <= 12) {
                    _this[isStartOrEnd].hours(_this[isStartOrEnd].hours() + 12);
                }
                else if (newMeridian === 'AM' && _this.startDate.hours() <= 12) {
                    _this[isStartOrEnd].hours(_this[isStartOrEnd].hours() - 1);
                }
                if (mode === 'start') {
                    _this.valueInputHour[mode] = _this[isStartOrEnd].hours(_this[isStartOrEnd].hours()).format('hh');
                }
                if (mode === 'end') {
                    _this.valueInputHour[mode] = _this[isStartOrEnd].hours(_this[isStartOrEnd].hours()).format('hh');
                }
                _this.reFormatInput();
            };
            /**
             * Concat values date to string format for show in input
             */
            this.concatValueInput = function () {
                var concatValue = [
                    _this.startDate.format(_this.formatInputDate),
                    (_this.endDate && _this.endDate.isValid()) ? '  -  ' : '',
                    (_this.endDate && _this.endDate.isValid()) ? _this.endDate.format(_this.formatInputDate) : ''
                ];
                _this.value = concatValue.join('');
                _this.isInvalid = !(_this.value.length);
                _this.selected = {
                    startDate: (_this.startDate && _this.startDate.isValid()) ? _this.startDate.toDate() : null,
                    endDate: (_this.endDate && _this.endDate.isValid()) ? _this.endDate.toDate() : null
                };
            };
            this.generateAllGrid = function () {
                var dateObjectCurrent = moment().startOf('year').clone();
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(function (a) {
                    _this.makeGridCustom(dateObjectCurrent.year(), a);
                });
            };
            this.makeGridCustom = function (year, month) {
                if (year === void 0) { year = null; }
                if (month === void 0) { month = null; }
                /**
                 * Fix
                 */
                var dateOfTurn = moment(year + "-" + month + "-01", 'YYYY-M-DD');
                /**
                 * Is OK
                 */
                if (!_this.dataMonths.hasOwnProperty(year)) {
                    _this.dataMonths[year] = {};
                }
                /**
                 * Is OK
                 */
                if (!_this.dataMonths[year].hasOwnProperty(month)) {
                    _this.dataMonths[year][month] = [];
                    /**
                     * Fix
                     */
                    var firstDayDate = moment(dateOfTurn).startOf('month');
                    var lastDayDate = moment(dateOfTurn).endOf('month');
                    _this.dataMonths[year]["initialEmptyCells" + month] = firstDayDate.weekday();
                    _this.dataMonths[year]["lastEmptyCells" + month] = 6 - lastDayDate.weekday();
                    var initEmptyCell = _this.dataMonths[year]["initialEmptyCells" + month];
                    var lastEmptyCell = _this.dataMonths[year]["lastEmptyCells" + month];
                    _this.dataMonths[year]["arrayLength" + month] = initEmptyCell + lastEmptyCell + dateOfTurn.daysInMonth();
                    var arrayLengths = _this.dataMonths[year]["arrayLength" + month];
                    _this.getDimensions(dateOfTurn);
                    for (var i = 0; i < arrayLengths; i++) {
                        var obj = {};
                        if (i < initEmptyCell || i > initEmptyCell + dateOfTurn.daysInMonth() - 1) {
                            obj.value = 0;
                            obj.available = false;
                            obj.isToday = false;
                        }
                        else {
                            obj.value = i - initEmptyCell + 1;
                            obj.available = _this.isAvailable(i - initEmptyCell + 1);
                            obj.isToday = _this.isToday(i - initEmptyCell + 1, month, year);
                            obj.month = month;
                            obj.date = dateOfTurn;
                            obj.year = year;
                            obj.isActive = false;
                            if (_this.dateFromDayAndMonthAndYear(obj.value, month, year).isSame(_this.startDate)) {
                                _this.startDay = obj;
                            }
                            if (_this.dateFromDayAndMonthAndYear(obj.value, month, year).isSame(_this.endDate)) {
                                _this.endDay = obj;
                            }
                            if (obj.isToday && !_this.startDay && !_this.endDay) {
                                _this.startDay = obj;
                                _this.endDay = obj;
                                obj.isActive = true;
                            }
                        }
                        obj.inRange = false;
                        _this.dataMonths[year][month].push(obj);
                    }
                }
            };
            this.reFormatInput = function () {
                _this.formatInputDate = (_this.includeTime) ? _this.formatInputTime : _this.formatInputDate;
                _this.concatValueInput();
            };
        }
        Object.defineProperty(DatepickerComponent.prototype, "startDate", {
            get: function () {
                return this._startDate;
            },
            set: function (value) {
                if (this._startDate === value) {
                    return;
                }
                this._startDate = moment(value);
                if (this._startDate.isValid()) {
                    this.startDateChange.emit(this._startDate);
                    this.reFormatInput();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatepickerComponent.prototype, "endDate", {
            get: function () {
                return this._endDate;
            },
            set: function (value) {
                if (this._endDate === value) {
                    return;
                }
                this._endDate = moment(value);
                if (this._endDate.isValid()) {
                    this.endDateChange.emit(this._endDate);
                    this.reFormatInput();
                }
            },
            enumerable: false,
            configurable: true
        });
        DatepickerComponent.prototype.ngAfterContentChecked = function () {
            this.cdr.detectChanges();
        };
        DatepickerComponent.prototype.ngOnInit = function () {
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
                var startDay_1 = {
                    month: Number(this.startDate.format('M')),
                    year: this.startDate.year(),
                    day: Number(this.startDate.format('DD'))
                };
                this.dataMonths[startDay_1.year][startDay_1.month].forEach(function (d) { return d.isActive = (d.value === startDay_1.day); });
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
                var endDay_1 = {
                    month: Number(this.endDate.format('M')),
                    year: this.endDate.year(),
                    day: Number(this.endDate.format('DD'))
                };
                this.applyRange();
                var startDay_2 = {
                    month: Number(this.startDate.format('M')),
                    year: this.startDate.year(),
                    day: Number(this.startDate.format('DD'))
                };
                this.dataMonths[startDay_2.year][startDay_2.month].forEach(function (d) { return d.isActive = (d.value === startDay_2.day); });
                this.dataMonths[endDay_1.year][endDay_1.month].forEach(function (d) {
                    if (!d.isActive) {
                        d.isActive = (d.value === endDay_1.day);
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
        DatepickerComponent.prototype.setOptions = function () {
            moment.locale(this.locale);
            this.generateAllGrid();
            this.formatInputTime = (this.meridianTime) ? "D MMM, YYYY hh:mm A" : "D MMM, YYYY HH:mm";
            // this.includeEndDate = false;
            // this.includeTime = false;
        };
        DatepickerComponent.prototype.setAccess = function () {
            this.canAccessPrevious = this.canChangeNavMonth(-1);
            this.canAccessNext = this.canChangeNavMonth(1);
        };
        DatepickerComponent.prototype.changeNavMonth = function (num, mode) {
            if (mode === void 0) { mode = 'next'; }
            if (this.canChangeNavMonth(num)) {
                this.navDate.add(num, 'month');
                this.currentMonth = this.navDate.month() + 1;
                this.currentYear = this.navDate.year();
                this.makeGridCustom(this.currentYear, this.currentMonth);
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
        };
        DatepickerComponent.prototype.generateDate = function (day, date) {
            var generatedDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
            if (date) {
                generatedDate = generatedDate.set({ hour: date.hour(), minute: date.minute() });
            }
            return generatedDate;
        };
        DatepickerComponent.prototype.resetRange = function () {
            var _this = this;
            Object.keys(this.dataMonths).forEach(function (year) {
                Object.keys(_this.dataMonths[year]).forEach(function (month) {
                    if (!isNaN(Number(month))) {
                        _this.dataMonths[year][month].map(function (day) {
                            day.inRange = false;
                            day.isActive = false;
                        });
                    }
                });
            });
        };
        DatepickerComponent.prototype.resetActivity = function () {
            var _this = this;
            Object.keys(this.dataMonths).forEach(function (year) {
                Object.keys(_this.dataMonths[year]).forEach(function (month) {
                    if (!isNaN(Number(month))) {
                        _this.dataMonths[year][month].map(function (day) {
                            day.isActive = false;
                        });
                    }
                });
            });
        };
        DatepickerComponent.prototype.dateFromDayAndMonthAndYear = function (day, month, year) {
            var timeObject = { hour: 0, minute: 0, second: 0, millisecond: 0 };
            if (this.includeTime) {
                timeObject = { hour: this.startDate.hour(), minute: this.startDate.minute(), second: 0, millisecond: 0 };
                this.startDate.format('h:mm A');
            }
            return moment(year + "-" + month + "-" + day, 'YYYY-M-DD').set(timeObject);
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
                Object.keys(this.dataMonths).forEach(function (year) {
                    var calendar = _this.dataMonths[year];
                    Object.keys(calendar).forEach(function (month) {
                        if (!isNaN(Number(month))) {
                            var days = _this.dataMonths[year][month];
                            if (Number(month) === Number(_this.startDay.month) && Number(year) === Number(_this.startDay.year)) {
                                for (var i = 0; i < start; i++) {
                                    days[i].inRange = false;
                                }
                                for (var i = start; i < startMonthLength; i++) {
                                    days[i].inRange = true;
                                }
                            }
                            else if (Number(month) === Number(_this.endDay.month) && Number(year) === Number(_this.endDay.year)) {
                                for (var i = 0; i <= end; i++) {
                                    days[i].inRange = true;
                                }
                                for (var i = end + 1; i < endMonthLength; i++) {
                                    days[i].inRange = false;
                                }
                            }
                            else if ((month > _this.startDay.month || year > _this.startDay.year)
                                && (month < _this.endDay.month || year < _this.endDay.year)) {
                                days.forEach(function (day) { return day.inRange = true; });
                            }
                        }
                    });
                });
            }
            else {
                var month = this.startDay.month;
                var year = this.startDay.year;
                for (var i = 0; i < start; i++) {
                    this.dataMonths[year][month][i].inRange = false;
                }
                for (var i = start; i <= end; i++) {
                    this.dataMonths[year][month][i].inRange = true;
                }
                for (var i = end + 1; i < this.arrayLength; i++) {
                    this.dataMonths[year][month][i].inRange = false;
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
            this.reFormatInput();
        };
        DatepickerComponent.prototype.openCalendar = function () {
            this.isOpen = true;
            this.onTouch();
        };
        DatepickerComponent.prototype.closeCalendar = function () {
            this.isOpen = false;
            this.reFormatInput();
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
            this.makeGridCustom(this.currentYear, this.currentMonth);
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
                // const nextDay = tmpStartDate.add(2, 'days').format(`YYYY-${tmpStartDate.format('M') - 1}-D`);
                // this.simulateClick(nextDay, 'calendar-day-not-range');
            }
        };
        DatepickerComponent.prototype.setStartTime = function (time) {
            this.startTime = time;
        };
        DatepickerComponent.prototype.setEndTime = function (time) {
            this.endTime = time;
        };
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
                    template: "<!-- ********* INPUT FROM DATE Collaborator https://github.com/leifermendez ***************** --->\n<input (click)=\"openCalendar()\" readonly spellcheck=\"false\" class=\"omit-trigger-outside input-date-funny {{classInput}}\"\n  autocomplete=\"nope\" [value]=\"value\" [disabled]=\"isDisabled\" (input)=\"onInput($event.target.value)\" [ngClass]=\"{\n    'date-picker-valid ng-valid': !isInvalid,\n     'date-picker-invalid ng-invalid': isInvalid,\n     'funny-range':includeEndDate,\n     'ng-opened': isOpen,\n     'ng-touched': onTouched,\n     'ng-untouched': !onTouched\n    }\" type=\"text\">\n\n<!--- *************** CALENDAR ELEMENTS Author https://github.com/mokshithpyla ************* --->\n<div (clickOutside)=\"closeCalendar()\" class=\"calendar\" *ngIf=\"isOpen\">\n  <!-- **** CALENDAR NAVIGATION ****-->\n  <div class=\"calendar-nav\">\n    <div class=\"calendar-nav-previous-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(-1)\" [disabled]=\"!canAccessPrevious\">\n        <i class=\"fa fa-chevron-left\"></i>\n      </button>\n    </div>\n    <div>{{navDate.format('MMMM YYYY')}}</div>\n    <div class=\"calendar-nav-next-month\">\n      <button type=\"button\" class=\"button is-text\" (click)=\"changeNavMonth(1)\" [disabled]=\"!canAccessNext\">\n        <i class=\"fa fa-chevron-right\"></i>\n      </button>\n    </div>\n  </div>\n\n  <!--- **** CALENDAR CONTAINER ****-->\n\n  <div class=\"calendar-container\">\n    <div class=\"calendar-header\">\n      <div class=\"calendar-date\" *ngFor=\"let day of weekDaysHeaderArr\" [innerText]=\"day\"></div>\n    </div>\n    <div class=\"calendar-body\">\n      <!---**** LOAD TEMPLATE*** --->\n      <ng-container *ngTemplateOutlet=\"templateCalendar;context:{\n      data:dataMonths,\n      year:navDate.format('YYYY'),\n      month:navDate.format('M'),\n      includeEndDate:includeEndDate,\n      startDay:null,\n      endDate:null}\"></ng-container>\n    </div>\n\n    <div class=\"footer-calendar\">\n      <div class=\"flex justify-content-between options-bar divider\">\n        <div class=\"flex\">\n          <div class=\"label-placeholder label-option pr-25\">\n            <input type=\"checkbox\" [(ngModel)]=\"includeEndDate\" (change)=\"handleModeChange()\">\n            <small>{{rangeLabel}}</small>\n          </div>\n          <div class=\"label-placeholder label-option pr-25\">\n            <input\n              (change)=\"reFormatInput();handleTimeChange(startTime, startDate, 'start');handleTimeChange(endTime, endDate, 'end')\"\n              [(ngModel)]=\"includeTime\" type=\"checkbox\">\n            <small>{{timeLabel}}</small>\n          </div>\n        </div>\n        <div class=\"label-placeholder label-option pr-25\">\n          <div (click)=\"clear()\">{{clearLabel}}</div>\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\">\n\n        <div class=\"child\" *ngIf=\"startDate && startDate.isValid()\">\n          <div class=\"calendar-child-day\">{{startDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{startDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{startDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\" *ngIf=\"!startDate || !startDate.isValid()\">\n          <div class=\"calendar-child-day\">{{navDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{navDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{navDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <ng-container\n            *ngTemplateOutlet=\"templateTimeInput;context:{mode:'start',startDate:startDate,timeShow:includeTime}\">\n          </ng-container>\n        </div>\n      </div>\n      <div class=\"zone-preview-dates divider\" *ngIf=\"includeEndDate\">\n        <div class=\"child\">\n          <div class=\"calendar-child-day\">{{endDate?.format('D')}}</div>\n          <div>\n            <div class=\"calendar-child-month\">{{endDate?.format('MMMM YYYY')}}</div>\n            <div class=\"calendar-child-week\">{{endDate?.format('dddd')}}</div>\n          </div>\n        </div>\n        <div class=\"child\">\n          <ng-container *ngTemplateOutlet=\"templateTimeInput;context:{mode:'end',endDate:endDate,timeShow:includeTime}\">\n          </ng-container>\n        </div>\n      </div>\n    </div>\n  </div>\n\n</div>\n\n<!--- ********** TEMPLATE BODY CALENDAR*************** -->\n<ng-template #templateCalendar let-data=\"data\" let-year=\"year\" let-includedend=\"includeEndDate\" let-month=\"month\"\n  let-start=\"startDay\" let-end=\"endDate\">\n  <ng-container *ngIf=\"includeEndDate\">\n    <div *ngFor=\"let day of data[year][month]\"\n      class=\"calendar-date calendar-day-not-range-{{year}}-{{month}}-{{day?.value}}\" [ngClass]=\"{\n          'is-disabled': !day?.available,\n          'calendar-range': day?.inRange,\n          'calendar-range-start': day?.value === start?.value && day?.month === start?.month && day?.year === start?.year ,\n          'calendar-range-end': day?.value === end?.value && day?.month === end?.month && day?.year === end?.year}\">\n      <button type=\"button\" *ngIf=\"day.value !== 0\" class=\"date-item\"\n        [ngClass]=\"{'is-active': day?.isActive, 'is-today': day?.isToday}\" (click)=\"selectDay(day)\">\n        {{day.value}}</button>\n      <button type=\"button\" *ngIf=\"day?.value === 0\" class=\"date-item\"></button>\n    </div>\n  </ng-container>\n\n  <ng-container *ngIf=\"!includeEndDate\">\n    <div *ngFor=\"let day of data[year][month]\" class=\"calendar-date\" [ngClass]=\"{'is-disabled': !day?.available }\">\n      <button *ngIf=\"day?.value !== 0\" class=\"date-item\" type=\"button\"\n        [ngClass]=\"{'is-active': day?.isActive, 'is-today': day?.isToday}\"\n        (click)=\"selectDay(day)\">{{day?.value}}</button>\n      <button type=\"button\" *ngIf=\"day?.value === 0\" class=\"date-item\"></button>\n    </div>\n  </ng-container>\n</ng-template>\n<!--- ********** TEMPLATE INPUT TIME*************** -->\n<ng-template #templateTimeInput let-mode=\"mode\" let-show=\"timeShow\" let-start=\"startDate\" let-end=\"endDate\">\n\n  <ng-container *ngIf=\"show\">\n    <div class=\"meridian-buttons\" *ngIf=\"meridianTime && mode === 'start'\">\n      <div>\n        <button (click)=\"changeMeridianTime('AM','start')\" [disabled]=\"startDate && startDate.format('A') === 'AM'\"\n          type=\"button\">AM\n        </button>\n      </div>\n      <div>\n        <button (click)=\"changeMeridianTime('PM','start')\" [disabled]=\"startDate && startDate.format('A') === 'PM'\"\n          type=\"button\">PM\n        </button>\n      </div>\n    </div>\n    <div class=\"meridian-buttons\" *ngIf=\"meridianTime && endDate && mode === 'end'\">\n      <div>\n        <button (click)=\"changeMeridianTime('AM','end')\" [disabled]=\"endDate && endDate.format('A') === 'AM'\"\n          type=\"button\">AM\n        </button>\n      </div>\n      <div>\n        <button (click)=\"changeMeridianTime('PM','end')\" [disabled]=\"endDate && endDate.format('A') === 'PM'\"\n          type=\"button\">PM\n        </button>\n      </div>\n    </div>\n    <div class=\"calendar-time-input-cells\" *ngIf=\"mode === 'start'\">\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkHourValidate($event,'start')\"\n          [max]=\"maxInputHour\" [min]=\"minInputHour\" [(ngModel)]=\"valueInputHour.start\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubHour(1,'start')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubHour(-1,'start')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkMinuteValidate($event,'start')\"\n          [max]=\"maxInputMinute\" [min]=\"minInputMinute\" [(ngModel)]=\"valueInputMinute.start\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubMinute(1,'start')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubMinute(-1,'start')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n    </div>\n    <div class=\"calendar-time-input-cells\" *ngIf=\"endDate && mode === 'end'\">\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkHourValidate($event,'end')\"\n          type=\"button\" [max]=\"maxInputHour\" [min]=\"minInputHour\" [(ngModel)]=\"valueInputHour.end\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubHour(1,'end')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubHour(-1,'end')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n      <div class=\"group-input-item\">\n        <input [maxLength]=\"2\" libCheckInput [minLength]=\"2\" (ngModelChange)=\"checkMinuteValidate($event,'end')\"\n          [max]=\"maxInputMinute\" [min]=\"minInputMinute\" [(ngModel)]=\"valueInputMinute.end\" type=\"number\">\n        <div>\n          <button (click)=\"addOrSubMinute(1,'end')\" type=\"button\" class=\"up-time\"></button>\n          <button (click)=\"addOrSubMinute(-1,'end')\" type=\"button\" class=\"down-time\"></button>\n        </div>\n      </div>\n    </div>\n  </ng-container>\n\n</ng-template>\n",
                    providers: [
                        {
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: i0.forwardRef(function () { return DatepickerComponent; }),
                            multi: true
                        }
                    ],
                    styles: [":host .datetimepicker-footer{display:flex;flex:1;justify-content:space-evenly;margin:0}:host .datetimepicker-selection-start{align-items:center;background:rgba(242,241,238,.6);border-radius:3px;box-shadow:inset 0 0 0 1px rgba(15,15,15,.1),inset 0 1px 1px rgba(15,15,15,.1);display:flex;flex-basis:50%;flex-grow:1;font-size:14px;height:28px;line-height:1.2;padding-left:8px;padding-right:8px}:host .slider{background-color:#ccc;bottom:0;cursor:pointer;left:0;position:absolute;right:0;top:0;transition:.4s}:host .slider:before{background-color:#fff;bottom:4px;content:\"\";height:26px;left:4px;position:absolute;transition:.4s;width:26px}:host input:checked+.slider{background-color:#00d1b2}:host input:focus+.slider{box-shadow:0 0 1px #00d1b2}:host input:checked+.slider:before{transform:translateX(26px)}:host .slider.round{border-radius:34px}:host .slider.round:before{border-radius:50%}:host .pb10{padding-bottom:10px}:host .flex{display:flex}:host .w33p{width:33.33%}:host .align-right{text-align:right}:host .w56p{width:56.33%}:host.align-left{text-align:left}:host.pl10{padding-left:10px}:host.calendar-nav-next-month>button,:host .calendar-nav-previous-month>button{background-size:100%;height:25px}:host .calendar-nav>div{align-items:center;display:flex;height:25px}:host .calendar-time-input-cells{display:flex;justify-content:center;width:100%}:host .group-input-item{background:#f7f7f7;display:flex;height:34px;padding:2px}:host .group-input-item input{border:none;font-size:15px;text-align:center;width:30px}:host .meridian-buttons button{background:#f7f7f7;border:0;cursor:pointer;font-size:11px;padding:3px}:host .meridian-buttons div:first-child button{margin-bottom:2px}:host .meridian-buttons button:disabled,:host button[disabled]{background-color:#3b3b98;border:0 solid #fff;border-radius:1px;color:#fff}:host .group-input-item button{align-content:normal;align-items:center;background:#f7f7f7;border:1px solid #f7f7f7;cursor:pointer;display:flex;height:15px;justify-content:center;margin:0;padding:0;width:18px}:host .group-input-item button:hover{background-color:#d3d3d3}:host .group-input-item button.up-time:before{border-color:transparent transparent #303438;border-style:solid;border-width:0 4px 5px;content:\"\"}:host .group-input-item button.down-time:before{border-color:#303438 transparent transparent;border-style:solid;border-width:5px 4px 0;content:\"\"}:host .group-input-item>div{display:flex;flex-flow:column}:host input::-webkit-inner-spin-button,:host input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}:host input[type=number]{-moz-appearance:textfield}"]
                },] }
    ];
    DatepickerComponent.ctorParameters = function () { return [
        { type: i0.ChangeDetectorRef }
    ]; };
    DatepickerComponent.propDecorators = {
        value: [{ type: i0.Input }],
        startTimePicker: [{ type: i0.ViewChild, args: ['startTimePicker',] }],
        endTimePicker: [{ type: i0.ViewChild, args: ['endTimePicker',] }],
        showInitialValue: [{ type: i0.Input }],
        isRange: [{ type: i0.Input }],
        hasTime: [{ type: i0.Input }],
        startDate: [{ type: i0.Input }],
        startDateChange: [{ type: i0.Output }],
        endDate: [{ type: i0.Input }],
        endDateChange: [{ type: i0.Output }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        classInput: [{ type: i0.Input }],
        locale: [{ type: i0.Input }],
        rangeLabel: [{ type: i0.Input }],
        timeLabel: [{ type: i0.Input }],
        clearLabel: [{ type: i0.Input }],
        includeEndDate: [{ type: i0.Input }],
        meridianTime: [{ type: i0.Input }],
        formatInputDate: [{ type: i0.Input }],
        formatInputTime: [{ type: i0.Input }],
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

    var CheckInputDirective = /** @class */ (function () {
        function CheckInputDirective(el) {
            this.inputElement = el;
        }
        CheckInputDirective.prototype.onKeyPress = function (event) {
            this.tmpValue = (this.inputElement.nativeElement.value.length > 2) ? 1 : this.inputElement.nativeElement.value;
            this.integerOnly(event);
        };
        CheckInputDirective.prototype.onKeyUp = function (event) {
            this.checkLength(event);
        };
        CheckInputDirective.prototype.checkLength = function (event) {
            var value = this.inputElement.nativeElement.value;
            if (!isNaN(value)) {
                if (value.toString().length > 2) {
                    this.inputElement.nativeElement.value = this.tmpValue;
                    event.preventDefault();
                }
            }
            else {
                event.preventDefault();
            }
        };
        CheckInputDirective.prototype.integerOnly = function (event) {
            var e = event;
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
        };
        return CheckInputDirective;
    }());
    CheckInputDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[libCheckInput]'
                },] }
    ];
    CheckInputDirective.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };
    CheckInputDirective.propDecorators = {
        onKeyPress: [{ type: i0.HostListener, args: ['keypress', ['$event'],] }],
        onKeyUp: [{ type: i0.HostListener, args: ['keyup', ['$event'],] }]
    };

    var NgxFunnyDatepickerModule = /** @class */ (function () {
        function NgxFunnyDatepickerModule() {
        }
        return NgxFunnyDatepickerModule;
    }());
    NgxFunnyDatepickerModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [NgxFunnyDatepickerComponent, DatepickerComponent, OutSideDirective, CheckInputDirective],
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
    exports.ɵb = CheckInputDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-funny-datepicker.umd.js.map
