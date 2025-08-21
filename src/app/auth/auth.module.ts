import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CirAdminLoginComponent } from './cir-admin-login/cir-admin-login.component';
import { CirUserLoginComponent } from './cir-user-login/cir-user-login.component';
import { AcrAdminLoginComponent } from './acr-admin-login/acr-admin-login.component';
import { AcrUserLoginComponent } from './acr-user-login/acr-user-login.component';

const routes: Routes = [
  { path: 'cir-admin-login', component: CirAdminLoginComponent },
  { path: 'cir-user-login', component: CirUserLoginComponent },
  { path: 'acr-admin-login', component: AcrAdminLoginComponent },
  { path: 'acr-user-login', component: AcrUserLoginComponent }
];

@NgModule({
  declarations: [
    CirAdminLoginComponent,
    CirUserLoginComponent,
    AcrAdminLoginComponent,
    AcrUserLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
