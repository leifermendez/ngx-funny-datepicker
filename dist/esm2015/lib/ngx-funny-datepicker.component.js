import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
export class NgxFunnyDatepickerComponent {
    constructor() {
        this.valueDate = new EventEmitter();
        this.startDate = moment();
        this.locale = 'en';
        this.rangeLabel = 'Range';
        this.timeLabel = 'Time';
        this.clearLabel = 'Clear';
        this.emitValue = (data) => this.valueDate.emit(data);
    }
    ngOnInit() {
    }
}
NgxFunnyDatepickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-funny-datepicker-dummy',
                template: `
    Please use ngx-funny-datepicker
  `
            },] }
];
NgxFunnyDatepickerComponent.ctorParameters = () => [];
NgxFunnyDatepickerComponent.propDecorators = {
    valueDate: [{ type: Output }],
    isRange: [{ type: Input }],
    hasTime: [{ type: Input }],
    startDate: [{ type: Input }],
    endDate: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    locale: [{ type: Input }],
    rangeLabel: [{ type: Input }],
    timeLabel: [{ type: Input }],
    clearLabel: [{ type: Input }],
    classInput: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWZ1bm55LWRhdGVwaWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL0xlaWZlci9XZWJzdG9ybVByb2plY3RzL2V4YW1wbGUtbGliL3Byb2plY3RzL25neC1mdW5ueS1kYXRlcGlja2VyL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtZnVubnktZGF0ZXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMvRSxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQVNqQyxNQUFNLE9BQU8sMkJBQTJCO0lBY3RDO1FBYlUsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFHckMsY0FBUyxHQUFRLE1BQU0sRUFBRSxDQUFDO1FBSTFCLFdBQU0sR0FBRyxJQUFJLENBQUM7UUFDZCxlQUFVLEdBQUcsT0FBTyxDQUFDO1FBQ3JCLGNBQVMsR0FBRyxNQUFNLENBQUM7UUFDbkIsZUFBVSxHQUFHLE9BQU8sQ0FBQztRQVM5QixjQUFTLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBTGhELENBQUM7SUFFRCxRQUFRO0lBQ1IsQ0FBQzs7O1lBekJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsNEJBQTRCO2dCQUN0QyxRQUFRLEVBQUU7O0dBRVQ7YUFFRjs7Ozt3QkFFRSxNQUFNO3NCQUNOLEtBQUs7c0JBQ0wsS0FBSzt3QkFDTCxLQUFLO3NCQUNMLEtBQUs7c0JBQ0wsS0FBSztzQkFDTCxLQUFLO3FCQUNMLEtBQUs7eUJBQ0wsS0FBSzt3QkFDTCxLQUFLO3lCQUNMLEtBQUs7eUJBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZnVubnktZGF0ZXBpY2tlci1kdW1teScsXG4gIHRlbXBsYXRlOiBgXG4gICAgUGxlYXNlIHVzZSBuZ3gtZnVubnktZGF0ZXBpY2tlclxuICBgLFxuICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIE5neEZ1bm55RGF0ZXBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBPdXRwdXQoKSB2YWx1ZURhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQElucHV0KCkgaXNSYW5nZTogYm9vbGVhbjtcbiAgQElucHV0KCkgaGFzVGltZTogYm9vbGVhbjtcbiAgQElucHV0KCkgc3RhcnREYXRlOiBhbnkgPSBtb21lbnQoKTtcbiAgQElucHV0KCkgZW5kRGF0ZTogYW55O1xuICBASW5wdXQoKSBtaW5EYXRlOiBhbnk7XG4gIEBJbnB1dCgpIG1heERhdGU6IGFueTtcbiAgQElucHV0KCkgbG9jYWxlID0gJ2VuJztcbiAgQElucHV0KCkgcmFuZ2VMYWJlbCA9ICdSYW5nZSc7XG4gIEBJbnB1dCgpIHRpbWVMYWJlbCA9ICdUaW1lJztcbiAgQElucHV0KCkgY2xlYXJMYWJlbCA9ICdDbGVhcic7XG4gIEBJbnB1dCgpIGNsYXNzSW5wdXQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbiAgZW1pdFZhbHVlID0gKGRhdGEpID0+IHRoaXMudmFsdWVEYXRlLmVtaXQoZGF0YSk7XG5cbn1cbiJdfQ==