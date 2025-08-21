import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [
    { id: 1, name: 'Project 1', status: 'Active', startDate: '2024-03-01', endDate: '2024-06-30' },
    { id: 2, name: 'Project 2', status: 'Pending', startDate: '2024-04-01', endDate: '2024-07-31' },
    { id: 3, name: 'Project 3', status: 'Completed', startDate: '2024-02-01', endDate: '2024-05-31' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Here you would typically fetch projects from a service
  }

  viewProject(projectId: number): void {
    // Implement project view logic
    console.log('Viewing project:', projectId);
  }

  editProject(projectId: number): void {
    // Implement project edit logic
    console.log('Editing project:', projectId);
  }

  deleteProject(projectId: number): void {
    // Implement project delete logic
    console.log('Deleting project:', projectId);
  }
}
