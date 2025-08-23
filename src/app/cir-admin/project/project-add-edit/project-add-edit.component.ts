import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
    if (this.projectData && this.isEditMode) {
      this.loadProjectDetails();
    }
  }

  private loadProjectDetails(): void {
    // Use the passed project data instead of mock data
    this.projectForm.patchValue(this.projectData);
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      console.log('Form submitted:', this.projectForm.value);
      // Emit the form data and close modal
      this.formSubmitted.emit(this.projectForm.value);
      this.closeModal.emit();
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
    this.closeModal.emit();
  }
}
