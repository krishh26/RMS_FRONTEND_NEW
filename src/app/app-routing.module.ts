import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/cir-admin-login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'cir-admin',
    loadChildren: () => import('./cir-admin/cir-admin.module').then(m => m.CirAdminModule)
  },
  {
    path: 'cir-user',
    loadChildren: () => import('./cir-user/cir-user.module').then(m => m.CirUserModule)
  },
  {
    path: 'acr-admin',
    loadChildren: () => import('./acr-admin/acr-admin.module').then(m => m.AcrAdminModule)
  },
  {
    path: 'acr-user',
    loadChildren: () => import('./acr-user/acr-user.module').then(m => m.AcrUserModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
