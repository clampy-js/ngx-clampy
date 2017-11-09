import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClampDirective } from './clamp.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ClampDirective],
  exports: [ClampDirective]
})
export class ClampyModule { }
