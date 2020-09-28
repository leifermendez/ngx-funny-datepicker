import { EventEmitter, OnInit } from '@angular/core';
export declare class NgxFunnyDatepickerComponent implements OnInit {
    valueDate: EventEmitter<any>;
    isRange: boolean;
    hasTime: boolean;
    startDate: any;
    endDate: any;
    maxDate: any;
    minDate: any;
    constructor();
    ngOnInit(): void;
    emitValue: (data: any) => void;
}
