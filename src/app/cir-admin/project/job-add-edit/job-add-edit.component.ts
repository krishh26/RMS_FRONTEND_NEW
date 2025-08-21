import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-job-add-edit',
  templateUrl: './job-add-edit.component.html',
  styleUrls: ['./job-add-edit.component.scss']
})
export class JobAddEditComponent implements OnInit {
  jobForm: FormGroup;
  isEditMode = false;
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
    this.jobId = this.route.snapshot.params['id'];
    if (this.jobId) {
      this.isEditMode = true;
      this.loadJobDetails();
    }
  }

  private loadJobDetails(): void {
    // Simulate API call to get job details
    const mockJob = {
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'New York',
      type: 'Full-time',
      experience: '5+ years',
      salary: '120,000 - 150,000',
      description: 'We are looking for a Senior Software Engineer...',
      requirements: '- Bachelor\'s degree in Computer Science\n- 5+ years of experience\n- Strong knowledge of JavaScript',
      responsibilities: '- Design and implement new features\n- Lead technical projects\n- Mentor junior developers',
      benefits: '- Health insurance\n- 401(k) matching\n- Remote work options',
      status: 'active'
    };

    this.jobForm.patchValue(mockJob);
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      console.log('Form submitted:', this.jobForm.value);
      // Here you would typically save the job data
      this.router.navigate(['../'], { relativeTo: this.route });
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
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
