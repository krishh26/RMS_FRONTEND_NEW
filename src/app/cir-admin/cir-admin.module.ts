import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
// Layout components
import { CirAdminLayoutComponent } from './layout/cir-admin-layout.component';
import { CirAdminSidebarComponent } from './sidebar/sidebar.component';

// Dashboard component
import { CirAdminDashboardComponent } from './dashboard/dashboard.component';

// Settings component
import { SettingsComponent } from './settings/settings.component';
import { BannerListComponent } from './settings/banner-list/banner-list.component';

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
import { NgxEditorModule } from 'ngx-editor';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatabaseService } from '../services/database-service/database.service';
import { NotificationService } from '../services/notification/notification.service';

const routes: Routes = [
  {
    path: '',
    component: CirAdminLayoutComponent,
    children: [
      // Dashboard route
      { path: '', component: CirAdminDashboardComponent },

      // User routes
      { path: 'users', component: UserListComponent },
      { path: 'users/add', component: UserAddEditComponent },
      { path: 'users/edit/:id', component: UserAddEditComponent },

      // Project routes
      { path: 'projects', component: ProjectListComponent },
      { path: 'projects/add', component: ProjectAddEditComponent },
      { path: 'projects/:id', component: ProjectAddEditComponent },
      { path: 'projects/edit/:id', component: ProjectAddEditComponent },

      // Job routes
      { path: 'jobs', component: JobListComponent },
      { path: 'jobs/add', component: JobAddEditComponent },
      { path: 'jobs/edit/:id', component: JobAddEditComponent },
      { path: 'jobs/applications/:id', component: JobApplicationComponent },
      { path: 'jobs/send/:id', component: SendJobComponent },

      // Settings routes
      { path: 'settings', component: BannerListComponent },
      { path: 'settings/banner', component: SettingsComponent },
    ],
  },
];

@NgModule({
  declarations: [
    // Layout components
    CirAdminLayoutComponent,
    CirAdminSidebarComponent,

    // Dashboard component
    CirAdminDashboardComponent,

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
    SendJobComponent,

    // Settings component
    SettingsComponent,
    BannerListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forChild(routes),
    DecimalPipe,
    HttpClientModule,
    NgxEditorModule,
    NgxPaginationModule,
    SharedModule
  ],
  providers: [
    DatabaseService,
    NotificationService
  ],
})
export class CirAdminModule {}
