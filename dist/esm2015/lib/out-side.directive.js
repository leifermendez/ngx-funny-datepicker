/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
export class OutSideDirective {
    /**
     * @param {?} elementRef
     */
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.clickOutside = new EventEmitter();
    }
    /**
     * @param {?} target
     * @return {?}
     */
    onClick(target) {
        /** @type {?} */
        const classElement = target.classList || [];
        if (!Array.from(classElement).includes('omit-trigger-outside')) {
            /** @type {?} */
            const clickedInside = this.elementRef.nativeElement.contains(target);
            if (!clickedInside) {
                this.clickOutside.emit();
            }
        }
    }
}
OutSideDirective.decorators = [
    { type: Directive, args: [{
                selector: '[clickOutside]'
            },] }
];
/** @nocollapse */
OutSideDirective.ctorParameters = () => [
    { type: ElementRef }
];
OutSideDirective.propDecorators = {
    clickOutside: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['document:click', ['$event.target'],] }]
};
if (false) {
    /** @type {?} */
    OutSideDirective.prototype.clickOutside;
    /**
     * @type {?}
     * @private
     */
    OutSideDirective.prototype.elementRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0LXNpZGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWZ1bm55LWRhdGVwaWNrZXIvIiwic291cmNlcyI6WyJsaWIvb3V0LXNpZGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUt4RixNQUFNLE9BQU8sZ0JBQWdCOzs7O0lBSTNCLFlBQW9CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFGaEMsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO0lBR2xELENBQUM7Ozs7O0lBR00sT0FBTyxDQUFDLE1BQU07O2NBQ2IsWUFBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksRUFBRTtRQUMzQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRTs7a0JBQ3hELGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ3BFLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDMUI7U0FDRjtJQUVILENBQUM7OztZQXBCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjthQUMzQjs7OztZQUprQixVQUFVOzs7MkJBTzFCLE1BQU07c0JBS04sWUFBWSxTQUFDLGdCQUFnQixFQUFFLENBQUMsZUFBZSxDQUFDOzs7O0lBTGpELHdDQUFrRDs7Ozs7SUFFdEMsc0NBQThCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBPdXRwdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xpY2tPdXRzaWRlXSdcbn0pXG5leHBvcnQgY2xhc3MgT3V0U2lkZURpcmVjdGl2ZSB7XG5cbiAgQE91dHB1dCgpIGNsaWNrT3V0c2lkZSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmNsaWNrJywgWyckZXZlbnQudGFyZ2V0J10pXG4gIHB1YmxpYyBvbkNsaWNrKHRhcmdldCkge1xuICAgIGNvbnN0IGNsYXNzRWxlbWVudCA9IHRhcmdldC5jbGFzc0xpc3QgfHwgW107XG4gICAgaWYgKCFBcnJheS5mcm9tKGNsYXNzRWxlbWVudCkuaW5jbHVkZXMoJ29taXQtdHJpZ2dlci1vdXRzaWRlJykpIHtcbiAgICAgIGNvbnN0IGNsaWNrZWRJbnNpZGUgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyh0YXJnZXQpO1xuICAgICAgaWYgKCFjbGlja2VkSW5zaWRlKSB7XG4gICAgICAgIHRoaXMuY2xpY2tPdXRzaWRlLmVtaXQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxufVxuIl19