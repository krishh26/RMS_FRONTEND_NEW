import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { AddProjectModalComponent } from '../add-project-modal/add-project-modal.component';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent {
  projects: Project[] = [
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Modern e-commerce solution with payment integration',
      status: 'Active',
      startDate: '2024-01-15',
      endDate: '2024-06-30'
    },
    {
      id: 2,
      name: 'CRM System',
      description: 'Customer relationship management system',
      status: 'Completed',
      startDate: '2023-08-01',
      endDate: '2024-01-15'
    },
    {
      id: 3,
      name: 'Mobile App',
      description: 'Cross-platform mobile application',
      status: 'Planning',
      startDate: '2024-03-01',
      endDate: '2024-09-30'
    },
    {
      id: 4,
      name: 'Data Analytics Dashboard',
      description: 'Real-time data visualization platform',
      status: 'Active',
      startDate: '2024-02-01',
      endDate: '2024-07-31'
    }
  ];

  displayedColumns: string[] = ['id', 'name', 'description', 'status', 'startDate', 'endDate', 'actions'];

  constructor(private dialog: MatDialog) {}

  openAddProjectModal(): void {
    const dialogRef = this.dialog.open(AddProjectModalComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle new project creation
        console.log('New project:', result);
        // Add the new project to the list
        this.projects.push({
          id: this.projects.length + 1,
          ...result
        });
      }
    });
  }

  viewProject(project: Project): void {
    console.log('View project:', project);
    // Implement view logic
  }

  editProject(project: Project): void {
    console.log('Edit project:', project);
    // Implement edit logic
  }

  deleteProject(project: Project): void {
    if (confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      this.projects = this.projects.filter(p => p.id !== project.id);
      console.log('Project deleted:', project);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active':
        return 'accent';
      case 'Completed':
        return 'primary';
      case 'Planning':
        return 'warn';
      default:
        return 'primary';
    }
  }
}
