import { NgModule } from '@angular/core';
import { NgxFunnyDatepickerComponent } from './ngx-funny-datepicker.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OutSideDirective } from './out-side.directive';
import { CheckInputDirective } from './check-input.directive';
export class NgxFunnyDatepickerModule {
}
NgxFunnyDatepickerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgxFunnyDatepickerComponent, DatepickerComponent, OutSideDirective, CheckInputDirective],
                imports: [
                    CommonModule,
                    FormsModule
                ],
                exports: [DatepickerComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWZ1bm55LWRhdGVwaWNrZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL0xlaWZlci9XZWJzdG9ybVByb2plY3RzL2V4YW1wbGUtbGliL3Byb2plY3RzL25neC1mdW5ueS1kYXRlcGlja2VyL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtZnVubnktZGF0ZXBpY2tlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBWTlELE1BQU0sT0FBTyx3QkFBd0I7OztZQVJwQyxRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsMkJBQTJCLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUM7Z0JBQ3ZHLE9BQU8sRUFBRTtvQkFDUCxZQUFZO29CQUNaLFdBQVc7aUJBQ1o7Z0JBQ0QsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7YUFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4RnVubnlEYXRlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZnVubnktZGF0ZXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGF0ZXBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4vZGF0ZXBpY2tlci9kYXRlcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBPdXRTaWRlRGlyZWN0aXZlIH0gZnJvbSAnLi9vdXQtc2lkZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2hlY2tJbnB1dERpcmVjdGl2ZSB9IGZyb20gJy4vY2hlY2staW5wdXQuZGlyZWN0aXZlJztcblxuXG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW05neEZ1bm55RGF0ZXBpY2tlckNvbXBvbmVudCwgRGF0ZXBpY2tlckNvbXBvbmVudCwgT3V0U2lkZURpcmVjdGl2ZSwgQ2hlY2tJbnB1dERpcmVjdGl2ZV0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgRm9ybXNNb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW0RhdGVwaWNrZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5neEZ1bm55RGF0ZXBpY2tlck1vZHVsZSB7IH1cbiJdfQ==