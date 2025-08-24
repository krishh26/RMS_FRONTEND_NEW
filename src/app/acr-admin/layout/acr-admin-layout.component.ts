import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-acr-admin-layout',
  templateUrl: './acr-admin-layout.component.html',
  styleUrls: ['./acr-admin-layout.component.scss']
})
export class AcrAdminLayoutComponent implements OnInit {
  @ViewChild('userMenu') userMenu!: ElementRef;

  isSidebarCollapsed = false;
  isUserDropdownOpen = false;
  currentPageTitle = 'Dashboard';
  currentBreadcrumb: string[] = ['ACR Admin'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updatePageInfo(event.url);
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.userMenu?.nativeElement?.contains(event.target as Node)) {
      this.isUserDropdownOpen = false;
    }
  }

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  navigateToProfile() {
    // Navigate to profile page
    this.isUserDropdownOpen = false;
  }

  logout() {
    // Implement logout logic
    this.isUserDropdownOpen = false;
    // Navigate to login page or clear session
  }

  private updatePageInfo(url: string) {
    const segments = url.split('/').filter(segment => segment);

    if (segments.length >= 2) {
      const section = segments[1];
      const action = segments[2];

      // Update page title based on route
      if (section === 'projects') {
        this.currentPageTitle = action === 'add' ? 'Add Project' : 'Projects';
      } else if (section === 'jobs') {
        this.currentPageTitle = action === 'add' ? 'Add Job' : 'Jobs';
      } else if (section === 'candidates') {
        this.currentPageTitle = action === 'add' ? 'Add Candidate' : 'Candidates';
      } else if (section === 'contracts') {
        this.currentPageTitle = action === 'add' ? 'Add Contract' : 'Contracts';
      } else if (section === 'users') {
        this.currentPageTitle = action === 'add' ? 'Add User' : 'Users';
      } else if (section === 'job-applications') {
        this.currentPageTitle = 'Job Applications';
      } else if (section === 'send-job') {
        this.currentPageTitle = 'Send Job';
      } else {
        this.currentPageTitle = 'Dashboard';
      }

      // Update breadcrumb
      this.currentBreadcrumb = ['ACR Admin'];
      if (section !== 'acr-admin') {
        this.currentBreadcrumb.push(this.capitalizeFirst(section));
        if (action && action !== 'add' && action !== 'edit') {
          this.currentBreadcrumb.push(this.capitalizeFirst(action));
        }
      }
    } else {
      this.currentPageTitle = 'Dashboard';
      this.currentBreadcrumb = ['ACR Admin'];
    }
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
