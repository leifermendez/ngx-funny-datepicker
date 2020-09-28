import { ElementRef, EventEmitter } from '@angular/core';
export declare class OutSideDirective {
    private elementRef;
    clickOutside: EventEmitter<void>;
    constructor(elementRef: ElementRef);
    onClick(target: any): void;
}
