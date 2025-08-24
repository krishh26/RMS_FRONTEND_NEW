import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AcrJobListComponent } from './acr-job-list/acr-job-list.component';
import { AcrProjectListComponent } from './acr-project-list/acr-project-list.component';
import { AcrProjectListPublicComponent } from './acr-project-list-public/acr-project-list-public.component';

const routes: Routes = [
  { path: 'job-list', component: AcrJobListComponent },
  { path: 'project-list', component: AcrProjectListComponent },
  { path: 'project-list-public', component: AcrProjectListPublicComponent },
  { path: '', redirectTo: 'job-list', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AcrJobListComponent,
    AcrProjectListComponent,
    AcrProjectListPublicComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AcrUserModule { }
