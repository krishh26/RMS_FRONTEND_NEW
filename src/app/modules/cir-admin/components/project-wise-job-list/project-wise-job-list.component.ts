import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

interface Job {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  dueDate: string;
  projectId: number;
}

interface Project {
  id: number;
  name: string;
  jobs: Job[];
}

@Component({
  selector: 'app-project-wise-job-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule
  ],
  templateUrl: './project-wise-job-list.component.html',
  styleUrls: ['./project-wise-job-list.component.scss']
})
export class ProjectWiseJobListComponent {
  projects: Project[] = [
    {
      id: 1,
      name: 'E-commerce Platform',
      jobs: [
        {
          id: 1,
          title: 'User Authentication System',
          description: 'Implement secure user login and registration',
          status: 'In Progress',
          priority: 'High',
          assignedTo: 'John Doe',
          dueDate: '2024-04-15',
          projectId: 1
        },
        {
          id: 2,
          title: 'Payment Gateway Integration',
          description: 'Integrate Stripe payment system',
          status: 'Pending',
          priority: 'High',
          assignedTo: 'Jane Smith',
          dueDate: '2024-04-30',
          projectId: 1
        },
        {
          id: 3,
          title: 'Shopping Cart Functionality',
          description: 'Implement cart management and checkout',
          status: 'Completed',
          priority: 'Medium',
          assignedTo: 'Mike Johnson',
          dueDate: '2024-03-20',
          projectId: 1
        }
      ]
    },
    {
      id: 2,
      name: 'CRM System',
      jobs: [
        {
          id: 4,
          title: 'Customer Database Design',
          description: 'Design and implement customer data structure',
          status: 'Completed',
          priority: 'High',
          assignedTo: 'Sarah Wilson',
          dueDate: '2024-01-10',
          projectId: 2
        },
        {
          id: 5,
          title: 'Lead Management Module',
          description: 'Create lead tracking and management system',
          status: 'Completed',
          priority: 'Medium',
          assignedTo: 'Tom Brown',
          dueDate: '2024-01-05',
          projectId: 2
        }
      ]
    },
    {
      id: 3,
      name: 'Mobile App',
      jobs: [
        {
          id: 6,
          title: 'UI/UX Design',
          description: 'Create mobile app wireframes and mockups',
          status: 'Planning',
          priority: 'High',
          assignedTo: 'Lisa Chen',
          dueDate: '2024-04-01',
          projectId: 3
        },
        {
          id: 7,
          title: 'Cross-platform Setup',
          description: 'Set up React Native development environment',
          status: 'Planning',
          priority: 'Medium',
          assignedTo: 'David Lee',
          dueDate: '2024-03-15',
          projectId: 3
        }
      ]
    }
  ];

  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed':
        return 'primary';
      case 'In Progress':
        return 'accent';
      case 'Pending':
        return 'warn';
      case 'Planning':
        return 'accent';
      default:
        return 'primary';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High':
        return 'warn';
      case 'Medium':
        return 'accent';
      case 'Low':
        return 'primary';
      default:
        return 'primary';
    }
  }

  viewJob(job: Job): void {
    console.log('View job:', job);
    // Implement view logic
  }

  editJob(job: Job): void {
    console.log('Edit job:', job);
    // Implement edit logic
  }

  deleteJob(job: Job): void {
    if (confirm(`Are you sure you want to delete job "${job.title}"?`)) {
      // Remove job from the project
      const project = this.projects.find(p => p.id === job.projectId);
      if (project) {
        project.jobs = project.jobs.filter(j => j.id !== job.id);
      }
      console.log('Job deleted:', job);
    }
  }
}
