import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFunnyDatepickerComponent } from './ngx-funny-datepicker.component';

describe('NgxFunnyDatepickerComponent', () => {
  let component: NgxFunnyDatepickerComponent;
  let fixture: ComponentFixture<NgxFunnyDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxFunnyDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxFunnyDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
