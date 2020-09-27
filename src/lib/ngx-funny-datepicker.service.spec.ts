import { TestBed } from '@angular/core/testing';

import { NgxFunnyDatepickerService } from './ngx-funny-datepicker.service';

describe('NgxFunnyDatepickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxFunnyDatepickerService = TestBed.get(NgxFunnyDatepickerService);
    expect(service).toBeTruthy();
  });
});
