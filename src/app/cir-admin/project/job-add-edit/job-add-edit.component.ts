import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-job-add-edit',
  templateUrl: './job-add-edit.component.html',
  styleUrls: ['./job-add-edit.component.scss']
})
export class JobAddEditComponent implements OnInit {
  @Input() projectData: any = null;
  @Input() isEditMode: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<any>();

  jobForm: FormGroup;
  jobId: number | null = null;

  departments = [
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Sales',
    'HR'
  ];

  locations = [
    'New York',
    'San Francisco',
    'Remote',
    'London',
    'Singapore'
  ];

  jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required]],
      department: ['', [Validators.required]],
      location: ['', [Validators.required]],
      type: ['Full-time', [Validators.required]],
      experience: ['', [Validators.required]],
      salary: [''],
      description: ['', [Validators.required]],
      requirements: ['', [Validators.required]],
      responsibilities: ['', [Validators.required]],
      benefits: [''],
      status: ['active', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.projectData && this.isEditMode) {
      this.loadProjectDetails();
    }
  }

  private loadProjectDetails(): void {
    // Map project data to form fields
    const projectFormData = {
      title: this.projectData.name || '',
      department: this.projectData.client || '',
      location: 'Remote', // Default value since project doesn't have location
      type: 'Full-time', // Default value since project doesn't have type
      experience: `${this.projectData.team || 0}+ years`, // Map team size to experience
      salary: `$${this.projectData.budget || 0}`, // Map budget to salary
      description: `Project: ${this.projectData.name || ''}`,
      requirements: `Team size: ${this.projectData.team || 0} people`,
      responsibilities: `Project management and delivery`,
      benefits: 'Project completion bonus',
      status: this.projectData.status?.toLowerCase() || 'active'
    };

    this.jobForm.patchValue(projectFormData);
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      console.log('Form submitted:', this.jobForm.value);
      // Emit the form data and close modal
      this.formSubmitted.emit(this.jobForm.value);
      this.closeModal.emit();
    } else {
      this.markFormGroupTouched(this.jobForm);
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
    // Navigate back to job list page
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
