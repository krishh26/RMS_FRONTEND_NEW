import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CirSericeService } from '../../../services/cir-service/cir-serice.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-project-add-edit',
  templateUrl: './project-add-edit.component.html',
  styleUrls: ['./project-add-edit.component.scss']
})
export class ProjectAddEditComponent implements OnInit {
  @Input() projectData: any = null;
  @Input() isEditMode: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<any>();

  projectForm: FormGroup;
  projectId: number | null = null;

  workTypes = ['Remote', 'Onsite', 'Hybrid'];
  statusTypes = ['Active', 'Inactive', 'Completed'];

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
        max: ['', [Validators.required, Validators.min(0)]]
      }),
      noOfPositions: ['', [Validators.required, Validators.min(1)]],
      clearanceOrCertifications: this.fb.array([]),
      status: ['Active', [Validators.required]],
      type: ['CIR']
    });
  }

  ngOnInit(): void {
    if (this.projectData && this.isEditMode) {
      this.loadProjectDetails();
    }
  }

    private loadProjectDetails(): void {
    if (!this.projectData) return;

    let formData = { ...this.projectData };

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
            day: date.getDate()
          };
        } else {
          // If date is invalid, set to today's date
          const today = new Date();
          formData.publishedDate = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate()
          };
        }
      } catch (error) {
        console.error('Date parsing error:', error);
        // If error in parsing, set to today's date
        const today = new Date();
        formData.publishedDate = {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate()
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
      const formData = this.projectForm.value;

      // Convert date to required format (YYYY-MM-DD)
      if (formData.publishedDate) {
        try {
          // Validate date parts
          const { year, month, day } = formData.publishedDate;
          if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
            throw new Error('Invalid date values');
          }

          // Create date at noon to avoid timezone issues
          const date = new Date(year, month - 1, day, 12, 0, 0);

          // Validate if date is valid
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
          }

          // Format date manually to avoid timezone issues
          const formattedYear = String(year).padStart(4, '0');
          const formattedMonth = String(month).padStart(2, '0');
          const formattedDay = String(day).padStart(2, '0');
          formData.publishedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;
        } catch (error) {
          console.error('Date formatting error:', error);
          this.notificationService.showError('Please select a valid date');
          return;
        }
      }

      // Get logged in user ID
      const loggedInUser = this.localStorageService.getLogger();
      const userId = loggedInUser?._id || loggedInUser?.id;

      if (!userId) {
        this.notificationService.showError('User ID not found. Please login again.');
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
        ? this.cirService.updateProject(this.projectData._id, formData)
        : this.cirService.createProject(formData);

      apiCall.subscribe({
        next: (response: any) => {
          if (response?.status === true) {
            this.notificationService.showSuccess(
              this.isEditMode ? 'Project updated successfully' : 'Project created successfully'
            );
            this.formSubmitted.emit(formData);
            this.closeModal.emit();
          } else {
            this.notificationService.showError(
              response?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} project`
            );
          }
        },
        error: (error) => {
          this.notificationService.showError(
            error?.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} project`
          );
        }
      });
    } else {
      this.markFormGroupTouched(this.projectForm);
      this.notificationService.showError('Please fill all required fields');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
