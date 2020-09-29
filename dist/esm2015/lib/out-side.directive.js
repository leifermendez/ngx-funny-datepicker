import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
export class OutSideDirective {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.clickOutside = new EventEmitter();
    }
    onClick(target) {
        const classElement = target.classList || [];
        if (!Array.from(classElement).includes('omit-trigger-outside')) {
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
OutSideDirective.ctorParameters = () => [
    { type: ElementRef }
];
OutSideDirective.propDecorators = {
    clickOutside: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['document:click', ['$event.target'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0LXNpZGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL0xlaWZlci9XZWJzdG9ybVByb2plY3RzL2V4YW1wbGUtbGliL3Byb2plY3RzL25neC1mdW5ueS1kYXRlcGlja2VyL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9vdXQtc2lkZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFLeEYsTUFBTSxPQUFPLGdCQUFnQjtJQUkzQixZQUFvQixVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBRmhDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztJQUdsRCxDQUFDO0lBR00sT0FBTyxDQUFDLE1BQU07UUFDbkIsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLEVBQUU7WUFDOUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDMUI7U0FDRjtJQUVILENBQUM7OztZQXBCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjthQUMzQjs7O1lBSmtCLFVBQVU7OzsyQkFPMUIsTUFBTTtzQkFLTixZQUFZLFNBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxlQUFlLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbGlja091dHNpZGVdJ1xufSlcbmV4cG9ydCBjbGFzcyBPdXRTaWRlRGlyZWN0aXZlIHtcblxuICBAT3V0cHV0KCkgY2xpY2tPdXRzaWRlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudC50YXJnZXQnXSlcbiAgcHVibGljIG9uQ2xpY2sodGFyZ2V0KSB7XG4gICAgY29uc3QgY2xhc3NFbGVtZW50ID0gdGFyZ2V0LmNsYXNzTGlzdCB8fCBbXTtcbiAgICBpZiAoIUFycmF5LmZyb20oY2xhc3NFbGVtZW50KS5pbmNsdWRlcygnb21pdC10cmlnZ2VyLW91dHNpZGUnKSkge1xuICAgICAgY29uc3QgY2xpY2tlZEluc2lkZSA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKHRhcmdldCk7XG4gICAgICBpZiAoIWNsaWNrZWRJbnNpZGUpIHtcbiAgICAgICAgdGhpcy5jbGlja091dHNpZGUuZW1pdCgpO1xuICAgICAgfVxuICAgIH1cblxuICB9XG59XG4iXX0=