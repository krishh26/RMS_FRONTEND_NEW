import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// User components
import { UserListComponent } from './user/user-list/user-list.component';
import { UserAddEditComponent } from './user/user-add-edit/user-add-edit.component';

// Project components
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectAddEditComponent } from './project/project-add-edit/project-add-edit.component';

// Job components
import { JobListComponent } from './project/job-list/job-list.component';
import { JobAddEditComponent } from './project/job-add-edit/job-add-edit.component';
import { JobApplicationComponent } from './project/job-application/job-application.component';
import { SendJobComponent } from './project/send-job/send-job.component';

const routes: Routes = [
  // User routes
  { path: 'users', component: UserListComponent },
  { path: 'users/add', component: UserAddEditComponent },
  { path: 'users/edit/:id', component: UserAddEditComponent },

  // Project routes
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/add', component: ProjectAddEditComponent },
  { path: 'projects/edit/:id', component: ProjectAddEditComponent },

  // Job routes
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/add', component: JobAddEditComponent },
  { path: 'jobs/edit/:id', component: JobAddEditComponent },
  { path: 'jobs/applications', component: JobApplicationComponent },
  { path: 'jobs/applications/:id', component: JobApplicationComponent },
  { path: 'jobs/send/:id', component: SendJobComponent },

  // Default route
  { path: '', redirectTo: 'projects', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // User components
    UserListComponent,
    UserAddEditComponent,

    // Project components
    ProjectListComponent,
    ProjectAddEditComponent,

    // Job components
    JobListComponent,
    JobAddEditComponent,
    JobApplicationComponent,
    SendJobComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class CirAdminModule { }
