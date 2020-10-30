import { ChangeDetectorRef } from '@angular/core';
import { AfterContentChecked } from '@angular/core';
import { OnInit, EventEmitter, ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as moment_ from 'moment';
export declare class DatepickerComponent implements OnInit, ControlValueAccessor, AfterContentChecked {
    private cdr;
    value: any;
    startTimePicker: ElementRef;
    endTimePicker: ElementRef;
    showInitialValue: boolean;
    isRange: boolean;
    hasTime: boolean;
    startDatePrivate: any;
    get startDate(): any;
    set startDate(value: any);
    startDateChange: EventEmitter<any>;
    endDatePrivate: any;
    get endDate(): any;
    set endDate(value: any);
    endDateChange: EventEmitter<any>;
    minDate: any;
    maxDate: any;
    classInput: string;
    locale: string;
    rangeLabel: string;
    timeLabel: string;
    clearLabel: string;
    includeEndDate: boolean;
    meridianTime: boolean;
    formatInputDate: string;
    formatInputTime: string;
    emitSelected: EventEmitter<any>;
    isOpen: boolean;
    navDate: any;
    weekDaysHeaderArr: Array<string>;
    dataMonths: any;
    selectedDate: any;
    canAccessPrevious: boolean;
    canAccessNext: boolean;
    todayDate: moment_.Moment;
    startDay: any;
    endDay: any;
    renderedFlag: boolean;
    mode: string;
    initialEmptyCells: number;
    lastEmptyCells: number;
    arrayLength: number;
    currentMonth: number;
    currentYear: number;
    selected: any;
    startTime: any;
    endTime: any;
    isInvalid: boolean;
    includeTime: boolean;
    minInputHour: number;
    maxInputHour: number;
    valueInputHour: any;
    minInputMinute: number;
    maxInputMinute: number;
    valueInputMinute: any;
    /**
     * ControlAccessor
     */
    onTouched: boolean;
    isDisabled: boolean;
    onChange: (_: any) => void;
    onTouch: () => void;
    constructor(cdr: ChangeDetectorRef);
    ngAfterContentChecked(): void;
    ngOnInit(): void;
    /**
     *
     * controlValueAccessor
     */
    onInput(value: any): void;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    /**
     *
     * @param num
     * @param mode
     */
    addOrSubHour: (num: number, mode: string) => void;
    addOrSubMinute: (num: number, mode: string) => void;
    checkHourValidate: ($event: any, mode: any) => void;
    checkMinuteValidate: ($event: any, mode: string) => void;
    changeMeridianTime: (newMeridian: any, mode: any) => void;
    setOptions(): void;
    /**
     * Concat values date to string format for show in input
     */
    concatValueInput: () => void;
    setAccess(): void;
    changeNavMonth(num: number, mode?: string): void;
    generateAllGrid: () => void;
    canChangeNavMonth(num: number): any;
    makeHeader(): void;
    getDimensions(date: any): void;
    makeGridCustom: (year?: any, month?: any) => void;
    isAvailable(num: number): boolean;
    isToday(num: number, month: number, year: number): boolean;
    dateFromNum(num: number, referenceDate: any): any;
    reFormatInput: () => void;
    selectDay(day: any): void;
    generateDate(day: any, date: any): moment_.Moment;
    resetRange(): void;
    resetActivity(): void;
    dateFromDayAndMonthAndYear(day: any, month: any, year: any): moment_.Moment;
    applyRange(): void;
    isAvailableLogic(dateToCheck: any): boolean;
    canChangeNavMonthLogic(num: any, currentDate: any): any;
    toggleCalendar(): any;
    openCalendar(): any;
    closeCalendar(): any;
    changeMode(mode: string): void;
    clear(): void;
    setTime(moment: any, hour?: number, minute?: number): any;
    handleModeChange(): void;
    setStartTime(time: any): void;
    setEndTime(time: any): void;
    handleTimeChange(time: any, moment: any, mode: string): void;
}
