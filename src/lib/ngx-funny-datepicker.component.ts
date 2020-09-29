import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'ngx-funny-datepicker-dummy',
  template: `
    Please use ngx-funny-datepicker
  `,
  styles: []
})
export class NgxFunnyDatepickerComponent implements OnInit {
  @Output() valueDate = new EventEmitter<any>();
  @Input() isRange: boolean;
  @Input() hasTime: boolean;
  @Input() startDate: any = moment();
  @Input() endDate: any;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() locale = 'en';
  @Input() rangeLabel = 'Range';
  @Input() timeLabel = 'Time';
  @Input() clearLabel = 'Clear';
  @Input() classInput: string;

  constructor() {
  }

  ngOnInit() {
  }

  emitValue = (data) => this.valueDate.emit(data);

}
