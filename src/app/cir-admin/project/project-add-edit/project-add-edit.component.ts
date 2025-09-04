import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CirSericeService } from '../../../services/cir-service/cir-serice.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-project-add-edit',
  templateUrl: './project-add-edit.component.html',
  styleUrls: ['./project-add-edit.component.scss'],
})
export class ProjectAddEditComponent implements OnInit {
  @Input() projectData: any = null;
  @Input() isEditMode: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<any>();

  projectForm: FormGroup;
  projectId: number | null = null;
  isViewMode: boolean = false;

  workTypes = ['Remote', 'Onsite', 'Hybrid'];
  statusTypes = ['Active' , 'Future Role' , 'Expired', 'Completed'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cirService: CirSericeService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required]],
      publishedDate: ['', [Validators.required]],
      client: ['', [Validators.required]],
      clientLocation: ['', [Validators.required]],
      workType: ['Remote', [Validators.required]],
      dayRatesRange: this.fb.group({
        min: ['', [Validators.required, Validators.min(0)]],
        max: ['', [Validators.required, Validators.min(0)]],
      }),
      noOfPositions: ['', [Validators.required, Validators.min(1)]],
      clearanceOrCertifications: this.fb.array([]),
      status: ['Active', [Validators.required]],
      type: ['CIR'],
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode based on route
    this.route.params.subscribe(params => {
      const projectId = params['id'];
      if (projectId) {
        // Check if this is edit route or view route
        if (this.route.snapshot.url.some(segment => segment.path === 'edit')) {
          this.isEditMode = true;
          this.isViewMode = false;
        } else {
          this.isEditMode = false;
          this.isViewMode = true;
        }
        this.projectId = projectId;
        this.loadProjectById(projectId);
      } else {
        this.isEditMode = false;
        this.isViewMode = false;
      }
    });

    // If projectData is passed as input (for modal usage), use it
    if (this.projectData && this.isEditMode) {
      this.loadProjectDetails();
    }
  }

  private loadProjectDetails(): void {
    if (!this.projectData) return;

    let formData = { ...this.projectData };

    // Disable form in view mode
    if (this.isViewMode) {
      this.projectForm.disable();
    }

    // Handle date conversion
    if (this.projectData.publishedDate) {
      try {
        // Create a date object from the ISO string
        const date = new Date(this.projectData.publishedDate);

        // Check if date is valid
        if (!isNaN(date.getTime())) {
          formData.publishedDate = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
          };
        } else {
          // If date is invalid, set to today's date
          const today = new Date();
          formData.publishedDate = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate(),
          };
        }
      } catch (error) {
        console.error('Date parsing error:', error);
        // If error in parsing, set to today's date
        const today = new Date();
        formData.publishedDate = {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate(),
        };
      }
    }

    // Clear existing certifications
    while (this.certifications.length) {
      this.certifications.removeAt(0);
    }

    // Add certifications from project data
    if (this.projectData.clearanceOrCertifications?.length) {
      this.projectData.clearanceOrCertifications.forEach((cert: string) => {
        this.addCertification(cert);
      });
    }

    // Update form values
    this.projectForm.patchValue(formData);
  }

  private loadProjectById(projectId: string): void {
    this.cirService.getProjectById(projectId).subscribe({
      next: (response: any) => {
        if (response?.status === true) {
          this.projectData = response.data;
          this.loadProjectDetails();
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch project details');
        }
      },
      error: (error) => {
        this.notificationService.showError(error?.error?.message || error?.message || 'Failed to fetch project details');
      }
    });
  }

  // Helper methods for certifications
  get certifications() {
    return this.projectForm.get('clearanceOrCertifications') as FormArray;
  }

  addCertification(cert: string = '') {
    this.certifications.push(this.fb.control(cert, Validators.required));
  }

  removeCertification(index: number) {
    this.certifications.removeAt(index);
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formData = { ...this.projectForm.value };

      // Format the publishedDate to YYYY-MM-DD string format
      if (formData.publishedDate) {
        try {
          // Handle different date formats
          let date: Date;
          if (typeof formData.publishedDate === 'string') {
            date = new Date(formData.publishedDate);
          } else if (formData.publishedDate.year && formData.publishedDate.month && formData.publishedDate.day) {
            // Handle object format {year, month, day}
            date = new Date(formData.publishedDate.year, formData.publishedDate.month - 1, formData.publishedDate.day);
          } else {
            date = new Date(formData.publishedDate);
          }

          // Check if date is valid
          if (isNaN(date.getTime())) {
            console.error('Invalid date value:', formData.publishedDate);
            this.notificationService.showError('Please enter a valid date');
            return;
          }

          formData.publishedDate = date.toISOString().split('T')[0];
        } catch (error) {
          console.error('Error formatting date:', error);
          this.notificationService.showError('Please enter a valid date');
          return;
        }
      }

      // Get logged in user ID
      const loggedInUser = this.localStorageService.getLogger();
      const userId = loggedInUser?._id || loggedInUser?.id;

      if (!userId) {
        this.notificationService.showError( 'User ID not found. Please login again.');
        return;
      }

      // Add user ID to form data
      if (this.isEditMode) {
        formData.updatedBy = userId;
      } else {
        formData.createdBy = userId;
        formData.updatedBy = userId;
      }

      // Create or update project
      const apiCall = this.isEditMode
        ? this.cirService.updateProject(this.projectId || this.projectData?._id, formData)
        : this.cirService.createProject(formData);

      apiCall.subscribe({
        next: (response: any) => {
          if (response?.status === true) {
            this.notificationService.showSuccess(
              this.isEditMode ? 'Project updated successfully' : 'Project created successfully'
            );
            this.projectForm.reset();
            // Navigate back to projects list
            this.router.navigate(['/cir-admin/projects']);
          } else {
            this.notificationService.showError( response?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} project`);
          }
        },
        error: (error) => {
          this.notificationService.showError(error?.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} project`);
        },
      });
    } else {
      this.markFormGroupTouched(this.projectForm);
      this.notificationService.showError('Please fill all required fields');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    if (this.closeModal.observed) {
      // If modal is being used, emit close event
      this.closeModal.emit();
    } else {
      // If not in modal mode, navigate back
      if (this.isViewMode && this.projectId) {
        // If in view mode, go back to projects list
        this.router.navigate(['/cir-admin/projects']);
      } else {
        // If in add/edit mode, go back to projects list
        this.router.navigate(['/cir-admin/projects']);
      }
    }
  }

  editProject(): void {
    if (this.projectId) {
      this.router.navigate(['/cir-admin/projects/edit', this.projectId]);
    }
  }
}
