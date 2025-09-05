import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcrServiceService } from 'src/app/services/acr-service/acr-service.service';
import { CirSericeService } from 'src/app/services/cir-service/cir-serice.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Patterns } from 'src/app/shared/constant/validation-patterns.const';

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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private acrservice: AcrServiceService,
    private cirservice: CirSericeService,
  ) {
    const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate);

    this.jobForm = new FormGroup({
      job_title: new FormControl('', [Validators.required, Validators.pattern(Patterns.name)]),
      no_of_roles: new FormControl('', [Validators.required]),
      job_type: new FormControl('', [Validators.required]),
      start_date: new FormControl('', [Validators.required]),
      jobExpireDate: new FormControl('', [Validators.required]),
      publish_date: new FormControl(formattedDate, [Validators.required]),
      client_name: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      day_rate: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      upload: new FormControl(''),
      job_id: new FormControl({ value: null, disabled: true })
    });

    this.jobForm.get('status')?.valueChanges.subscribe(status => {
      const jobIDControl = this.jobForm.get('job_id');

      if (status === 'Active') {
        jobIDControl?.enable();
        jobIDControl?.setValue(this.jobID);
      } else {
        jobIDControl?.disable();
        jobIDControl?.setValue(null);
      }
    });
  }


  ngOnInit() {
    // Get project_id and job_id from query parameters
    this.activatedRoute.queryParams.subscribe(params => {
      this.projectId = params['projectId'] || '';
      this.jobId = params['jobId'] || '';
      
      // Check if we're in edit mode
      this.isEditMode = !!this.jobId;
      
      if (this.projectId) {
        this.getProjectDetails();
        if (this.isEditMode) {
          this.getJobDetails();
        } else {
          this.getJobIDList();
        }
      } else {
        this.notificationService.showError('Project ID is required');
        if (this.isEditMode) {
          this.getJobDetails();
        } else {
          this.getJobIDList();
        }
      }
    });
  }

  getProjectDetails() {
    if (!this.projectId) {
      this.notificationService.showError('Project ID is required');
      return;
    }

    this.cirservice.getProjectDetails(this.projectId).subscribe((response: any) => {
      if (response?.status) {
        this.projectDetails = response?.data;
        this.projectName = response?.data?.projectName || 'Unknown Project';
        console.log('Project details:', this.projectDetails);
      } else {
        this.notificationService.showError(response?.message || 'Failed to fetch project details');
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Failed to fetch project details');
    });
  }

  getJobIDList() {
    this.showLoader = true;
    this.acrservice.getCirJobIdList().subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.jobID = response?.data?.job_id;
        console.log(this.jobID);
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message);
      this.showLoader = false;
    });
  }

  getJobDetails() {
    if (!this.jobId) {
      this.notificationService.showError('Job ID is required');
      return;
    }

    this.showLoader = true;
    this.cirservice.getJobDetails(this.jobId, 'CIR').subscribe((response: any) => {
      this.showLoader = false;
      if (response?.status) {
        this.jobDetails = response?.data;
        this.loadJobDetailsToForm();
        console.log('Job details:', this.jobDetails);
      } else {
        this.notificationService.showError(response?.message || 'Failed to fetch job details');
      }
    }, (error) => {
      this.showLoader = false;
      this.notificationService.showError(error?.error?.message || 'Failed to fetch job details');
    });
  }

  loadJobDetailsToForm() {
    if (!this.jobDetails) return;

    // Format dates for form inputs
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    // Update form values
    this.jobForm.patchValue({
      job_title: this.jobDetails.job_title || '',
      no_of_roles: this.jobDetails.no_of_roles || '',
      job_type: this.jobDetails.job_type || '',
      start_date: formatDateForInput(this.jobDetails.start_date),
      jobExpireDate: formatDateForInput(this.jobDetails.jobExpireDate || this.jobDetails.job_expire_date),
      publish_date: this.jobDetails.publish_date || '',
      client_name: this.jobDetails.client_name || '',
      location: this.jobDetails.location || '',
      day_rate: this.jobDetails.day_rate || '',
      status: this.jobDetails.status || '',
      job_id: this.jobDetails.job_id || ''
    });

    // Set the file upload data if available
    if (this.jobDetails.upload) {
      this.file = this.jobDetails.upload;
      this.fileUploadProcess = true;
      this.fileUploadSuccess = true;
      this.hasExistingFile = true;
      this.fileChanged = false;
      
      // Set upload field as valid for form validation
      this.jobForm.get('upload')?.setValue('existing-file');
      this.jobForm.get('upload')?.markAsTouched();
    } else {
      // Reset file states if no existing file
      this.file = null;
      this.fileUploadProcess = true;
      this.fileUploadSuccess = false;
      this.hasExistingFile = false;
      this.fileChanged = false;
    }
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  fileUpload(event: any): void {
    const file = event.target.files[0];

    // Check if file exists
    if (file) {
      // Reset success state
      this.fileUploadSuccess = false;
      
      // Rename the file to "readme" with the same extension
      const newFileName = 'readme' + file.name.substring(file.name.lastIndexOf('.'));
      const renamedFile = new File([file], newFileName, { type: file.type });

      const data = new FormData();
      data.append('files', renamedFile);
      
      // Show loader
      this.fileUploadProcess = false;

      this.cirservice.fileUpload(data).subscribe(
        (response) => {
          if (response?.status) {
            this.file = response?.data;
            console.log(this.file);
            this.fileUploadProcess = true;
            this.fileUploadSuccess = true;
            this.hasExistingFile = true; // Mark that we now have a file
            this.fileChanged = true; // Mark that file has been changed
            
            // Set upload field as valid for form validation
            this.jobForm.get('upload')?.setValue('new-file');
            this.jobForm.get('upload')?.markAsTouched();
            
            this.notificationService.showSuccess(response?.message || 'File successfully uploaded.');
            
            // Hide success state after 3 seconds
            setTimeout(() => {
              this.fileUploadSuccess = false;
            }, 3000);
          } else {
            this.notificationService.showError(response?.message || 'File not uploaded.');
            this.fileUploadProcess = true;
            this.fileUploadSuccess = false;
          }
        },
        (error) => {
          this.notificationService.showError(error?.error?.message || 'File not uploaded.');
          this.fileUploadProcess = true;
          this.fileUploadSuccess = false;
        }
      );
    }
  }

  replaceFile(): void {
    // Reset file states to allow new file upload
    this.hasExistingFile = false;
    this.fileUploadSuccess = false;
    this.file = null;
    this.fileUploadProcess = true;
    this.fileChanged = false;
    
    // Clear upload field validation
    this.jobForm.get('upload')?.setValue('');
    this.jobForm.get('upload')?.markAsUntouched();
  }



  submit() {
    // For edit mode, validate form without file requirement if no file change is needed
    if (this.isEditMode) {
      // If in edit mode and no file change, remove file validation temporarily
      if (!this.fileChanged) {
        this.jobForm.get('upload')?.clearValidators();
        this.jobForm.get('upload')?.updateValueAndValidity();
      } else {
        // If file is changed, add required validator back
        this.jobForm.get('upload')?.setValidators([Validators.required]);
        this.jobForm.get('upload')?.updateValueAndValidity();
      }
    } else {
      // For create mode, file is always required
      this.jobForm.get('upload')?.setValidators([Validators.required]);
      this.jobForm.get('upload')?.updateValueAndValidity();
    }

    if (!this.jobForm.valid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    // Show full page loader
    this.showLoader = true;

    const uploadFile = this.file;

    let formData = {
      ...this.jobForm.value,
      project_id: this.projectId
    };

    // Only include upload data if we have a file
    if (uploadFile) {
      const cvObject = {
        key: uploadFile?.key,
        url: uploadFile?.url,
      };
      formData.upload = cvObject;
    }

    if (this.jobForm.get('status')?.value !== 'Active') {
      delete formData['job_id'];
    }

    // Choose between create and update based on edit mode
    const apiCall = this.isEditMode 
      ? this.cirservice.cirUpdatejob(formData, this.jobId)
      : this.cirservice.Circreatejob(formData);

    apiCall.subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status) {
          const successMessage = this.isEditMode ? 'Job updated successfully!' : 'Job created successfully!';
          this.notificationService.showSuccess(response?.message || successMessage, 'Success!');
          // Navigate to job listing page with project ID
          this.router.navigate(['/cir-admin/jobs'], { 
            queryParams: { projectId: this.projectId } 
          });
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.showLoader = false;
        const errorMessage = error?.error?.message || 'An unexpected error occurred.';
        this.notificationService.showError(errorMessage);
      }
    );
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


}
