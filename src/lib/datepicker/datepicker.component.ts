import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment_ from 'moment';
const moment = moment_;

@Component({
  selector: 'ngx-funny-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent implements OnInit, ControlValueAccessor {
  @Input() value: any = '';
  // @ts-ignore
  @ViewChild('startTimePicker') startTimePicker: ElementRef;
  // @ts-ignore
  @ViewChild('endTimePicker') endTimePicker: ElementRef;
  @Input() isRange: boolean;
  @Input() hasTime: boolean;
  @Input() startDate: any;
  @Input() endDate: any;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() classInput: string;
  @Input() locale = 'en';
  @Input() rangeLabel = 'Range';
  @Input() timeLabel = 'Time';
  @Input() clearLabel = 'Clear';
  @Output() emitSelected = new EventEmitter<any>();
  isOpen: boolean;
  navDate: any;
  weekDaysHeaderArr: Array<string> = [];
  gridArr: any = {};
  selectedDate: any;
  canAccessPrevious = true;
  canAccessNext = true;
  todayDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  startDay: any;
  endDay: any;
  mode = 'end';
  initialEmptyCells: number;
  lastEmptyCells: number;
  arrayLength: number;
  currentMonth: number;
  currentYear: number;
  selected: any;
  startTime: any;
  endTime: any;
  isInvalid = false;
  includeEndDate: boolean;
  includeTime: boolean;
  formatInputDate = 'D MMM, YYYY';
  /**
   * ControlAccessor
   */
  onTouched: boolean;
  isDisabled: boolean;
  onChange = (_: any) => { };
  onTouch = () => {
    this.onTouched = true
  };

  constructor() {
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
    this.isInvalid = !(this.value.length)
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

  writeValue(value: any): void {
    if (value) {
      this.value = value || '';
    } else {
      this.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState(isDisabled: boolean): void {
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

  concatValueInput = () => {
    const concatValue = [
      this.startDate.format(this.formatInputDate),
      (this.endDate) ? '  -  ' : '',
      (this.endDate) ? this.endDate.format(this.formatInputDate) : ''
    ];
    this.value = concatValue.join('');
    this.isInvalid = !(this.value.length);

  }

  setAccess() {
    this.canAccessPrevious = this.canChangeNavMonth(-1);
    this.canAccessNext = this.canChangeNavMonth(1);
  }

  changeNavMonth(num: number) {
    if (this.canChangeNavMonth(num)) {
      this.navDate.add(num, 'month');
      this.currentMonth = this.navDate.month();
      this.currentYear = this.navDate.year();
      this.makeGrid(this.currentYear, this.currentMonth);
    }
  }

  canChangeNavMonth(num: number) {
    const clonedDate = moment(this.navDate);
    return this.canChangeNavMonthLogic(num, clonedDate);
  }

  makeHeader() {
    const weekDaysArr: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArr.forEach(day => this.weekDaysHeaderArr.push(moment().weekday(day).format('ddd')));
  }

  getDimensions(date: any) {
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
        const obj: any = {};
        if (i < this.initialEmptyCells || i > this.initialEmptyCells + this.navDate.daysInMonth() - 1) {
          obj.value = 0;
          obj.available = false;
          obj.isToday = false;
        } else {
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

  isAvailable(num: number): boolean {
    const dateToCheck = this.dateFromNum(num, this.navDate);
    return this.isAvailableLogic(dateToCheck);
  }

  isToday(num: number, month: number, year: number): boolean {
    const dateToCheck = moment(this.dateFromDayAndMonthAndYear(num, month, year));
    return dateToCheck.isSame(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }));
  }

  dateFromNum(num: number, referenceDate: any): any {
    const returnDate = moment(referenceDate);
    return returnDate.date(num);
  }

  reFormatInput = () => {
    this.concatValueInput();
    this.formatInputDate = (this.includeTime) ? 'D MMM, YYYY h:mm A' : 'D MMM, YYYY';
  }

  selectDay(day: any) {
    if (day.available) {
      this.selectedDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
      if (this.includeEndDate) {
        const currDate = this.dateFromDayAndMonthAndYear(day.value, day.month, day.year);
        switch (this.mode) {
          case 'end':
            if (currDate.isSame(moment(this.startDate).startOf('day'))) {
              this.mode = 'start';
            } else if (currDate.isSameOrBefore(this.startDate)) {
              this.endDay = this.startDay;
              this.startDay = day;
              this.mode = 'start';
            } else {
              this.endDay = day;
            }
            break;
          case 'start':
            if (currDate.isSame(moment(this.endDate).startOf('day'))) {
              this.mode = 'end';
            } else if (currDate.isSameOrAfter(this.endDate)) {
              this.startDay = this.endDay;
              this.endDay = day;
              this.mode = 'end';
            } else {
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
      } else {
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

  generateDate(day: any, date: any) {
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
          } else if (month == this.endDay.month && year == this.endDay.year) {
            for (let i = 0; i <= end; i++) {
              days[i].inRange = true;
            }
            for (let i = end + 1; i < endMonthLength; i++) {
              days[i].inRange = false;
            }
          } else if ((month > this.startDay.month || year > this.startDay.year) && (month < this.endDay.month || year < this.endDay.year)) {
            days.forEach(day => day.inRange = true);
          }
        });
      });
    } else {
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

  isAvailableLogic(dateToCheck: any) {
    if (this.minDate || this.maxDate) {
      return !(dateToCheck.isBefore(this.minDate) || dateToCheck.isAfter(this.maxDate));
    } else {
      return !dateToCheck.isBefore(moment(), 'day');
    }
  }

  canChangeNavMonthLogic(num, currentDate) {
    currentDate.add(num, 'month');
    const minDate = this.minDate ? this.minDate : moment().add(-1, 'month');
    const maxDate = this.maxDate ? this.maxDate : moment().add(1, 'year');
    return currentDate.isBetween(minDate, maxDate);
  }

  toggleCalendar(): any {
    this.isOpen = !this.isOpen;
  }

  openCalendar(): any {
    this.isOpen = true;
    this.onTouch();
  }

  closeCalendar(): any {
    this.isOpen = false;
    this.emitSelected.emit(this.selected);
  }

  changeMode(mode: string) {
    this.mode = mode;
    this.onTouch()
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

  setTime(moment, hour: number = 0, minute: number = 0) {
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
    } else {
      const tmpStartDate = this.startDate.clone();
      const nextDay = tmpStartDate.add(2, 'days').format(`YYYY-${tmpStartDate.format('M') - 1}-D`);
      this.simulateClick(nextDay);
    }

  }

  simulateClick = (date: string) => {
    try {
      setTimeout(() => {
        const getDayNext = document.querySelector(`.calendar-day-not-range-${date} > button`) as any;
        if (getDayNext) {
          getDayNext.click();
        }
      }, 50);
    } catch (e) {
      return null;
    }
  }

  setStartTime(time) {
    this.startTime = time;
  }

  setEndTime(time) {
    this.endTime = time;
  }

  // tslint:disable-next-line:no-shadowed-variable
  handleTimeChange(time: any, moment: any, mode: string) {
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
        } else if (time < 12) {
          moment
            = isAm ? this.setTime(moment, Number(time)) :
              this.setTime(moment, Number(time) + 12);
        } else {
          moment
            = isAm ? this.setTime(moment, Number(time[0]), Number(last)) :
              this.setTime(moment, Number(time[0]) + 12, Number(last));
        }
        break;
      case 3:
        if (lastTwo >= 60) {
          this.isInvalid = true;
          break;
        } else {
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
    console.log('--', this.isInvalid)
    this.emitSelected.emit(this.selected);
    if (mode === 'start') {
      this.startDate = moment;
      this.startTimePicker.nativeElement.blur();
    } else {
      this.endDate = moment;
      this.endTimePicker.nativeElement.blur();
    }
  }

}
