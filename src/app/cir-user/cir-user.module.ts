import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProjectListComponent } from './project-list/project-list.component';
import { JobListComponent } from './job-list/job-list.component';
import { ProjectListPublicComponent } from './project-list-public/project-list-public.component';
import { CirUserHeaderComponent } from './header/cir-user-header.component';
import { CirUserLayoutComponent } from './layout/cir-user-layout.component';

const routes: Routes = [
  {
    path: '',
    component: CirUserLayoutComponent,
    children: [
      { path: 'projects', component: ProjectListComponent },
      { path: 'jobs', component: JobListComponent },
      { path: 'public-projects', component: ProjectListPublicComponent },
      { path: '', redirectTo: 'projects', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    ProjectListComponent,
    JobListComponent,
    ProjectListPublicComponent,
    CirUserHeaderComponent,
    CirUserLayoutComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule.forChild(routes)
  ]
})
export class CirUserModule { }
