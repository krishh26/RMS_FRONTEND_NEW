import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AcrServiceService } from '../../services/acr-service/acr-service.service';
import { CirSericeService } from '../../services/cir-service/cir-serice.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { NotificationService } from '../../services/notification/notification.service';
import { pagination } from 'src/app/shared/constant/pagination.constant';
import { Payload } from 'src/app/shared/constant/payload.const';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  joblist: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  selectedStatus: string = '';
  statusList: string[] = ['QA', "Non-QA", "All"];
  searchText: any = '';
  selectedFilterStatus: string = '';

  // Project related properties
  projectId: string = '';
  projectDetails: any = null;
  projectName: string = '';

  // Dropdown properties
  openDropdownId: string | null = null;
  dropdownPosition: { top: number; left: number } = { top: 0, left: 0 };

  // Make Math available in template
  Math = Math;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private acrservice: AcrServiceService,
    private cirService: CirSericeService,
  ) {}

  ngOnInit() {
    // Get project_id from query parameters
    this.activatedRoute.queryParams.subscribe(params => {
      this.projectId = params['projectId'] || '';
      if (this.projectId) {
        this.getProjectDetails();
        this.getProjectList();
      } else {
        this.notificationService.showError('Project ID is required');
      }
    });
  }

  getProjectDetails() {
    if (!this.projectId) {
      this.notificationService.showError('Project ID is required');
      return;
    }

    this.cirService.getProjectDetails(this.projectId).subscribe((response: any) => {
      if (response?.status) {
        this.projectDetails = response?.data;
        this.projectName = response?.data?.projectName || 'Unknown Project';
        console.log('Project details:', this.projectDetails);
      } else {
        this.notificationService.showError(response?.message || 'Failed to fetch project details');
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Failed to fetch project details');
    });
  }

  getProjectList(records?: number) {
    Payload.projectList.page = String(this.page);
    Payload.projectList.limit = String(this.pagesize);
    if (records) {
      Payload.projectList.limit = String(records);
    }

    // Add project_id to the payload if available
    if (this.projectId) {
      Payload.projectList.project_id = this.projectId;
    }

    this.acrservice.getCirJobList(Payload.projectList).subscribe((response: any) => {
      if (response?.status) {
        this.joblist = response?.data || [];
        this.totalRecords = response?.meta_data?.items || 0;
        this.page = response?.meta_data?.page || 1;
        this.pagesize = response?.meta_data?.page_size || this.pagesize;
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Failed to fetch jobs');
    });
  }

  searchtext() {
    Payload.projectList.page = String(this.page);
    Payload.projectList.limit = String(this.pagesize);
    Payload.projectList.keyword = this.searchText || '';
    Payload.projectList.job_type = this.selectedStatus;

    // Add project_id to the payload if available
    if (this.projectId) {
      Payload.projectList.project_id = this.projectId;
    }

    this.acrservice.getCirJobList(Payload.projectList).subscribe((response) => {
      this.joblist = [];
      this.totalRecords = 0;
      if (response?.status == true) {
        this.joblist = response?.data || [];
        this.totalRecords = response?.meta_data?.items || 0;
        this.page = response?.meta_data?.page || 1;
        this.pagesize = response?.meta_data?.page_size || this.pagesize;
      } else {
        this.notificationService.showError(response?.message || 'No jobs found');
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Failed to search jobs');
    });
  }

  applyStatusFilter() {
    Payload.projectList.page = String(this.page);
    Payload.projectList.limit = String(1000000);
    Payload.projectList.keyword = this.searchText || '';
    Payload.projectList.job_type = this.selectedStatus;

    // Add project_id to the payload if available
    if (this.projectId) {
      Payload.projectList.project_id = this.projectId;
    }

    this.acrservice.getCirJobList(Payload.projectList).subscribe((response) => {
      this.joblist = [];
      this.totalRecords = 0;
      if (response?.status == true) {
        if (this.selectedFilterStatus) {
          this.joblist = response?.data?.filter((job: any) =>
            job.status === this.selectedFilterStatus
          ) || [];
        } else {
          this.joblist = response?.data || [];
        }
        this.totalRecords = response?.meta_data?.items || 0;
        this.page = response?.meta_data?.page || 1;
        this.pagesize = response?.meta_data?.page_size || this.pagesize;
      } else {
        this.notificationService.showError(response?.message || 'No jobs found');
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Failed to filter jobs');
    });
  }

  paginate(page: number) {
    this.page = page;
    if (this.selectedFilterStatus) {
      this.applyStatusFilter();
    } else if (this.searchText || this.selectedStatus) {
      this.searchtext();
    } else {
      this.getProjectList();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Action methods for job management
  editJob(job: any): void {
    // Close dropdown and navigate to edit job page with job ID and project ID
    this.closeDropdown();
    this.router.navigate(['/acr-admin/jobs/edit', job.job_id], {
      queryParams: {
        projectId: this.projectId
      }
    });
  }

  deleteJob(job: any): void {
    this.closeDropdown();
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete job "${job.job_title}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cirService.cirDeleteJob({}, job.job_id).subscribe({
          next: (response: any) => {
            if (response?.status === true) {
              Swal.fire(
                'Deleted!',
                'Job has been successfully deleted.',
                'success'
              );
              // Refresh the job list
              this.getProjectList();
            } else {
              Swal.fire(
                'Error!',
                response?.message || 'Failed to delete job',
                'error'
              );
            }
          },
          error: (error) => {
            Swal.fire(
              'Error!',
              error?.error?.message || error?.message || 'Failed to delete job',
              'error'
            );
          }
        });
      }
    });
  }

  // Dropdown methods
  toggleDropdown(jobId: string, event: Event): void {
    if (this.openDropdownId === jobId) {
      this.closeDropdown();
    } else {
      this.closeDropdown();
      this.openDropdownId = jobId;
      this.calculateDropdownPosition(event);
    }
  }

  private calculateDropdownPosition(event: Event): void {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;
    const dropdownWidth = isMobile ? 140 : 160;
    const dropdownHeight = 200;

    let left: number;
    let top = rect.bottom + 5;

    if (isMobile) {
      left = rect.left + (rect.width / 2) - (dropdownWidth / 2);
    } else {
      left = rect.right - dropdownWidth;
      if (left < 10) {
        left = rect.left - dropdownWidth + rect.width;
      }
    }

    if (top + dropdownHeight > window.innerHeight - 10) {
      top = rect.top - dropdownHeight - 5;
    }

    if (left < 10) {
      left = 10;
    }

    if (left + dropdownWidth > window.innerWidth - 10) {
      left = window.innerWidth - dropdownWidth - 10;
    }

    if (top < 10) {
      top = 10;
    }

    this.dropdownPosition = { top, left };
  }

  closeDropdown(): void {
    this.openDropdownId = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.closeDropdown();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (this.openDropdownId) {
      this.closeDropdown();
    }
  }

  appliedRoleData(jobId: string) {
    this.router.navigate(['/acr-admin/jobs/applications', jobId], {
      queryParams: { projectId: this.projectId }
    });
  }

  sendJobMail(jobId: string) {
    this.closeDropdown();
    this.router.navigate(['/acr-admin/jobs/send', jobId], {
      queryParams: { projectId: this.projectId }
    });
  }
}
