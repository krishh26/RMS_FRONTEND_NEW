import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AcrServiceService } from 'src/app/services/acr-service/acr-service.service';
import { CirSericeService } from 'src/app/services/cir-service/cir-serice.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { pagination } from 'src/app/shared/constant/pagination.constant';
import { Payload } from 'src/app/shared/constant/payload.const';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  resourcesForm!: FormGroup;
  file: any;
  joblist: any = [];
  jobDetails: any;
  cvDetails: any;

  public timerSubscription: Subscription = new Subscription();
  selectedCV: any = null;
  newCVData: any = null;
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  newCV: boolean = false;
  submitRes: boolean = false;
  errorData: boolean = true;
  selectedStatus: string = '';
  loginData: any;
  statusList: string[] = ['QA', "Non-QA", "All"];
  searchText: any;
  selectedFilterStatus: string = '';

  // Project related properties
  projectId: string = '';
  projectDetails: any = null;
  projectName: string = '';

  // Dropdown properties
  openDropdownId: string | null = null;
  dropdownPosition: { top: number; left: number } = { top: 0, left: 0 };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private acrservice: AcrServiceService,
    private cirService: CirSericeService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.loginData = localStorage.getItem('loginUser');
    this.resourcesForm = this.fb.group({
      howmanyresources: ['', Validators.required],
      candidates: this.fb.array([this.createCandidateFormGroup()])
    });
  }

  ngOnInit() {
    this.loginData = JSON.parse(localStorage.getItem('loginUser') || '{}');

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

  onSelectExistingCV() {
    const storedCV = this.loginData?.cv;
    this.newCV = false;
    if (storedCV) {
      this.selectedCV = storedCV;
    } else {
      this.selectedCV = null;
      this.notificationService.showError('No CV data found in local storage.');
    }
  }

  onChangeInput() {
    this.resourcesForm.value?.candidates?.map((element: any) => {
      if (!element?.cv || !element?.candidate_location || !element?.candidate_nationality) {
        this.errorData = true;
      } else {
        this.errorData = false;
      }
    });
  }

  removeAll() {
    (this.resourcesForm.controls['candidates'] as FormArray).clear();
  }


  newselectedCv() {
    this.newCV = true;
    this.selectedCV = null;
  }

  submitCV() {
    const loginData = this.localStorageService.getLogger();
    let payload = {
      user_id: loginData._id,
      job_id: this.jobDetails.job_id,
      applied: true,
      resources: this.resourcesForm.controls['howmanyresources'].value,
      cvDetails: this.resourcesForm.value?.candidates?.filter((element: any) => delete element['howmanyresources'])
    }
    let errorCounter: number = 0;

    payload?.cvDetails?.map((element: any) => {
      if (!element?.cv || !element?.candidate_location || !element?.candidate_nationality) {
        errorCounter++;
      }
    });

    if (errorCounter > 0) {
      return this.notificationService.showError('Please fill details');
    }

    this.acrservice.updateApplication(payload).subscribe((response) => {
      if (response?.status) {
        this.getProjectList();
        this.modalService.dismissAll();
      }
    }, (error) => {
      this.modalService.dismissAll();
      this.notificationService.showError(error?.error?.message || 'Something went wrong.')
    })
  }

  workPreferenceSelection: string[] = [];
  workPreference: any[] = [];

  onCheckboxWorkPReference(event: any) {
    const value = event.target.value;

    if (event.target.checked) {
      if (!this.workPreferenceSelection.includes(value)) {
        this.workPreferenceSelection.push(value);
      }
    } else {
      this.workPreferenceSelection = this.workPreferenceSelection.filter(role => role !== value);
    }
  }

  selectedWorkPreference(type: string): boolean {
    return this.workPreference?.includes(type);
  }

  submitResources() {
    if (this.workPreferenceSelection?.length == 0) {
      return this.notificationService.showError('Please select work preferences.');
    }

    const loginData = this.localStorageService.getLogger();
    this.submitRes = false;

    let cvData = {
      key: '',
      url: '',
      name: ''
    };

    if (this.selectedCV) {
      cvData = {
        key: this.selectedCV.key,
        url: this.selectedCV.url,
        name: this.selectedCV.name
      };
    }
    if (this.newCV) {
      cvData = {
        key: this.newCVData.key,
        url: this.newCVData.url,
        name: this.newCVData.name
      };
    }

    let payload = {
      cv: cvData,
      workPreference: this.workPreferenceSelection.join(',')
    };

    this.acrservice.acrapplyJob(payload, this.jobDetails.job_id).subscribe((response) => {
      if (response?.status) {
        this.getProjectList();
        this.newCV = false;
        this.modalService.dismissAll();
        this.notificationService.showSuccess(response?.message);
      }
    }, (error) => {
      this.newCV = false;
      this.modalService.dismissAll();
      this.notificationService.showError(error?.error?.message || 'Something went wrong.');
    });
  }

  get candidates(): FormArray | any {
    return this.resourcesForm.get('candidates') as FormArray;
  }

  createCandidateFormGroup(): FormGroup {
    return this.fb.group({
      howmanyresources: ['', Validators.required],
      cv: ['', [Validators.required]],
      candidate_nationality: ['', Validators.required],
      candidate_location: ['', Validators.required]
    });
  }

  closeModal() {
    this.modalService.dismissAll();
    this.newCV = false;
    this.selectedCV = null;
    this.submitRes = false;
  }

  fileUpload(event: any): void {
    this.submitRes = true;
    const file = event.target.files[0];
    const data = new FormData();
    data.append('files', file || '');

    this.acrservice.fileUpload(data).subscribe((response) => {
      if (response?.status) {
        this.newCVData = response?.data;
        this.submitRes = false;
        this.notificationService.showSuccess(response?.message || 'File successfully uploaded.')
      } else {
        this.submitRes = false;
        this.notificationService.showError(response?.message || 'File not uploaded.')
      }
    }, (error) => {
      this.submitRes = false;
      this.notificationService.showError(error?.error?.message || 'File not uploaded.')
    })
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
        this.joblist = response?.data;
        this.totalRecords = response?.meta_data?.items;
        this.page = response?.meta_data?.page;
        this.pagesize = response?.meta_data?.page_size;
      }
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
        this.joblist = response?.data;
        this.totalRecords = response?.meta_data?.items;
        this.page = response?.meta_data?.page;
        this.pagesize = response?.meta_data?.page_size;
      } else {
        this.notificationService.showError(response?.message);
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message);
    });
  }

  async applyStatusFilter() {
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
          );
        } else {
          this.joblist = response?.data;
        }
        this.totalRecords = response?.meta_data?.items;
        this.page = response?.meta_data?.page;
        this.pagesize = response?.meta_data?.page_size;
      } else {
        this.notificationService.showError(response?.message);
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message);
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
    this.router.navigate(['/cir-admin/jobs/add'], {
      queryParams: { 
        projectId: this.projectId,
        jobId: job.job_id
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

  showApplications(job: any): void {
    // Close dropdown and navigate to applications page for this specific job
    this.closeDropdown();
    this.router.navigate(['/cir-admin/applications'], {
      queryParams: { 
        jobId: job.job_id,
        projectId: this.projectId,
        jobTitle: job.job_title
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
    const dropdownWidth = isMobile ? 140 : 160; // min-width from CSS
    const dropdownHeight = 200; // approximate height for 4 items
    
    let left: number;
    let top = rect.bottom + 5;
    
    if (isMobile) {
      // Center the dropdown on mobile
      left = rect.left + (rect.width / 2) - (dropdownWidth / 2);
    } else {
      // Position to the right of the button on desktop
      left = rect.right - dropdownWidth;
      
      // Check if dropdown would go off the right edge
      if (left < 10) {
        left = rect.left - dropdownWidth + rect.width;
      }
    }
    
    // Check if dropdown would go off the bottom edge
    if (top + dropdownHeight > window.innerHeight - 10) {
      top = rect.top - dropdownHeight - 5;
    }
    
    // Ensure dropdown doesn't go off the left edge
    if (left < 10) {
      left = 10;
    }
    
    // Ensure dropdown doesn't go off the right edge
    if (left + dropdownWidth > window.innerWidth - 10) {
      left = window.innerWidth - dropdownWidth - 10;
    }
    
    // Ensure dropdown doesn't go off the top edge
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

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  appliedRoleData(jobId: string) {
    this.router.navigate(['/cir-admin/jobs/applications', jobId], {
      queryParams: { projectId: this.projectId }
    });
  }

  sendJobMail(jobId: string) {
    this.closeDropdown();
    this.router.navigate(['/cir-admin/jobs/send', jobId], {
      queryParams: { projectId: this.projectId }
    });
  }
}
