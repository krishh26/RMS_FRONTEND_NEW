import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CirSericeService } from '../../services/cir-service/cir-serice.service';
import { NotificationService } from '../../services/notification/notification.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-project-list-public',
  templateUrl: './project-list-public.component.html',
  styleUrls: ['./project-list-public.component.scss']
})
export class ProjectListPublicComponent implements OnInit {
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
  viewMode: 'grid' | 'list' = 'grid';

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

  // Computed property for minDate
  get minEndDate(): NgbDateStruct {
    return this.startDate || {
      year: 2000,
      month: 1,
      day: 1
    };
  }

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

    this.cirService.getPublicFutureCard(params).subscribe({
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
          this.notificationService.showError(response?.message || 'Failed to fetch public projects');
          this.showLoader = false;
        }
      },
      error: (error) => {
        this.projectlist = [];
        this.totalRecords = 0;
        this.notificationService.showError(error?.error?.message || error?.message || 'Failed to fetch public projects');
        this.showLoader = false;
      }
    });
  }

  viewProjectDetails(projectId: string): void {
    // Navigate to project details page
    this.router.navigate(['/cir-user/public-projects', projectId]);
  }

  joinProject(projectId: string): void {
    // Implement project join logic
    this.notificationService.showSuccess('Successfully joined the project!');
    console.log('Joining project:', projectId);
  }

  shareProject(projectId: string): void {
    // Implement project share logic
    if (navigator.share) {
      navigator.share({
        title: 'Check out this project',
        text: 'I found an interesting project you might be interested in',
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.notificationService.showSuccess('Project link copied to clipboard!');
      });
    }
  }

  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getProjectList();
  }

  // Helper method to pad single digit numbers with leading zero
  private padNumber(number: number): string {
    return number < 10 ? `0${number}` : number.toString();
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
