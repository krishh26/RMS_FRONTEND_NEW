import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContractAddEditComponent } from './contract-add-edit/contract-add-edit.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { CandidateAddEditComponent } from './candidate-add-edit/candidate-add-edit.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { JobAddEditComponent } from './job-add-edit/job-add-edit.component';
import { JobListComponent } from './job-list/job-list.component';
import { ProjectAddEditComponent } from './project-add-edit/project-add-edit.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { SendJobComponent } from './send-job/send-job.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { AcrUserAddEditComponent } from './acr-user-add-edit/acr-user-add-edit.component';
import { AcrUserListComponent } from './acr-user-list/acr-user-list.component';

const routes: Routes = [
  {
    path: 'contracts',
    component: ContractListComponent
  },
  {
    path: 'contract/add',
    component: ContractAddEditComponent
  },
  {
    path: 'contract/edit/:id',
    component: ContractAddEditComponent
  },
  {
    path: 'candidates',
    component: CandidateListComponent
  },
  {
    path: 'candidate/add',
    component: CandidateAddEditComponent
  },
  {
    path: 'candidate/edit/:id',
    component: CandidateAddEditComponent
  },
  {
    path: 'jobs',
    component: JobListComponent
  },
  {
    path: 'job/add',
    component: JobAddEditComponent
  },
  {
    path: 'job/edit/:id',
    component: JobAddEditComponent
  },
  {
    path: 'projects',
    component: ProjectListComponent
  },
  {
    path: 'project/add',
    component: ProjectAddEditComponent
  },
  {
    path: 'project/edit/:id',
    component: ProjectAddEditComponent
  },
  {
    path: 'send-job/:id',
    component: SendJobComponent
  },
  {
    path: 'job-applications',
    component: JobApplicationComponent
  },
  {
    path: 'users',
    component: AcrUserListComponent
  },
  {
    path: 'user/add',
    component: AcrUserAddEditComponent
  },
  {
    path: 'user/edit/:id',
    component: AcrUserAddEditComponent
  }
];

@NgModule({
  declarations: [
    ContractAddEditComponent,
    ContractListComponent,
    CandidateAddEditComponent,
    CandidateListComponent,
    JobAddEditComponent,
    JobListComponent,
    ProjectAddEditComponent,
    ProjectListComponent,
    SendJobComponent,
    JobApplicationComponent,
    AcrUserAddEditComponent,
    AcrUserListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AcrAdminModule { }
