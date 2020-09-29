import { EventEmitter, OnInit } from '@angular/core';
export declare class NgxFunnyDatepickerComponent implements OnInit {
    valueDate: EventEmitter<any>;
    isRange: boolean;
    hasTime: boolean;
    startDate: any;
    endDate: any;
    minDate: any;
    maxDate: any;
    locale: string;
    rangeLabel: string;
    timeLabel: string;
    clearLabel: string;
    classInput: string;
    constructor();
    ngOnInit(): void;
    emitValue: (data: any) => void;
}
