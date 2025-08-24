import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SubMenuItem {
  label: string;
  route: string;
}

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge: string | null;
  subItems?: SubMenuItem[];
  expanded: boolean;
}

@Component({
  selector: 'app-acr-admin-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class AcrAdminSidebarComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<boolean>();

  isCollapsed = false;
  isMobile = false;
  activeRoute = '';

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/acr-admin',
      badge: null,
      expanded: false
    },
    {
      label: 'Projects',
      icon: 'fas fa-project-diagram',
      route: '/acr-admin/projects',
      badge: null,
      expanded: false,
      subItems: [
        { label: 'All Projects', route: '/acr-admin/projects' },
        { label: 'Add Project', route: '/acr-admin/project/add' }
      ]
    },
    {
      label: 'Jobs',
      icon: 'fas fa-briefcase',
      route: '/acr-admin/jobs',
      badge: null,
      expanded: false,
      subItems: [
        { label: 'All Jobs', route: '/acr-admin/jobs' },
        { label: 'Add Job', route: '/acr-admin/job/add' },
        { label: 'Applications', route: '/acr-admin/job-applications' }
      ]
    },
    {
      label: 'Candidates',
      icon: 'fas fa-user-graduate',
      route: '/acr-admin/candidates',
      badge: null,
      expanded: false,
      subItems: [
        { label: 'All Candidates', route: '/acr-admin/candidates' },
        { label: 'Add Candidate', route: '/acr-admin/candidate/add' }
      ]
    },
    {
      label: 'Contracts',
      icon: 'fas fa-file-contract',
      route: '/acr-admin/contracts',
      badge: null,
      expanded: false,
      subItems: [
        { label: 'All Contracts', route: '/acr-admin/contracts' },
        { label: 'Add Contract', route: '/acr-admin/contract/add' }
      ]
    },
    {
      label: 'Users',
      icon: 'fas fa-users',
      route: '/acr-admin/users',
      badge: null,
      expanded: false,
      subItems: [
        { label: 'All Users', route: '/acr-admin/users' },
        { label: 'Add User', route: '/acr-admin/user/add' }
      ]
    }
  ];

  constructor(private router: Router) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeRoute = event.url;
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isCollapsed = true;
      this.sidebarToggle.emit(this.isCollapsed);
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggle.emit(this.isCollapsed);
  }

  closeMobileSidebar() {
    if (this.isMobile) {
      this.isCollapsed = true;
      this.sidebarToggle.emit(this.isCollapsed);
    }
  }

  isActiveRoute(route: string): boolean {
    if (route === '/acr-admin') {
      return this.activeRoute === route || this.activeRoute === '/acr-admin/';
    }

    // For exact route matches, use exact comparison
    if (this.activeRoute === route) {
      return true;
    }

    // For parent routes, check if it's a direct child (not a deeper nested route)
    if (this.activeRoute.startsWith(route)) {
      // Split both routes to check the depth
      const routeSegments = route.split('/').filter(segment => segment);
      const activeSegments = this.activeRoute.split('/').filter(segment => segment);

      // Only match if the active route is exactly one level deeper
      // e.g., /acr-admin/users should match /acr-admin/users but not /acr-admin/users/add
      return activeSegments.length === routeSegments.length + 1;
    }

    return false;
  }

  hasSubItems(item: MenuItem): boolean {
    return !!(item.subItems && item.subItems.length > 0);
  }

  isSubItemActive(subItem: SubMenuItem): boolean {
    return this.activeRoute === subItem.route;
  }

  toggleSubMenu(event: MouseEvent, item: MenuItem) {
    event.preventDefault();
    item.expanded = !item.expanded;
  }
}
