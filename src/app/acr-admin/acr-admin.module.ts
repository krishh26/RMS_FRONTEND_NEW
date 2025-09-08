import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';

// Layout components
import { AcrAdminLayoutComponent } from './layout/acr-admin-layout.component';
import { AcrAdminSidebarComponent } from './sidebar/sidebar.component';

// Dashboard component
import { AcrAdminDashboardComponent } from './dashboard/dashboard.component';

// Contract components
import { ContractAddEditComponent } from './contract-add-edit/contract-add-edit.component';
import { ContractListComponent } from './contract-list/contract-list.component';

// Candidate components
import { CandidateAddEditComponent } from './candidate-add-edit/candidate-add-edit.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';

// Job components
import { JobAddEditComponent } from './job-add-edit/job-add-edit.component';
import { JobListComponent } from './job-list/job-list.component';

// Project components
import { ProjectAddEditComponent } from './project-add-edit/project-add-edit.component';
import { ProjectListComponent } from './project-list/project-list.component';

// Other components
import { SendJobComponent } from './send-job/send-job.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { AcrUserAddEditComponent } from './acr-user-add-edit/acr-user-add-edit.component';
import { AcrUserListComponent } from './acr-user-list/acr-user-list.component';

// Settings components
import { SettingsComponent } from './settings/settings.component';
import { BannerListComponent } from './settings/banner-list/banner-list.component';

const routes: Routes = [
  {
    path: '',
    component: AcrAdminLayoutComponent,
    children: [
      // Dashboard route
      { path: '', component: AcrAdminDashboardComponent },

      // Contract routes
      { path: 'contracts', component: ContractListComponent },
      { path: 'contract/add', component: ContractAddEditComponent },
      { path: 'contract/edit/:id', component: ContractAddEditComponent },

      // Candidate routes
      { path: 'candidates', component: CandidateListComponent },
      { path: 'candidate/add', component: CandidateAddEditComponent },
      { path: 'candidate/edit/:id', component: CandidateAddEditComponent },

      // Job routes
      { path: 'jobs', component: JobListComponent },
      { path: 'job/add', component: JobAddEditComponent },
      { path: 'job/edit/:id', component: JobAddEditComponent },

      // Project routes
      { path: 'projects', component: ProjectListComponent },
      { path: 'project/add', component: ProjectAddEditComponent },
      { path: 'project/edit/:id', component: ProjectAddEditComponent },

      // Other routes
      { path: 'send-job/:id', component: SendJobComponent },
      { path: 'job-applications', component: JobApplicationComponent },
      { path: 'users', component: AcrUserListComponent },
      { path: 'user/add', component: AcrUserAddEditComponent },
      { path: 'user/edit/:id', component: AcrUserAddEditComponent },

      // Settings routes
      { path: 'settings', component: BannerListComponent },
      { path: 'settings/banner', component: SettingsComponent }
    ]
  }
];

@NgModule({
  declarations: [
    // Layout components
    AcrAdminLayoutComponent,
    AcrAdminSidebarComponent,

    // Dashboard component
    AcrAdminDashboardComponent,

    // Contract components
    ContractAddEditComponent,
    ContractListComponent,

    // Candidate components
    CandidateAddEditComponent,
    CandidateListComponent,

    // Job components
    JobAddEditComponent,
    JobListComponent,

    // Project components
    ProjectAddEditComponent,
    ProjectListComponent,

    // Other components
    SendJobComponent,
    JobApplicationComponent,
    AcrUserAddEditComponent,
    AcrUserListComponent,

    // Settings components
    SettingsComponent,
    BannerListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxEditorModule
  ]
})
export class AcrAdminModule { }
