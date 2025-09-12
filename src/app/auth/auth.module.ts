import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { CirAdminLoginComponent } from './cir-admin-login/cir-admin-login.component';
import { CirUserLoginComponent } from './cir-user-login/cir-user-login.component';
import { AcrAdminLoginComponent } from './acr-admin-login/acr-admin-login.component';
import { AcrUserLoginComponent } from './acr-user-login/acr-user-login.component';
import { CirRegisterComponent } from './cir-register/cir-register.component';
import { AcrRegisterComponent } from './acr-register/acr-register.component';
import { CirForgotPasswordComponent } from './cir-forgot-password/cir-forgot-password.component';
import { CirResetPasswordComponent } from './cir-reset-password/cir-reset-password.component';
import { AcrForgotPasswordComponent } from './acr-forgot-password/acr-forgot-password.component';
import { AcrResetPasswordComponent } from './acr-reset-password/acr-reset-password.component';

const routes: Routes = [
  { path: 'cir-admin-login', component: CirAdminLoginComponent },
  { path: 'cir-user-login', component: CirUserLoginComponent },
  { path: 'acr-admin-login', component: AcrAdminLoginComponent },
  { path: 'acr-user-login', component: AcrUserLoginComponent },
  { path: 'cir-register', component: CirRegisterComponent },
  { path: 'acr-register', component: AcrRegisterComponent },
  { path: 'cir-forgot-password', component: CirForgotPasswordComponent },
  { path: 'cir-reset-password/:token', component: CirResetPasswordComponent },
  { path: 'acr-forgot-password', component: AcrForgotPasswordComponent },
  { path: 'acr-reset-password/:token', component: AcrResetPasswordComponent }
];

@NgModule({
  declarations: [
    CirAdminLoginComponent,
    CirUserLoginComponent,
    AcrAdminLoginComponent,
    AcrUserLoginComponent,
    CirRegisterComponent,
    AcrRegisterComponent,
    CirForgotPasswordComponent,
    CirResetPasswordComponent,
    AcrForgotPasswordComponent,
    AcrResetPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule { }
