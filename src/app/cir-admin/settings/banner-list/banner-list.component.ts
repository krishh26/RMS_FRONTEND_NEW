import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

interface Banner {
  _id: string;
  page_type: string;
  content: string; // HTML content
  background_color?: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
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
  showPreviewModal = false;
  selectedBannerContent = '';
  selectedBannerPageType = '';
  selectedBannerBackgroundColor = '#ffffff';
  selectedBannerLogo = '';
  isImageLoading = false;

  // Page type labels for display
  pageTypeLabels: { [key: string]: string } = {
    'home': 'Home Page',
    'profile_page': 'Profile Page',
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

        // Handle the API response structure
        if (response.status && response.data) {
          this.banners = response.data;
          this.totalItems = response.meta_data?.items || response.data.length;
        } else {
          // Fallback for different response structure
          this.banners = response.results || response;
          this.totalItems = response.count || this.banners.length;
        }

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
    // Static data for demonstration when API fails - matches your API response structure
    this.banners = [
      {
        _id: '68c44311383209c7faf8ee8a',
        page_type: 'home',
        content: '<p>ETsztsdgdfgdgdsfgdfg dgdgfdg d</p>',
        background_color: '#00f1f5',
        logo: 'https://f005.backblazeb2.com/file/whyqtech1/files/1758545275133_test3 (1).png',
        createdAt: '2025-09-12T15:58:09.933Z',
        updatedAt: '2025-09-22T12:48:04.683Z'
      },
      {
        _id: '68bf41826f7b2e8c59720c3b',
        page_type: 'profile_page',
        content: '<ul><li><p>asdad</p></li><li><p>1</p></li><li><p>2</p></li><li><p>3</p></li></ul>',
        background_color: '#ffffff',
        createdAt: '2025-09-08T20:50:10.143Z',
        updatedAt: '2025-09-08T20:50:35.687Z'
      },
      {
        _id: '68c44311383209c7faf8ee8b',
        page_type: 'job_post',
        content: '<h3>Job Posting Guidelines</h3><p>Please follow our guidelines when posting new job opportunities.</p><ul><li>Clear job description</li><li>Required qualifications</li><li>Salary range</li></ul>',
        background_color: '#e8f5e8',
        logo: 'https://via.placeholder.com/200x80/28a745/ffffff?text=Job+Logo',
        createdAt: '2025-09-15T10:30:00.000Z',
        updatedAt: '2025-09-15T10:30:00.000Z'
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
    this.router.navigate(['/cir-admin/settings/banner'], { queryParams: { action: 'add' } });
  }

  editBanner(banner: Banner): void {
    this.router.navigate(['/cir-admin/settings/banner'], { queryParams: { action: 'edit', id: banner.page_type } });
  }

  deleteBanner(banner: Banner): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this! This action will permanently delete the banner for "${this.getPageTypeLabel(banner.page_type)}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        const apiUrl = `${environment.baseUrl}/banner/${banner._id}/`;
        const headers = this.getHeaders();

        this.http.delete(apiUrl, { headers }).subscribe({
          next: (response: any) => {
            console.log('Banner deleted successfully:', response);
            this.isLoading = false;
            // Remove from local array
            const index = this.banners.findIndex(b => b._id === banner._id);
            if (index > -1) {
              this.banners.splice(index, 1);
              this.totalItems = this.banners.length;
            }
            Swal.fire(
              'Deleted!',
              'Banner has been permanently deleted.',
              'success'
            );
          },
          error: (error) => {
            console.error('Error deleting banner:', error);
            this.isLoading = false;
            Swal.fire(
              'Error!',
              error?.error?.message || error?.message || 'Failed to delete banner. Please try again.',
              'error'
            );
          }
        });
      }
    });
  }

  getPageTypeLabel(pageType: string): string {
    return this.pageTypeLabels[pageType] || pageType;
  }

  getBannerDetailsPreview(content: string): string {
    if (!content) return 'No content';

    // For HTML content, strip HTML tags and show a truncated version
    const textContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return textContent.length > 150 ? textContent.substring(0, 150) + '...' : textContent;
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
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.banners.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  showBannerPreview(banner: Banner): void {
    this.selectedBannerContent = banner.content;
    this.selectedBannerPageType = this.getPageTypeLabel(banner.page_type);
    this.selectedBannerBackgroundColor = banner.background_color || '#ffffff';
    this.selectedBannerLogo = banner.logo || '';
    this.isImageLoading = banner.logo ? true : false;
    this.showPreviewModal = true;
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.selectedBannerContent = '';
    this.selectedBannerPageType = '';
    this.selectedBannerBackgroundColor = '#ffffff';
    this.selectedBannerLogo = '';
    this.isImageLoading = false;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
    this.isImageLoading = false;
  }

  onImageLoad(): void {
    this.isImageLoading = false;
  }

  viewFullSizeLogo(logoUrl: string): void {
    if (logoUrl) {
      window.open(logoUrl, '_blank');
    }
  }
}
