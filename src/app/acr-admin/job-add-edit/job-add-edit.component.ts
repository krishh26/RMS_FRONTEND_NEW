import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AcrServiceService } from '../../services/acr-service/acr-service.service';
import { CirSericeService } from '../../services/cir-service/cir-serice.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-job-add-edit',
  templateUrl: './job-add-edit.component.html',
  styleUrls: ['./job-add-edit.component.scss']
})
export class JobAddEditComponent implements OnInit {
  jobForm!: FormGroup;
  file: any;
  showLoader: boolean = false;
  jobID: string = '';
  fileUploadProcess: boolean = true;
  fileUploadSuccess: boolean = false;

  // Project related properties
  projectId: string = '';
  projectDetails: any = null;
  projectName: string = '';

  // Job editing properties
  jobId: string = '';
  isEditMode: boolean = false;
  jobDetails: any = null;
  hasExistingFile: boolean = false;
  fileChanged: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private acrService: AcrServiceService,
    private cirService: CirSericeService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private modalService: NgbModal
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.jobId = params['id'];
      if (this.jobId) {
        this.isEditMode = true;
        this.loadJobDetails();
      } else {
        this.isEditMode = false;
      }
    });

    this.route.queryParams.subscribe(queryParams => {
      this.projectId = queryParams['projectId'] || '';
      if (this.projectId) {
        this.loadProjectDetails();
      }
    });
  }

  private initializeForm(): void {
    const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate);

    this.jobForm = this.fb.group({
      job_title: ['', [Validators.required]],
      no_of_roles: ['', [Validators.required]],
      job_type: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      jobExpireDate: ['', [Validators.required]],
      publish_date: [formattedDate, [Validators.required]],
      client_name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      day_rate: ['', [Validators.required]],
      status: ['', [Validators.required]],
      job_id: [''],
      project_id: ['']
    });
  }

  private loadProjectDetails(): void {
    if (!this.projectId) return;

    this.cirService.getProjectDetails(this.projectId).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.projectDetails = response?.data;
          this.jobForm.patchValue({
            project_id: this.projectId
          });
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch project details');
        }
      },
      error: (error) => {
        this.notificationService.showError(error?.error?.message || error?.message || 'Failed to fetch project details');
      }
    });
  }

  private loadJobDetails(): void {
    if (!this.jobId) return;

    this.showLoader = true;
    this.cirService.getJobDetails(this.jobId, 'ACR').subscribe({
      next: (response: any) => {
        this.showLoader = false;
        if (response?.status) {
          const jobData = response.data;
          this.jobDetails = jobData;
          this.populateForm(jobData);
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch job details');
        }
      },
      error: (error) => {
        this.showLoader = false;
        this.notificationService.showError(error?.error?.message || error?.message || 'Failed to fetch job details');
      }
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private populateForm(jobData: any): void {
    console.log('Job data received:', jobData); // Debug log

    // Format dates
    const publishDate = jobData.publish_date ? new Date(jobData.publish_date).toISOString().split('T')[0] : '';
    const expireDate = jobData.job_expire_date ? new Date(jobData.job_expire_date).toISOString().split('T')[0] : '';
    const startDate = jobData.start_date ? new Date(jobData.start_date).toISOString().split('T')[0] : '';

    const formData = {
      job_title: jobData.job_title || '',
      no_of_roles: jobData.no_of_roles || '',
      job_type: jobData.job_type || '',
      start_date: startDate,
      jobExpireDate: expireDate,
      publish_date: publishDate,
      client_name: jobData.client_name || '',
      location: jobData.location || jobData.job_location || '',
      day_rate: jobData.day_rate || jobData.salary_range_min || '',
      status: jobData.status || '',
      job_id: jobData.job_id || jobData._id || '',
      project_id: jobData.project_id || this.projectId
    };

    console.log('Form data to populate:', formData); // Debug log

    this.jobForm.patchValue(formData);
  }


  onSubmit(): void {
    if (this.jobForm.valid) {
      this.showLoader = true;
      const formData = { ...this.jobForm.value };

      // Ensure project_id is set
      formData.project_id = this.projectId;

      // Get logged in user ID
      const loggedInUser = this.localStorageService.getLogger();
      const userId = loggedInUser?._id || loggedInUser?.id;

      if (!userId) {
        this.notificationService.showError('User ID not found. Please login again.');
        this.showLoader = false;
        return;
      }

      // Add user ID
      if (this.isEditMode) {
        formData.updatedBy = userId;
      } else {
        formData.createdBy = userId;
        formData.updatedBy = userId;
      }

      const apiCall = this.isEditMode
        ? this.cirService.cirUpdatejob(formData, this.jobId!)
        : this.cirService.Circreatejob(formData);

      apiCall.subscribe({
        next: (response: any) => {
          this.showLoader = false;
          if (response?.status) {
            this.notificationService.showSuccess(
              this.isEditMode ? 'Job updated successfully' : 'Job created successfully'
            );
            this.router.navigate(['/acr-admin/jobs'], { queryParams: { projectId: this.projectId } });
          } else {
            this.notificationService.showError(response?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} job`);
          }
        },
        error: (error) => {
          this.showLoader = false;
          this.notificationService.showError(error?.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} job`);
        }
      });
    } else {
      this.markFormGroupTouched(this.jobForm);
      this.notificationService.showError('Please fill all required fields');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/acr-admin/jobs'], { queryParams: { projectId: this.projectId } });
  }

  getFormFieldError(fieldName: string): string {
    const field = this.jobForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        return `${fieldName.replace('_', ' ')} is required`;
      }
      if (field.errors?.['min']) {
        return `${fieldName.replace('_', ' ')} must be greater than 0`;
      }
    }
    return '';
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}
