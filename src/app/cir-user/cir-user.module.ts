import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProjectListComponent } from './project-list/project-list.component';
import { JobListComponent } from './job-list/job-list.component';
import { ProjectListPublicComponent } from './project-list-public/project-list-public.component';
import { CirUserHeaderComponent } from './header/cir-user-header.component';
import { CirUserLayoutComponent } from './layout/cir-user-layout.component';
import { CirProfileComponent } from './profile/cir-profile.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CirUserLayoutComponent,
    children: [
      { path: 'projects', component: ProjectListComponent },
      { path: 'jobs', component: JobListComponent },
      { path: 'public-projects', component: ProjectListPublicComponent },
      { path: 'profile', component: CirProfileComponent },
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
    CirUserLayoutComponent,
    CirProfileComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    SharedModule
  ]
})
export class CirUserModule { }
