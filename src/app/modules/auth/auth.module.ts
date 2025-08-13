import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'cir-admin-login',
    pathMatch: 'full'
  },
  {
    path: 'cir-admin-login',
    loadComponent: () => import('./components/cir-admin-login/cir-admin-login.component').then(m => m.CirAdminLoginComponent)
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
