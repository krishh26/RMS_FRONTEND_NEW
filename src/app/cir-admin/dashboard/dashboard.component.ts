import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cir-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class CirAdminDashboardComponent implements OnInit {

  stats = [
    {
      title: 'Total Projects',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: 'fas fa-project-diagram',
      color: '#3498db'
    },
    {
      title: 'Active Jobs',
      value: '18',
      change: '+8%',
      changeType: 'positive',
      icon: 'fas fa-briefcase',
      color: '#2ecc71'
    },
    {
      title: 'Total Users',
      value: '156',
      change: '+5%',
      changeType: 'positive',
      icon: 'fas fa-users',
      color: '#9b59b6'
    },
    {
      title: 'Applications',
      value: '89',
      change: '+23%',
      changeType: 'positive',
      icon: 'fas fa-file-alt',
      color: '#e67e22'
    }
  ];

  recentActivities = [
    {
      type: 'project',
      message: 'New project "E-commerce Platform" created',
      time: '2 hours ago',
      user: 'John Doe'
    },
    {
      type: 'job',
      message: 'Job "Senior Developer" posted',
      time: '4 hours ago',
      user: 'Jane Smith'
    },
    {
      type: 'user',
      message: 'New user "Mike Johnson" registered',
      time: '6 hours ago',
      user: 'System'
    },
    {
      type: 'application',
      message: 'Application received for "UI Designer" position',
      time: '8 hours ago',
      user: 'Sarah Wilson'
    }
  ];

  quickActions = [
    {
      title: 'Add New Project',
      description: 'Create a new project',
      icon: 'fas fa-plus',
      route: '/cir-admin/projects/add',
      color: '#3498db'
    },
    {
      title: 'Post New Job',
      description: 'Create a new job posting',
      icon: 'fas fa-briefcase',
      route: '/cir-admin/jobs/add',
      color: '#2ecc71'
    },
    {
      title: 'Add New User',
      description: 'Register a new user',
      icon: 'fas fa-user-plus',
      route: '/cir-admin/users/add',
      color: '#9b59b6'
    },
    {
      title: 'View Reports',
      description: 'Generate reports and analytics',
      icon: 'fas fa-chart-bar',
      route: '/cir-admin/reports',
      color: '#e67e22'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      project: 'fas fa-project-diagram',
      job: 'fas fa-briefcase',
      user: 'fas fa-user',
      application: 'fas fa-file-alt'
    };
    return icons[type] || 'fas fa-info-circle';
  }

  getActivityColor(type: string): string {
    const colors: { [key: string]: string } = {
      project: '#3498db',
      job: '#2ecc71',
      user: '#9b59b6',
      application: '#e67e22'
    };
    return colors[type] || '#95a5a6';
  }
}
