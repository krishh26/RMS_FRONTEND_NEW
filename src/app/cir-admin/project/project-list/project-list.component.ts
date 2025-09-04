import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CirSericeService } from '../../../services/cir-service/cir-serice.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  showMobileFilters = false;
  showLoader = false;
  projectlist: any[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  selectedStatus: 'Active' | 'Future Role' | 'Expired' | 'Completed' | 'All' = 'All';
  selectedClient: string = '';
  searchKeyword: string = '';
  searchTimeout: any;
  uniqueClients: string[] = [];

  statusOptions = [
    { value: 'All', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Future Role', label: 'Future Role' },
    { value: 'Expired', label: 'Expired' },
    { value: 'Completed', label: 'Completed' }
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

  // Datepicker configuration
  datepickerConfig = {
    displayMonths: 1,
    navigation: 'arrows',
    outsideDays: 'visible',
    firstDayOfWeek: 1
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
    private notificationService: NotificationService,
    private calendar: NgbCalendar
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

    // Add search keyword if provided
    if (this.searchKeyword && this.searchKeyword.trim()) {
      params.keyword = this.searchKeyword.trim();
    }

    // Add client filter if selected
    if (this.selectedClient && this.selectedClient.trim()) {
      params.client = this.selectedClient.trim();
    }

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

          // Populate unique clients for filter
          this.populateUniqueClients();
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
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! This action will permanently delete the project.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoader = true;
        this.cirService.deleteProject(projectId).subscribe({
          next: (response: any) => {
            this.showLoader = false;
            if (response?.status === true) {
              Swal.fire(
                'Deleted!',
                'Project has been permanently deleted.',
                'success'
              );
              this.getProjectList();
            } else {
              Swal.fire(
                'Error!',
                response?.message || 'Failed to delete project',
                'error'
              );
            }
          },
          error: (error) => {
            this.showLoader = false;
            Swal.fire(
              'Error!',
              error?.error?.message || error?.message || 'Failed to delete project',
              'error'
            );
          }
        });
      }
    });
  }

  viewDetails(projectId: string): void {
    // Navigate to project details page or jobs page
    this.router.navigate(['/cir-admin/projects', projectId]);
  }

  viewJobs(projectId: string): void {
    // Navigate to job list page for the specific project
    this.router.navigate(['/cir-admin/jobs'], { queryParams: { projectId: projectId } });
  }

  openAddProjectModal(): void {
    // Navigate to add page instead of opening modal
    this.router.navigate(['/cir-admin/projects/add']);
  }

  openEditProjectModal(project: any): void {
    // Navigate to edit page instead of opening modal
    this.router.navigate(['/cir-admin/projects/edit', project._id]);
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
    this.searchKeyword = '';
    this.selectedStatus = 'All';
    this.selectedClient = '';
    this.currentPage = 1; // Reset to first page when filters are cleared
    this.getProjectList();
  }

  onStatusChange(status: 'Active' | 'Future Role' | 'Expired' | 'Completed' | 'All'): void {
    this.selectedStatus = status;
    this.currentPage = 1; // Reset to first page when filter changes
    this.getProjectList();
  }

  onClientChange(client: string): void {
    this.selectedClient = client;
    this.currentPage = 1; // Reset to first page when filter changes
    this.getProjectList();
  }

  refreshProjects(): void {
    this.currentPage = 1;
    this.showLoader = true;
    this.getProjectList();
  }

  onSearchInput(): void {
    // Debounce search input
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.getProjectList();
    }, 500);
  }

  onSearchEnter(): void {
    this.currentPage = 1;
    this.getProjectList();
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.currentPage = 1;
    this.getProjectList();
  }

  private populateUniqueClients(): void {
    const clients = this.projectlist.map(project => project.client).filter(Boolean);
    this.uniqueClients = [...new Set(clients)];
  }

  getStatusClass(status: string): string {
    if (!status) return '';

    // Convert status to lowercase and handle special cases
    const statusLower = status.toLowerCase().replace(/\s+/g, '-');

    // Map status values to CSS classes
    switch (statusLower) {
      case 'active':
        return 'active';
      case 'future-role':
        return 'future-role';
      case 'expired':
        return 'expired';
      case 'completed':
        return 'completed';
      default:
        return statusLower;
    }
  }
}
