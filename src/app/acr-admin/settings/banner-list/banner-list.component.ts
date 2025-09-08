import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface Banner {
  id: number;
  page_type: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.scss']
})
export class BannerListComponent implements OnInit {
  banners: Banner[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  isLoading = false;

  // Page type labels for display
  pageTypeLabels: { [key: string]: string } = {
    'home': 'Home Page',
    'profile_page': 'Profile Page',
    'add_user': 'Add User Page',
    'job_post': 'Job Post Page'
  };

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.isLoading = true;
    const apiUrl = `${environment.baseUrl}/banner/`;
    const headers = this.getHeaders();

    this.http.get(apiUrl, { headers }).subscribe({
      next: (response: any) => {
        console.log('Banners loaded:', response);
        // Ensure banners is always an array
        this.banners = Array.isArray(response.results) ? response.results :
                      Array.isArray(response) ? response : [];
        this.totalItems = response.count || this.banners.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading banners:', error);
        this.isLoading = false;
        // Fallback to static data for demonstration
        this.loadStaticBanners();
      }
    });
  }

  loadStaticBanners(): void {
    // Static data for demonstration when API fails
    this.banners = [
      {
        id: 1,
        page_type: 'home',
        content: '<div class="banner-home"><h2>Welcome to our ACR Resource Management System</h2><p>This is the main banner displayed on the dashboard.</p></div>',
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        page_type: 'profile_page',
        content: '<div class="banner-notice"><h3>System Maintenance</h3><p>System maintenance scheduled for this weekend. Please save your work.</p></div>',
        created_at: '2024-01-20T10:00:00Z'
      },
      {
        id: 3,
        page_type: 'add_user',
        content: '<div class="banner-feature"><h3>New Features Available</h3><p>Check out our latest features including improved user management and reporting tools.</p></div>',
        created_at: '2024-01-25T10:00:00Z'
      },
      {
        id: 4,
        page_type: 'job_post',
        content: '<div class="banner-security"><h3>Security Alert</h3><p>Please update your password regularly for better security.</p></div>',
        created_at: '2024-02-01T10:00:00Z'
      }
    ];
    this.totalItems = this.banners.length;
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Add authorization header if needed
      // 'Authorization': `Bearer ${this.getToken()}`
    });
  }

  addBanner(): void {
    this.router.navigate(['/acr-admin/settings/banner'], { queryParams: { action: 'add' } });
  }

  editBanner(banner: Banner): void {
    this.router.navigate(['/acr-admin/settings/banner'], { queryParams: { action: 'edit', id: banner.id } });
  }

  deleteBanner(banner: Banner): void {
    if (confirm(`Are you sure you want to delete the banner for "${this.getPageTypeLabel(banner.page_type)}"?`)) {
      this.isLoading = true;
      const apiUrl = `${environment.baseUrl}/banner/${banner.id}/`;
      const headers = this.getHeaders();

      this.http.delete(apiUrl, { headers }).subscribe({
        next: (response: any) => {
          console.log('Banner deleted successfully:', response);
          this.isLoading = false;
          // Remove from local array
          const index = this.banners.findIndex(b => b.id === banner.id);
          if (index > -1) {
            this.banners.splice(index, 1);
            this.totalItems = this.banners.length;
          }
          alert('Banner deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting banner:', error);
          this.isLoading = false;
          alert('Error deleting banner. Please try again.');
        }
      });
    }
  }

  getPageTypeLabel(pageType: string): string {
    return this.pageTypeLabels[pageType] || pageType;
  }

  getBannerDetailsPreview(content: string): string {
    if (!content) return 'No content';

    // For HTML content, we'll show a truncated version
    // Remove extra whitespace and get first 150 characters
    const cleanContent = content.replace(/\s+/g, ' ').trim();
    return cleanContent.length > 150 ? cleanContent.substring(0, 150) + '...' : cleanContent;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  }

  get paginatedBanners(): Banner[] {
    if (!Array.isArray(this.banners)) {
      return [];
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.banners.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
