import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'ngx-funny-datepicker',
  template: `
    <funny-datepicker-single
      [isRange]="isRange"
      [hasTime]="hasTime"
      [startDate]="startDate"
      [endDate]="endDate"
      [maxDate]="maxDate"
      [minDate]="minDate"
      (emitSelected)="emitValue($event)"
    ></funny-datepicker-single>

  `,
  styles: []
})
export class NgxFunnyDatepickerComponent implements OnInit {
  @Output() valueDate = new EventEmitter<any>();
  isRange = true;
  hasTime = true;
  startDate: any;
  endDate: any;
  maxDate: any;
  minDate: any;

  constructor() {
  }

  ngOnInit() {
  }

  emitValue = (data) => this.valueDate.emit(data);

}
