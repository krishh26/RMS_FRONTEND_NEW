import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: any[] = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'New York',
      type: 'Full-time',
      experience: '5+ years',
      postedDate: '2024-03-01',
      status: 'Active',
      applications: 12
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'San Francisco',
      type: 'Full-time',
      experience: '3+ years',
      postedDate: '2024-03-02',
      status: 'Active',
      applications: 8
    },
    {
      id: 3,
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Contract',
      experience: '2+ years',
      postedDate: '2024-03-03',
      status: 'Closed',
      applications: 15
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Here you would typically fetch jobs from a service
  }

  editJob(jobId: number): void {
    console.log('Edit job:', jobId);
  }

  deleteJob(jobId: number): void {
    console.log('Delete job:', jobId);
  }

  viewApplications(jobId: number): void {
    console.log('View applications for job:', jobId);
  }

  toggleJobStatus(jobId: number): void {
    console.log('Toggle job status:', jobId);
  }
}
