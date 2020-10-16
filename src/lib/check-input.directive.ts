import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[libCheckInput]'
})
export class CheckInputDirective {
  private tmpValue: any;
  inputElement: ElementRef;

  constructor(el: ElementRef) {
    this.inputElement = el;
  }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    this.tmpValue = (this.inputElement.nativeElement.value.length > 2) ? 1 : this.inputElement.nativeElement.value;
    this.integerOnly(event);
  }

  @HostListener('keyup', ['$event']) onKeyUp(event) {
    this.checkLength(event);
  }

  checkLength(event) {
    const value = this.inputElement.nativeElement.value;
    if (!isNaN(value)) {
      if (value.toString().length > 2) {
        this.inputElement.nativeElement.value = this.tmpValue
        event.preventDefault();
      }
    } else {
      event.preventDefault();
    }
  }

  integerOnly(event) {


    const e = event as KeyboardEvent;
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
