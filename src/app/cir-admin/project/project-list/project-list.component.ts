import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
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

  constructor() { }

  ngOnInit(): void {
    // Here you would typically fetch projects from a service
  }

  editProject(projectId: number): void {
    console.log('Edit project:', projectId);
  }

  deleteProject(projectId: number): void {
    console.log('Delete project:', projectId);
  }

  viewDetails(projectId: number): void {
    console.log('View project details:', projectId);
  }
}
