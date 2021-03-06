import { NgModule } from '@angular/core';
import { NgxFunnyDatepickerComponent } from './ngx-funny-datepicker.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OutSideDirective } from './out-side.directive';
import { CheckInputDirective } from './check-input.directive';



@NgModule({
  declarations: [NgxFunnyDatepickerComponent, DatepickerComponent, OutSideDirective, CheckInputDirective],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [DatepickerComponent]
})
export class NgxFunnyDatepickerModule { }
