import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CirAdminSidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-cir-admin-layout',
  templateUrl: './cir-admin-layout.component.html',
  styleUrls: ['./cir-admin-layout.component.scss']
})
export class CirAdminLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild(CirAdminSidebarComponent) sidebar!: CirAdminSidebarComponent;

  currentPageTitle = '';
  currentBreadcrumb: string[] = [];
  isSidebarCollapsed = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updatePageInfo(event.url);
      });
  }

  ngAfterViewInit() {
    // Initial sidebar state
    if (this.sidebar) {
      this.isSidebarCollapsed = this.sidebar.isCollapsed;
      this.cdr.detectChanges();
    }
  }

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
    this.cdr.detectChanges();
  }

  updatePageInfo(url: string) {
    // Extract page title and breadcrumb from URL
    const segments = url.split('/').filter(segment => segment);

    if (segments.length >= 2 && segments[0] === 'cir-admin') {
      const page = segments[1];
      this.currentPageTitle = this.getPageTitle(page);
      this.currentBreadcrumb = this.getBreadcrumb(segments);
    }
  }

  getPageTitle(page: string): string {
    const titles: { [key: string]: string } = {
      'projects': 'Project Management',
      'jobs': 'Job Management',
      'users': 'User Management',
      'reports': 'Reports & Analytics',
      'settings': 'Settings'
    };
    return titles[page] || 'Dashboard';
  }

  getBreadcrumb(segments: string[]): string[] {
    const breadcrumb: string[] = ['CIR Admin'];

    segments.forEach((segment, index) => {
      if (index > 0) { // Skip 'cir-admin'
        const title = this.getPageTitle(segment);
        breadcrumb.push(title);
      }
    });

    return breadcrumb;
  }
}
