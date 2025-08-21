import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProjectListComponent } from './project-list/project-list.component';
import { JobListComponent } from './job-list/job-list.component';
import { ProjectListPublicComponent } from './project-list-public/project-list-public.component';

const routes: Routes = [
  { path: 'projects', component: ProjectListComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'public-projects', component: ProjectListPublicComponent },
  { path: '', redirectTo: 'projects', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    ProjectListComponent,
    JobListComponent,
    ProjectListPublicComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class CirUserModule { }
