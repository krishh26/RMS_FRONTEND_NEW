import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  showModal = false;
  isEditMode = false;
  selectedProject: any = null;
  showMobileFilters = false;
  projects: any[] = [
    {
      id: 1,
      name: 'Project Alpha',
      client: 'Tech Corp',
      startDate: '2024-03-01',
      endDate: '2024-06-30',
      status: 'Active',
      budget: 50000,
      team: 5
    },
    {
      id: 2,
      name: 'Project Beta',
      client: 'Innovation Inc',
      startDate: '2024-04-01',
      endDate: '2024-07-31',
      status: 'Planning',
      budget: 75000,
      team: 8
    },
    {
      id: 3,
      name: 'Project Gamma',
      client: 'Design Studio',
      startDate: '2024-02-01',
      endDate: '2024-05-31',
      status: 'Completed',
      budget: 30000,
      team: 3
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Here you would typically fetch projects from a service
  }

  editProject(projectId: number): void {
    console.log('Edit project:', projectId);
  }

  deleteProject(projectId: number): void {
    console.log('Delete project:', projectId);
  }

  viewDetails(projectId: number): void {
    // Redirect to job list page
    this.router.navigate(['/cir-admin/jobs']);
  }

  openAddProjectModal(): void {
    this.isEditMode = false;
    this.selectedProject = null;
    this.showModal = true;
  }

  openEditProjectModal(project: any): void {
    this.isEditMode = true;
    this.selectedProject = project;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.selectedProject = null;
  }

  onFormSubmitted(formData: any): void {
    console.log('Project form submitted:', formData);
    if (this.isEditMode) {
      console.log('Updating project:', this.selectedProject.id, 'with data:', formData);
      // Here you would typically update the project data
    } else {
      console.log('Creating new project with data:', formData);
      // Here you would typically create a new project
    }
    // For now, just close the modal
    this.closeModal();
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }
}
