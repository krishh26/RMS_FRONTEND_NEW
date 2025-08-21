import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-add-edit',
  templateUrl: './project-add-edit.component.html',
  styleUrls: ['./project-add-edit.component.scss']
})
export class ProjectAddEditComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  projectId: number | null = null;

  clients = [
    { id: 1, name: 'Tech Corp' },
    { id: 2, name: 'Innovation Inc' },
    { id: 3, name: 'Design Studio' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      client: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      status: ['planning', [Validators.required]],
      budget: ['', [Validators.required, Validators.min(0)]],
      teamSize: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      objectives: ['']
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params['id'];
    if (this.projectId) {
      this.isEditMode = true;
      this.loadProjectDetails();
    }
  }

  private loadProjectDetails(): void {
    // Simulate API call to get project details
    const mockProject = {
      name: 'Project Alpha',
      client: 'Tech Corp',
      startDate: '2024-03-01',
      endDate: '2024-06-30',
      status: 'active',
      budget: 50000,
      teamSize: 5,
      description: 'Project description here',
      objectives: 'Project objectives here'
    };

    this.projectForm.patchValue(mockProject);
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      console.log('Form submitted:', this.projectForm.value);
      // Here you would typically save the project data
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.markFormGroupTouched(this.projectForm);
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
