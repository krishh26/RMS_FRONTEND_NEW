import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../../../services/database-service/database.service';

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.scss']
})
export class JobApplicationComponent implements OnInit {
  showFilter: boolean = false;
  jobId!: string;
  projectId: string = '';
  isLoading: boolean = false;
  
  // Search and filter properties
  searchText: string = '';
  selectedStatus: string = '';
  selectedWorkType: string = '';
  statusList: string[] = ['Under Review', 'Shortlisted', 'Rejected', 'Selected'];
  workTypeList: string[] = ['full-time', 'part-time', 'contract', 'freelance'];
  
  // Pagination properties
  page: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  
  tableHeader: string[] = [
    "Sr No.",
    "Job ID",
    "Job Title",
    "Candidate Name",
    "Phone Number",
    "Email",
    "Current Work Type",
    "Expected DayRate",
    "Work Preference",
    "CV",
    "Applied Date"
  ];
  tableData: any[] = [];
  filteredData: any[] = [];
  exportData: any[] = [];

  constructor(
    private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.paramMap.subscribe(params => {
      this.jobId = params.get('id') as string;
    });
    
    // Get projectId from query parameters
    this.route.queryParams.subscribe(params => {
      this.projectId = params['projectId'] || '';
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.isLoading = true;
    this.tableData = [];
    this.exportData = [];
    
    this.databaseService.getCIRJobApplicant(this.jobId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response?.status) {
          this.tableData = response?.data || [];
          this.totalRecords = this.tableData.length;
          this.applyFilters();
          this.prepareExportData();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching job applications:', error);
      }
    })
  }

  applyFilters() {
    let filtered = [...this.tableData];

    // Apply search filter
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item?.user?.name?.toLowerCase().includes(searchLower) ||
        item?.user?.email?.toLowerCase().includes(searchLower) ||
        item?.jobDetails?.job_title?.toLowerCase().includes(searchLower) ||
        item?.job_id?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(item => 
        item?.status?.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }

    // Apply work type filter
    if (this.selectedWorkType) {
      filtered = filtered.filter(item => 
        item?.user?.currentWork?.toLowerCase() === this.selectedWorkType.toLowerCase()
      );
    }

    this.filteredData = filtered;
    this.totalRecords = filtered.length;
  }

  prepareExportData() {
    this.exportData = [];
    this.filteredData?.map((item, index) => {
      this.exportData.push({
        srNo: index + 1,
        job_id: item?.job_id,
        job_title: item?.jobDetails?.job_title,
        candidate_name: item?.user?.name,
        phone_number: item?.user?.countrycode + ' ' + item?.user?.phoneNumber,
        email: item?.user?.email,
        currentWork: item?.user?.currentWork,
        expectedDayRate: item?.user?.expectedDayRate,
        workPreference: item?.workPreference?.join(', '),
        cv: item?.cvDetails?.url,
        applied_date: item?.createdAt
      })
    });
  }

  onSearch() {
    this.page = 1;
    this.applyFilters();
  }

  onFilterChange() {
    this.page = 1;
    this.applyFilters();
  }

  clearFilters() {
    this.searchText = '';
    this.selectedStatus = '';
    this.selectedWorkType = '';
    this.page = 1;
    this.applyFilters();
  }

  getPaginatedData() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredData.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.page = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.page - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  // Expose Math to template
  Math = Math;

  downloadAsExcel() {
    this.databaseService.ExportToExcel(this.exportData, "cir_job_applicant");
  }

  openDocument(document: any) {
    if (document?.url) {
      // Check if it's a PDF or other viewable document
      const fileExtension = document.url.split('.').pop()?.toLowerCase();
      const viewableExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'txt'];
      
      if (viewableExtensions.includes(fileExtension || '')) {
        // Open in new tab for viewable documents
        window.open(document.url, '_blank', 'noopener, noreferrer');
      } else {
        // For other file types, trigger download
        const link = document.createElement('a');
        link.href = document.url;
        link.download = document.name || 'document';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  goBack() {
    if (this.projectId) {
      this.router.navigate(['/cir-admin/jobs'], {
        queryParams: { projectId: this.projectId }
      });
    } else {
      this.router.navigate(['/cir-admin/jobs']);
    }
  }
}
