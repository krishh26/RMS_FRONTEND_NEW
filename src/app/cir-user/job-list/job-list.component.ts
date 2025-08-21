import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: any[] = [
    { id: 1, title: 'Software Engineer', company: 'Tech Corp', location: 'New York', type: 'Full-time', postedDate: '2024-03-01' },
    { id: 2, title: 'Product Manager', company: 'Innovation Inc', location: 'San Francisco', type: 'Full-time', postedDate: '2024-03-02' },
    { id: 3, title: 'UX Designer', company: 'Design Studio', location: 'Remote', type: 'Contract', postedDate: '2024-03-03' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Here you would typically fetch jobs from a service
  }

  viewJob(jobId: number): void {
    // Implement job view logic
    console.log('Viewing job:', jobId);
  }

  applyForJob(jobId: number): void {
    // Implement job application logic
    console.log('Applying for job:', jobId);
  }

  saveJob(jobId: number): void {
    // Implement job save logic
    console.log('Saving job:', jobId);
  }
}
