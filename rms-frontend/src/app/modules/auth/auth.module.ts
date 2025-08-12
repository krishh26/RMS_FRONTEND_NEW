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
  },
  {
    path: 'cir-user-login',
    loadComponent: () => import('./components/cir-user-login/cir-user-login.component').then(m => m.CirUserLoginComponent)
  },
  {
    path: 'acr-admin-login',
    loadComponent: () => import('./components/acr-admin-login/acr-admin-login.component').then(m => m.AcrAdminLoginComponent)
  },
  {
    path: 'acr-user-login',
    loadComponent: () => import('./components/acr-user-login/acr-user-login.component').then(m => m.AcrUserLoginComponent)
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
