/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
var OutSideDirective = /** @class */ (function () {
    function OutSideDirective(elementRef) {
        this.elementRef = elementRef;
        this.clickOutside = new EventEmitter();
    }
    /**
     * @param {?} target
     * @return {?}
     */
    OutSideDirective.prototype.onClick = /**
     * @param {?} target
     * @return {?}
     */
    function (target) {
        /** @type {?} */
        var classElement = target.classList || [];
        if (!Array.from(classElement).includes('omit-trigger-outside')) {
            /** @type {?} */
            var clickedInside = this.elementRef.nativeElement.contains(target);
            if (!clickedInside) {
                this.clickOutside.emit();
            }
        }
    };
    OutSideDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[clickOutside]'
                },] }
    ];
    /** @nocollapse */
    OutSideDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    OutSideDirective.propDecorators = {
        clickOutside: [{ type: Output }],
        onClick: [{ type: HostListener, args: ['document:click', ['$event.target'],] }]
    };
    return OutSideDirective;
}());
export { OutSideDirective };
if (false) {
    /** @type {?} */
    OutSideDirective.prototype.clickOutside;
    /**
     * @type {?}
     * @private
     */
    OutSideDirective.prototype.elementRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0LXNpZGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWZ1bm55LWRhdGVwaWNrZXIvIiwic291cmNlcyI6WyJsaWIvb3V0LXNpZGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV4RjtJQU9FLDBCQUFvQixVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBRmhDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztJQUdsRCxDQUFDOzs7OztJQUdNLGtDQUFPOzs7O0lBRGQsVUFDZSxNQUFNOztZQUNiLFlBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxJQUFJLEVBQUU7UUFDM0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLEVBQUU7O2dCQUN4RCxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUNwRSxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNsQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzFCO1NBQ0Y7SUFFSCxDQUFDOztnQkFwQkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7aUJBQzNCOzs7O2dCQUprQixVQUFVOzs7K0JBTzFCLE1BQU07MEJBS04sWUFBWSxTQUFDLGdCQUFnQixFQUFFLENBQUMsZUFBZSxDQUFDOztJQVduRCx1QkFBQztDQUFBLEFBckJELElBcUJDO1NBbEJZLGdCQUFnQjs7O0lBRTNCLHdDQUFrRDs7Ozs7SUFFdEMsc0NBQThCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBPdXRwdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xpY2tPdXRzaWRlXSdcbn0pXG5leHBvcnQgY2xhc3MgT3V0U2lkZURpcmVjdGl2ZSB7XG5cbiAgQE91dHB1dCgpIGNsaWNrT3V0c2lkZSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmNsaWNrJywgWyckZXZlbnQudGFyZ2V0J10pXG4gIHB1YmxpYyBvbkNsaWNrKHRhcmdldCkge1xuICAgIGNvbnN0IGNsYXNzRWxlbWVudCA9IHRhcmdldC5jbGFzc0xpc3QgfHwgW107XG4gICAgaWYgKCFBcnJheS5mcm9tKGNsYXNzRWxlbWVudCkuaW5jbHVkZXMoJ29taXQtdHJpZ2dlci1vdXRzaWRlJykpIHtcbiAgICAgIGNvbnN0IGNsaWNrZWRJbnNpZGUgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyh0YXJnZXQpO1xuICAgICAgaWYgKCFjbGlja2VkSW5zaWRlKSB7XG4gICAgICAgIHRoaXMuY2xpY2tPdXRzaWRlLmVtaXQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxufVxuIl19