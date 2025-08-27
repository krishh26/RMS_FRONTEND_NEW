import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AcrJobListComponent } from './acr-job-list/acr-job-list.component';
import { AcrProjectListComponent } from './acr-project-list/acr-project-list.component';
import { AcrProjectListPublicComponent } from './acr-project-list-public/acr-project-list-public.component';
import { AcrUserHeaderComponent } from './header/acr-user-header.component';
import { AcrUserLayoutComponent } from './layout/acr-user-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AcrUserLayoutComponent,
    children: [
      { path: 'job-list', component: AcrJobListComponent },
      { path: 'project-list', component: AcrProjectListComponent },
      { path: 'project-list-public', component: AcrProjectListPublicComponent },
      { path: '', redirectTo: 'job-list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    AcrJobListComponent,
    AcrProjectListComponent,
    AcrProjectListPublicComponent,
    AcrUserHeaderComponent,
    AcrUserLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AcrUserModule { }
