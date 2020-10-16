import { Directive, ElementRef, HostListener } from '@angular/core';
export class CheckInputDirective {
    constructor(el) {
        this.inputElement = el;
    }
    onKeyPress(event) {
        this.tmpValue = (this.inputElement.nativeElement.value.length > 2) ? 1 : this.inputElement.nativeElement.value;
        this.integerOnly(event);
    }
    onKeyUp(event) {
        this.checkLength(event);
    }
    checkLength(event) {
        const value = this.inputElement.nativeElement.value;
        if (!isNaN(value)) {
            if (value.toString().length > 2) {
                this.inputElement.nativeElement.value = this.tmpValue;
                event.preventDefault();
            }
        }
        else {
            event.preventDefault();
        }
    }
    integerOnly(event) {
        const e = event;
        if (e.key === 'Tab' || e.key === 'TAB') {
            return;
        }
        if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode === 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode === 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+V
            (e.keyCode === 86 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode === 88 && e.ctrlKey === true)) {
            // let it happen, don't do anything
            return;
        }
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1) {
            e.preventDefault();
        }
    }
}
CheckInputDirective.decorators = [
    { type: Directive, args: [{
                selector: '[libCheckInput]'
            },] }
];
CheckInputDirective.ctorParameters = () => [
    { type: ElementRef }
];
CheckInputDirective.propDecorators = {
    onKeyPress: [{ type: HostListener, args: ['keypress', ['$event'],] }],
    onKeyUp: [{ type: HostListener, args: ['keyup', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2staW5wdXQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL0xlaWZlci9XZWJzdG9ybVByb2plY3RzL2V4YW1wbGUtbGliL3Byb2plY3RzL25neC1mdW5ueS1kYXRlcGlja2VyL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9jaGVjay1pbnB1dC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBSzNFLE1BQU0sT0FBTyxtQkFBbUI7SUFJOUIsWUFBWSxFQUFjO1FBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFcUMsVUFBVSxDQUFDLEtBQUs7UUFDcEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQy9HLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVrQyxPQUFPLENBQUMsS0FBSztRQUM5QyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBSztRQUNmLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztRQUNwRCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pCLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFBO2dCQUNyRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDeEI7U0FDRjthQUFNO1lBQ0wsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFLO1FBR2YsTUFBTSxDQUFDLEdBQUcsS0FBc0IsQ0FBQztRQUNqQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssS0FBSyxFQUFFO1lBQ3RDLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25ELGdCQUFnQjtZQUNoQixDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDO1lBQ3hDLGdCQUFnQjtZQUNoQixDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDO1lBQ3hDLGdCQUFnQjtZQUNoQixDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDO1lBQ3hDLGdCQUFnQjtZQUNoQixDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDMUMsbUNBQW1DO1lBQ25DLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQzVFLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7OztZQXRERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjthQUM1Qjs7O1lBSm1CLFVBQVU7Ozt5QkFhM0IsWUFBWSxTQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQztzQkFLbkMsWUFBWSxTQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbGliQ2hlY2tJbnB1dF0nXG59KVxuZXhwb3J0IGNsYXNzIENoZWNrSW5wdXREaXJlY3RpdmUge1xuICBwcml2YXRlIHRtcFZhbHVlOiBhbnk7XG4gIGlucHV0RWxlbWVudDogRWxlbWVudFJlZjtcblxuICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZikge1xuICAgIHRoaXMuaW5wdXRFbGVtZW50ID0gZWw7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlwcmVzcycsIFsnJGV2ZW50J10pIG9uS2V5UHJlc3MoZXZlbnQpIHtcbiAgICB0aGlzLnRtcFZhbHVlID0gKHRoaXMuaW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWUubGVuZ3RoID4gMikgPyAxIDogdGhpcy5pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICB0aGlzLmludGVnZXJPbmx5KGV2ZW50KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2tleXVwJywgWyckZXZlbnQnXSkgb25LZXlVcChldmVudCkge1xuICAgIHRoaXMuY2hlY2tMZW5ndGgoZXZlbnQpO1xuICB9XG5cbiAgY2hlY2tMZW5ndGgoZXZlbnQpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuaW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gICAgaWYgKCFpc05hTih2YWx1ZSkpIHtcbiAgICAgIGlmICh2YWx1ZS50b1N0cmluZygpLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZSA9IHRoaXMudG1wVmFsdWVcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBpbnRlZ2VyT25seShldmVudCkge1xuXG5cbiAgICBjb25zdCBlID0gZXZlbnQgYXMgS2V5Ym9hcmRFdmVudDtcbiAgICBpZiAoZS5rZXkgPT09ICdUYWInIHx8IGUua2V5ID09PSAnVEFCJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoWzQ2LCA4LCA5LCAyNywgMTMsIDExMF0uaW5kZXhPZihlLmtleUNvZGUpICE9PSAtMSB8fFxuICAgICAgLy8gQWxsb3c6IEN0cmwrQVxuICAgICAgKGUua2V5Q29kZSA9PT0gNjUgJiYgZS5jdHJsS2V5ID09PSB0cnVlKSB8fFxuICAgICAgLy8gQWxsb3c6IEN0cmwrQ1xuICAgICAgKGUua2V5Q29kZSA9PT0gNjcgJiYgZS5jdHJsS2V5ID09PSB0cnVlKSB8fFxuICAgICAgLy8gQWxsb3c6IEN0cmwrVlxuICAgICAgKGUua2V5Q29kZSA9PT0gODYgJiYgZS5jdHJsS2V5ID09PSB0cnVlKSB8fFxuICAgICAgLy8gQWxsb3c6IEN0cmwrWFxuICAgICAgKGUua2V5Q29kZSA9PT0gODggJiYgZS5jdHJsS2V5ID09PSB0cnVlKSkge1xuICAgICAgLy8gbGV0IGl0IGhhcHBlbiwgZG9uJ3QgZG8gYW55dGhpbmdcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKFsnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknLCAnMCddLmluZGV4T2YoZS5rZXkpID09PSAtMSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG5cbn1cbiJdfQ==