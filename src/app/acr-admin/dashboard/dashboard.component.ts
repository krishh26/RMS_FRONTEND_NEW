import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acr-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AcrAdminDashboardComponent implements OnInit {

  stats = [
    {
      title: 'Total Projects',
      value: '24',
      icon: 'fas fa-project-diagram',
      color: '#3498db',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Jobs',
      value: '18',
      icon: 'fas fa-briefcase',
      color: '#2ecc71',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Candidates',
      value: '156',
      icon: 'fas fa-user-graduate',
      color: '#f39c12',
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Contracts',
      value: '42',
      icon: 'fas fa-file-contract',
      color: '#9b59b6',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  recentActivities = [
    {
      type: 'project',
      title: 'New project created',
      description: 'E-commerce platform development',
      time: '2 hours ago',
      icon: 'fas fa-plus-circle',
      color: '#2ecc71'
    },
    {
      type: 'job',
      title: 'Job application received',
      description: 'Senior Developer position',
      time: '4 hours ago',
      icon: 'fas fa-user-plus',
      color: '#3498db'
    },
    {
      type: 'contract',
      title: 'Contract signed',
      description: 'Mobile app development',
      time: '1 day ago',
      icon: 'fas fa-file-signature',
      color: '#f39c12'
    },
    {
      type: 'candidate',
      title: 'New candidate registered',
      description: 'UI/UX Designer',
      time: '2 days ago',
      icon: 'fas fa-user-graduate',
      color: '#9b59b6'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getChangeClass(changeType: string): string {
    return changeType === 'positive' ? 'positive-change' : 'negative-change';
  }
}
