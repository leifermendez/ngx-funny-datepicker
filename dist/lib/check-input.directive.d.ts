import { ElementRef } from '@angular/core';
export declare class CheckInputDirective {
    private tmpValue;
    inputElement: ElementRef;
    constructor(el: ElementRef);
    onKeyPress(event: any): void;
    onKeyUp(event: any): void;
    checkLength(event: any): void;
    integerOnly(event: any): void;
}
