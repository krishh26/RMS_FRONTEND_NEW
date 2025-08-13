import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

interface ProjectForm {
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-add-project-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './add-project-modal.component.html',
  styleUrls: ['./add-project-modal.component.scss']
})
export class AddProjectModalComponent {
  project: ProjectForm = {
    name: '',
    description: '',
    status: 'Planning',
    startDate: '',
    endDate: ''
  };

  statusOptions = ['Planning', 'Active', 'Completed', 'On Hold'];

  constructor(public dialogRef: MatDialogRef<AddProjectModalComponent>) {}

  onSubmit(): void {
    if (this.isFormValid()) {
      this.dialogRef.close(this.project);
    }
  }

  isFormValid(): boolean {
    return !!(this.project.name && this.project.description &&
              this.project.startDate && this.project.endDate);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
