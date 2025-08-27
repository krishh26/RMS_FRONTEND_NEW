import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CirSericeService } from '../../../services/cir-service/cir-serice.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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
  showLoader = false;
  projectlist: any[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  selectedStatus: 'Active' | 'Future Role' | 'Expired' | 'All' = 'All';

  statusOptions = [
    { value: 'All', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Future Role', label: 'Future Role' },
    { value: 'Expired', label: 'Expired' }
  ];
  Math = Math; // Make Math available in template

  // Date filter properties
  startDate: NgbDateStruct | null = null;
  endDate: NgbDateStruct | null = null;

  // Date validation
  maxDate: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };

  // Computed property for minDate
  get minEndDate(): NgbDateStruct {
    return this.startDate || {
      year: 2000,
      month: 1,
      day: 1
    };
  }

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

  constructor(
    private router: Router,
    private cirService: CirSericeService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getProjectList();
  }

  getProjectList() {
    this.showLoader = true;
    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      status: this.selectedStatus
    };

    // Add date filters if selected
    if (this.startDate) {
      params.startDate = `${this.startDate.year}-${this.padNumber(this.startDate.month)}-${this.padNumber(this.startDate.day)}`;
    }
    if (this.endDate) {
      params.endDate = `${this.endDate.year}-${this.padNumber(this.endDate.month)}-${this.padNumber(this.endDate.day)}`;
    }

    this.cirService.getProjectsList(params).subscribe({
      next: (response: any) => {
        if (response?.status === true) {
          this.projectlist = response.data || [];
          this.totalRecords = response.meta_data?.items || 0;
          this.showLoader = false;
        } else {
          this.projectlist = [];
          this.totalRecords = 0;
          this.notificationService.showError(response?.message || 'Failed to fetch projects');
          this.showLoader = false;
        }
      },
      error: (error) => {
        this.projectlist = [];
        this.totalRecords = 0;
        this.notificationService.showError(error?.error?.message || error?.message || 'Failed to fetch projects');
        this.showLoader = false;
      }
    });
  }

  editProject(projectId: string): void {
    console.log('Edit project:', projectId);
  }

  deleteProject(projectId: string): void {
    console.log('Delete project:', projectId);
  }

  viewDetails(projectId: string): void {
    this.showLoader = true;
    this.cirService.getProjectDetails(projectId).subscribe({
      next: (response: any) => {
        if (response?.status === true) {
          // Store project details and navigate to details page
          this.router.navigate(['/cir-admin/jobs'], {
            state: { projectDetails: response.data }
          });
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch project details');
        }
        this.showLoader = false;
      },
      error: (error) => {
        this.notificationService.showError(error?.error?.message || error?.message || 'Failed to fetch project details');
        this.showLoader = false;
      }
    });
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getProjectList();
  }

  // Helper method to pad single digit numbers with leading zero
  private padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  // Date filter methods
  onStartDateSelect(date: NgbDateStruct): void {
    this.startDate = date;
    if (this.endDate && this.compareDates(date, this.endDate) > 0) {
      this.endDate = null;
    }
    this.currentPage = 1; // Reset to first page when filter changes
    this.getProjectList();
  }

  onEndDateSelect(date: NgbDateStruct): void {
    this.endDate = date;
    this.currentPage = 1; // Reset to first page when filter changes
    this.getProjectList();
  }

  // Helper method to compare dates
  private compareDates(date1: NgbDateStruct, date2: NgbDateStruct): number {
    const d1 = new Date(date1.year, date1.month - 1, date1.day);
    const d2 = new Date(date2.year, date2.month - 1, date2.day);
    return d1.getTime() - d2.getTime();
  }

  clearDateFilters(): void {
    this.startDate = null;
    this.endDate = null;
    this.currentPage = 1; // Reset to first page when filters are cleared
    this.getProjectList();
  }

  onStatusChange(status: 'Active' | 'Future Role' | 'Expired' | 'All'): void {
    this.selectedStatus = status;
    this.currentPage = 1; // Reset to first page when filter changes
    this.getProjectList();
  }
}
