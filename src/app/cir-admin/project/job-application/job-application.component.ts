import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.scss']
})
export class JobApplicationComponent implements OnInit {
  applications: any[] = [
    {
      id: 1,
      jobTitle: 'Senior Software Engineer',
      applicant: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234-567-8900',
      experience: '6 years',
      status: 'Under Review',
      appliedDate: '2024-03-15'
    },
    {
      id: 2,
      jobTitle: 'Senior Software Engineer',
      applicant: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234-567-8901',
      experience: '8 years',
      status: 'Shortlisted',
      appliedDate: '2024-03-14'
    },
    {
      id: 3,
      jobTitle: 'Senior Software Engineer',
      applicant: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 234-567-8902',
      experience: '5 years',
      status: 'Rejected',
      appliedDate: '2024-03-13'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Here you would typically fetch applications from a service
  }

  viewApplication(applicationId: number): void {
    console.log('View application:', applicationId);
  }

  updateStatus(applicationId: number, status: string): void {
    console.log('Update application status:', applicationId, status);
  }

  downloadResume(applicationId: number): void {
    console.log('Download resume for application:', applicationId);
  }
}
