import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CirSericeService } from '../../services/cir-service/cir-serice.service';
import { NotificationService } from '../../services/notification/notification.service';

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
  selectedStatus: 'Active' | 'Future Role' | 'Expired' | 'All' = 'Active';
  searchKeyword: string = '';
  searchTimeout: any;
  Math = Math; // Make Math available in template

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

    // Add search keyword if provided
    if (this.searchKeyword && this.searchKeyword.trim()) {
      params.keyword = this.searchKeyword.trim();
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

  viewJobs(projectId: string): void {
    // Navigate to job list page for the specific project
    this.router.navigate(['/cir-user/jobs'], { queryParams: { projectId: projectId } });
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getProjectList();
  }

  clearFilters(): void {
    this.searchKeyword = '';
    this.selectedStatus = 'All';
    this.currentPage = 1; // Reset to first page when filters are cleared
    this.getProjectList();
  }

  onStatusChange(status: 'Active' | 'Future Role' | 'Expired' | 'All'): void {
    this.selectedStatus = status;
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
