import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NoRecordFoundComponent } from './common/no-record-found/no-record-found.component';
import { ComingSoonComponent } from './common/coming-soon/coming-soon.component';
import { CustomValidation } from './constant/custome-validation';
import { ClickOutsideDirective } from './directives/click-outside.directive';

@NgModule({
  declarations: [
    NoRecordFoundComponent,
    ComingSoonComponent,
    ClickOutsideDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NoRecordFoundComponent,
    ComingSoonComponent,
    ClickOutsideDirective
  ],
  providers: [
    CustomValidation
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
