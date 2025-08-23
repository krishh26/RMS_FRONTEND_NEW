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
  selector: 'app-cir-admin-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class CirAdminSidebarComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<boolean>();

  isCollapsed = false;
  isMobile = false;
  activeRoute = '';

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/cir-admin',
      badge: null,
      expanded: false
    },
    {
      label: 'Projects',
      icon: 'fas fa-project-diagram',
      route: '/cir-admin/projects',
      badge: null,
      expanded: false,
      subItems: [
        { label: 'All Projects', route: '/cir-admin/projects' },
        { label: 'Add Project', route: '/cir-admin/projects/add' }
      ]
    },
    // {
    //   label: 'Jobs',
    //   icon: 'fas fa-briefcase',
    //   route: '/cir-admin/jobs',
    //   badge: null,
    //   expanded: false,
    //   subItems: [
    //     { label: 'All Jobs', route: '/cir-admin/jobs' },
    //     { label: 'Add Job', route: '/cir-admin/jobs/add' },
    //     { label: 'Applications', route: '/cir-admin/jobs/applications' }
    //   ]
    // },
    {
      label: 'Users',
      icon: 'fas fa-users',
      route: '/cir-admin/users',
      badge: null,
      expanded: false,
      subItems: [
        { label: 'All Users', route: '/cir-admin/users' },
        { label: 'Add User', route: '/cir-admin/users/add' }
      ]
    },
    // {
    //   label: 'Reports',
    //   icon: 'fas fa-chart-bar',
    //   route: '/cir-admin/reports',
    //   badge: null,
    //   expanded: false
    // },
    {
      label: 'Settings',
      icon: 'fas fa-cog',
      route: '/cir-admin/settings',
      badge: null,
      expanded: false
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
    if (route === '/cir-admin') {
      return this.activeRoute === route || this.activeRoute === '/cir-admin/';
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
      // e.g., /cir-admin/users should match /cir-admin/users but not /cir-admin/users/add
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
