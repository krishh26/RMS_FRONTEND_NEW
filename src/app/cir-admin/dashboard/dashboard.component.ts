import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CirSericeService } from 'src/app/services/cir-service/cir-serice.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-cir-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class CirAdminDashboardComponent implements OnInit {
  loading = false;
  dashboardData: any = null;

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
      title: 'Active Projects',
      value: '18',
      change: '+8%',
      changeType: 'positive',
      icon: 'fas fa-play-circle',
      color: '#2ecc71'
    },
    {
      title: 'Future Projects',
      value: '4',
      change: '+2%',
      changeType: 'positive',
      icon: 'fas fa-clock',
      color: '#f39c12'
    },
    {
      title: 'Expired Projects',
      value: '2',
      change: '-1%',
      changeType: 'negative',
      icon: 'fas fa-times-circle',
      color: '#e74c3c'
    },
    {
      title: 'Active Roles',
      value: '12',
      change: '+5%',
      changeType: 'positive',
      icon: 'fas fa-user-tie',
      color: '#9b59b6'
    },
    {
      title: 'Future Roles',
      value: '3',
      change: '+1%',
      changeType: 'positive',
      icon: 'fas fa-calendar-plus',
      color: '#1abc9c'
    },
    {
      title: 'Expired Roles',
      value: '1',
      change: '0%',
      changeType: 'neutral',
      icon: 'fas fa-calendar-times',
      color: '#95a5a6'
    },
    {
      title: 'Total Users',
      value: '156',
      change: '+5%',
      changeType: 'positive',
      icon: 'fas fa-users',
      color: '#34495e'
    },
    {
      title: 'Active Users',
      value: '142',
      change: '+8%',
      changeType: 'positive',
      icon: 'fas fa-user-check',
      color: '#27ae60'
    },
    {
      title: 'Inactive Users',
      value: '14',
      change: '-3%',
      changeType: 'negative',
      icon: 'fas fa-user-times',
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
      icon: 'fas fa-project-diagram',
      route: '/cir-admin/projects/add',
      color: '#3498db'
    },
    {
      title: 'Add New User',
      description: 'Register a new user',
      icon: 'fas fa-user-plus',
      route: '/cir-admin/users/add',
      color: '#9b59b6'
    }
  ];

  constructor(
    private router: Router,
    private cirService: CirSericeService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.cirService.getCIRDashboard().subscribe(
      (response) => {
        this.loading = false;
        console.log('Dashboard API Response:', response);
        if (response?.status) {
          this.dashboardData = response.data;
          console.log('Dashboard Data:', response.data);
          this.updateStatsFromAPI(response.data);
        } else {
          this.notificationService.showError(response?.message || 'Failed to load dashboard data');
        }
      },
      (error) => {
        this.loading = false;
        this.notificationService.showError(error?.error?.message || 'Failed to load dashboard data');
        console.error('Dashboard API Error:', error);
      }
    );
  }

  updateStatsFromAPI(data: any): void {
    // Update stats with real data from API
    console.log('Updating stats with data:', data);
    if (data) {
      this.stats = [
        {
          title: 'Total Projects',
          value: data.totalProjects?.toString() || '0',
          change: 'Current',
          changeType: 'neutral',
          icon: 'fas fa-project-diagram',
          color: '#3498db'
        },
        {
          title: 'Active Projects',
          value: data.activeProjects?.toString() || '0',
          change: 'Current',
          changeType: 'neutral',
          icon: 'fas fa-play-circle',
          color: '#2ecc71'
        },
        {
          title: 'Future Projects',
          value: data.futureProjects?.toString() || '0',
          change: 'Current',
          changeType: 'neutral',
          icon: 'fas fa-clock',
          color: '#f39c12'
        },
        {
          title: 'Expired Projects',
          value: data.expiredProjects?.toString() || '0',
          change: 'Current',
          changeType: 'neutral',
          icon: 'fas fa-times-circle',
          color: '#e74c3c'
        },
        {
          title: 'Active Roles',
          value: data.activeRoles?.toString() || '0',
          change: 'Current',
          changeType: 'neutral',
          icon: 'fas fa-user-tie',
          color: '#9b59b6'
        },
        {
          title: 'Future Roles',
          value: data.futureRoles?.toString() || '0',
          change: 'Current',
          changeType: 'neutral',
          icon: 'fas fa-calendar-plus',
          color: '#1abc9c'
        },
        {
          title: 'Expired Roles',
          value: data.expiredRoles?.toString() || '0',
          change: 'Current',
          changeType: 'neutral',
          icon: 'fas fa-calendar-times',
          color: '#95a5a6'
        },
        {
          title: 'Total Users',
          value: data.totalUsers?.toString() || '0',
          change: 'Current',
          changeType: 'neutral',
          icon: 'fas fa-users',
          color: '#34495e'
        },
        {
          title: 'Active Users',
          value: data.activeUsers?.toString() || '0',
          change: 'Current',
          changeType: 'neutral',
          icon: 'fas fa-user-check',
          color: '#27ae60'
        },
        {
          title: 'Inactive Users',
          value: data.inactiveUsers?.toString() || '0',
          change: 'Current',
          changeType: 'neutral',
          icon: 'fas fa-user-times',
          color: '#e67e22'
        }
      ];
    }
  }

  getChangeType(change: string): string {
    if (!change) return 'neutral';
    if (change.startsWith('+')) return 'positive';
    if (change.startsWith('-')) return 'negative';
    return 'neutral';
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

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
