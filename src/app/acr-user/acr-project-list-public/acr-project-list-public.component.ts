import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acr-project-list-public',
  templateUrl: './acr-project-list-public.component.html',
  styleUrls: ['./acr-project-list-public.component.scss']
})
export class AcrProjectListPublicComponent implements OnInit {
  publicProjects: any[] = [
    {
      id: 1,
      name: 'Public Project 1',
      description: 'This is a public project focused on community development.',
      category: 'Community',
      status: 'Active',
      startDate: '2024-03-01',
      participants: 15
    },
    {
      id: 2,
      name: 'Public Project 2',
      description: 'Environmental conservation project open for public participation.',
      category: 'Environment',
      status: 'Active',
      startDate: '2024-03-15',
      participants: 28
    },
    {
      id: 3,
      name: 'Public Project 3',
      description: 'Educational initiative for underprivileged communities.',
      category: 'Education',
      status: 'Active',
      startDate: '2024-04-01',
      participants: 42
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Here you would typically fetch public projects from a service
  }

  viewProjectDetails(projectId: number): void {
    // Implement project details view logic
    console.log('Viewing project details:', projectId);
  }

  joinProject(projectId: number): void {
    // Implement project join logic
    console.log('Joining project:', projectId);
  }

  shareProject(projectId: number): void {
    // Implement project share logic
    console.log('Sharing project:', projectId);
  }
}
