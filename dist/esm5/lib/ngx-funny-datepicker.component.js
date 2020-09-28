/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Output } from '@angular/core';
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
export { NgxFunnyDatepickerComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWZ1bm55LWRhdGVwaWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWZ1bm55LWRhdGVwaWNrZXIvIiwic291cmNlcyI6WyJsaWIvbmd4LWZ1bm55LWRhdGVwaWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBVSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFdEU7SUF5QkU7UUFBQSxpQkFDQztRQVRTLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzlDLFlBQU8sR0FBRyxJQUFJLENBQUM7UUFDZixZQUFPLEdBQUcsSUFBSSxDQUFDO1FBWWYsY0FBUzs7OztRQUFHLFVBQUMsSUFBSSxJQUFLLE9BQUEsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQXpCLENBQXlCLEVBQUM7SUFMaEQsQ0FBQzs7OztJQUVELDhDQUFROzs7SUFBUjtJQUNBLENBQUM7O2dCQTdCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsUUFBUSxFQUFFLHFTQVdUO2lCQUVGOzs7Ozs0QkFFRSxNQUFNOztJQWdCVCxrQ0FBQztDQUFBLEFBakNELElBaUNDO1NBakJZLDJCQUEyQjs7O0lBQ3RDLGdEQUE4Qzs7SUFDOUMsOENBQWU7O0lBQ2YsOENBQWU7O0lBQ2YsZ0RBQWU7O0lBQ2YsOENBQWE7O0lBQ2IsOENBQWE7O0lBQ2IsOENBQWE7O0lBUWIsZ0RBQWdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgT25Jbml0LCBPdXRwdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtZnVubnktZGF0ZXBpY2tlcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGZ1bm55LWRhdGVwaWNrZXItc2luZ2xlXG4gICAgICBbaXNSYW5nZV09XCJpc1JhbmdlXCJcbiAgICAgIFtoYXNUaW1lXT1cImhhc1RpbWVcIlxuICAgICAgW3N0YXJ0RGF0ZV09XCJzdGFydERhdGVcIlxuICAgICAgW2VuZERhdGVdPVwiZW5kRGF0ZVwiXG4gICAgICBbbWF4RGF0ZV09XCJtYXhEYXRlXCJcbiAgICAgIFttaW5EYXRlXT1cIm1pbkRhdGVcIlxuICAgICAgKGVtaXRTZWxlY3RlZCk9XCJlbWl0VmFsdWUoJGV2ZW50KVwiXG4gICAgPjwvZnVubnktZGF0ZXBpY2tlci1zaW5nbGU+XG5cbiAgYCxcbiAgc3R5bGVzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hGdW5ueURhdGVwaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBAT3V0cHV0KCkgdmFsdWVEYXRlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIGlzUmFuZ2UgPSB0cnVlO1xuICBoYXNUaW1lID0gdHJ1ZTtcbiAgc3RhcnREYXRlOiBhbnk7XG4gIGVuZERhdGU6IGFueTtcbiAgbWF4RGF0ZTogYW55O1xuICBtaW5EYXRlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxuXG4gIGVtaXRWYWx1ZSA9IChkYXRhKSA9PiB0aGlzLnZhbHVlRGF0ZS5lbWl0KGRhdGEpO1xuXG59XG4iXX0=