import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/cir-admin-login', pathMatch: 'full' },
  {
    path: 'project-list',
    loadComponent: () => import('./pages/project-list/project-list.component').then(m => m.ProjectListComponent)
  },
  {
    path: 'cir-admin',
    loadChildren: () => import('./modules/cir-admin/cir-admin.module').then(m => m.CirAdminModule)
  },
  {
    path: 'cir-user',
    loadChildren: () => import('./modules/cir-user/cir-user.module').then(m => m.CirUserModule)
  },
  {
    path: 'acr-admin',
    loadChildren: () => import('./modules/acr-admin/acr-admin.module').then(m => m.AcrAdminModule)
  },
  {
    path: 'acr-user',
    loadChildren: () => import('./modules/acr-user/acr-user.module').then(m => m.AcrUserModule)
  },
  // Centralized Auth Module
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  }
];
