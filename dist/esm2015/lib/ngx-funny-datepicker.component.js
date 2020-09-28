/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Output } from '@angular/core';
export class NgxFunnyDatepickerComponent {
    constructor() {
        this.valueDate = new EventEmitter();
        this.isRange = true;
        this.hasTime = true;
        this.emitValue = (/**
         * @param {?} data
         * @return {?}
         */
        (data) => this.valueDate.emit(data));
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
NgxFunnyDatepickerComponent.decorators = [
    { type: Component, args: [{
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

  `
            }] }
];
/** @nocollapse */
NgxFunnyDatepickerComponent.ctorParameters = () => [];
NgxFunnyDatepickerComponent.propDecorators = {
    valueDate: [{ type: Output }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWZ1bm55LWRhdGVwaWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWZ1bm55LWRhdGVwaWNrZXIvIiwic291cmNlcyI6WyJsaWIvbmd4LWZ1bm55LWRhdGVwaWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBVSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFrQnRFLE1BQU0sT0FBTywyQkFBMkI7SUFTdEM7UUFSVSxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUM5QyxZQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ2YsWUFBTyxHQUFHLElBQUksQ0FBQztRQVlmLGNBQVM7Ozs7UUFBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUM7SUFMaEQsQ0FBQzs7OztJQUVELFFBQVE7SUFDUixDQUFDOzs7WUE3QkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7R0FXVDthQUVGOzs7Ozt3QkFFRSxNQUFNOzs7O0lBQVAsZ0RBQThDOztJQUM5Qyw4Q0FBZTs7SUFDZiw4Q0FBZTs7SUFDZixnREFBZTs7SUFDZiw4Q0FBYTs7SUFDYiw4Q0FBYTs7SUFDYiw4Q0FBYTs7SUFRYixnREFBZ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBPbkluaXQsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1mdW5ueS1kYXRlcGlja2VyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZnVubnktZGF0ZXBpY2tlci1zaW5nbGVcbiAgICAgIFtpc1JhbmdlXT1cImlzUmFuZ2VcIlxuICAgICAgW2hhc1RpbWVdPVwiaGFzVGltZVwiXG4gICAgICBbc3RhcnREYXRlXT1cInN0YXJ0RGF0ZVwiXG4gICAgICBbZW5kRGF0ZV09XCJlbmREYXRlXCJcbiAgICAgIFttYXhEYXRlXT1cIm1heERhdGVcIlxuICAgICAgW21pbkRhdGVdPVwibWluRGF0ZVwiXG4gICAgICAoZW1pdFNlbGVjdGVkKT1cImVtaXRWYWx1ZSgkZXZlbnQpXCJcbiAgICA+PC9mdW5ueS1kYXRlcGlja2VyLXNpbmdsZT5cblxuICBgLFxuICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIE5neEZ1bm55RGF0ZXBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBPdXRwdXQoKSB2YWx1ZURhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgaXNSYW5nZSA9IHRydWU7XG4gIGhhc1RpbWUgPSB0cnVlO1xuICBzdGFydERhdGU6IGFueTtcbiAgZW5kRGF0ZTogYW55O1xuICBtYXhEYXRlOiBhbnk7XG4gIG1pbkRhdGU6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbiAgZW1pdFZhbHVlID0gKGRhdGEpID0+IHRoaXMudmFsdWVEYXRlLmVtaXQoZGF0YSk7XG5cbn1cbiJdfQ==