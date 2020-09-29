import { OnInit, EventEmitter, ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as moment_ from 'moment';
export declare class DatepickerComponent implements OnInit, ControlValueAccessor {
    value: any;
    startTimePicker: ElementRef;
    endTimePicker: ElementRef;
    isRange: boolean;
    hasTime: boolean;
    startDate: any;
    endDate: any;
    minDate: any;
    maxDate: any;
    classInput: string;
    locale: string;
    rangeLabel: string;
    timeLabel: string;
    clearLabel: string;
    emitSelected: EventEmitter<any>;
    isOpen: boolean;
    navDate: any;
    weekDaysHeaderArr: Array<string>;
    gridArr: any;
    selectedDate: any;
    canAccessPrevious: boolean;
    canAccessNext: boolean;
    todayDate: moment_.Moment;
    startDay: any;
    endDay: any;
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
    includeEndDate: boolean;
    includeTime: boolean;
    formatInputDate: string;
    /**
     * ControlAccessor
     */
    onTouched: boolean;
    isDisabled: boolean;
    onChange: (_: any) => void;
    onTouch: () => void;
    constructor();
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
     * @param value
     */
    setOptions(): void;
    concatValueInput: () => void;
    setAccess(): void;
    changeNavMonth(num: number): void;
    canChangeNavMonth(num: number): any;
    makeHeader(): void;
    getDimensions(date: any): void;
    makeGrid(year: any, month: any): void;
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
    simulateClick: (date: string) => any;
    setStartTime(time: any): void;
    setEndTime(time: any): void;
    handleTimeChange(time: any, moment: any, mode: string): void;
}
