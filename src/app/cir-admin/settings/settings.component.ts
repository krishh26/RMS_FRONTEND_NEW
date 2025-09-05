import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  activeTab = 'banner';
  mandatoryDetailsForm: FormGroup;
  mandatoryDetailsEditor: Editor = new Editor();
  isEditMode = false;
  bannerId: number | null = null;
  pageTitle = 'Add Banner';
  isLoading = false;
  
  // Page types for dropdown
  pageTypes = [
    { value: 'home', label: 'Home Page' },
    { value: 'profile_page', label: 'Profile Page' },
    { value: 'add_user', label: 'Add User Page' },
    { value: 'job_post', label: 'Job Post Page' }
  ];
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  settings = {
    general: {
      companyName: 'CIR Admin',
      timezone: 'UTC',
      language: 'English',
      dateFormat: 'MM/DD/YYYY'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      projectUpdates: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5
    },
    appearance: {
      theme: 'light',
      sidebarCollapsed: false,
      compactMode: false
    }
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.mandatoryDetailsForm = this.fb.group({
      page_type: ['', Validators.required],
      content: [''] // Remove required validator as we'll handle it via editor
    });
  }

  ngOnInit(): void {
    // Check query parameters for add/edit mode
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'edit' && params['id']) {
        this.isEditMode = true;
        this.bannerId = +params['id'];
        this.pageTitle = 'Edit Banner';
        this.loadBannerForEdit(this.bannerId);
      } else if (params['action'] === 'add') {
        this.isEditMode = false;
        this.bannerId = null;
        this.pageTitle = 'Add Banner';
        this.resetForm();
      }
    });
  }

  ngOnDestroy(): void {
    this.mandatoryDetailsEditor.destroy();
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  saveSettings(): void {
    const formData = this.mandatoryDetailsForm.value;
    
    // Custom validation for editor content
    if (!formData.page_type) {
      this.mandatoryDetailsForm.get('page_type')?.markAsTouched();
      return;
    }
    
    if (!formData.content || formData.content === '<p></p>') {
      alert('Please enter banner content.');
      return;
    }
    
    this.isLoading = true;
    
    // Use the form control content which contains the HTML from the editor
    const bannerData = {
      page_type: formData.page_type,
      content: formData.content // Get HTML content from form control
    };
    
    if (this.isEditMode) {
      this.updateBanner(bannerData);
    } else {
      this.createBanner(bannerData);
    }
  }

  createBanner(formData: any): void {
    const apiUrl = `${environment.baseUrl}/banner/`;
    const headers = this.getHeaders();
    
    this.http.post(apiUrl, formData, { headers }).subscribe({
      next: (response: any) => {
        console.log('Banner created successfully:', response);
        this.isLoading = false;
        alert('Banner created successfully!');
        this.router.navigate(['/cir-admin/settings']);
      },
      error: (error) => {
        console.error('Error creating banner:', error);
        this.isLoading = false;
        alert('Error creating banner. Please try again.');
      }
    });
  }

  updateBanner(formData: any): void {
    const apiUrl = `${environment.baseUrl}/banner/${this.bannerId}/`;
    const headers = this.getHeaders();
    
    this.http.put(apiUrl, formData, { headers }).subscribe({
      next: (response: any) => {
        console.log('Banner updated successfully:', response);
        this.isLoading = false;
        alert('Banner updated successfully!');
        this.router.navigate(['/cir-admin/settings']);
      },
      error: (error) => {
        console.error('Error updating banner:', error);
        this.isLoading = false;
        alert('Error updating banner. Please try again.');
      }
    });
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Add authorization header if needed
      // 'Authorization': `Bearer ${this.getToken()}`
    });
  }

  loadBannerForEdit(bannerId: number): void {
    this.isLoading = true;
    const apiUrl = `${environment.baseUrl}/banner/${bannerId}/`;
    const headers = this.getHeaders();
    
    this.http.get(apiUrl, { headers }).subscribe({
      next: (response: any) => {
        console.log('Banner loaded for edit:', response);
        this.mandatoryDetailsForm.patchValue({
          page_type: response.page_type,
          content: response.content
        });
        
        // The editor will automatically update when the form control is updated
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading banner:', error);
        this.isLoading = false;
        alert('Error loading banner. Please try again.');
        this.router.navigate(['/cir-admin/settings']);
      }
    });
  }

  resetForm(): void {
    this.mandatoryDetailsForm.reset();
    // The editor will automatically clear when the form control is reset
  }

  cancelEdit(): void {
    this.router.navigate(['/cir-admin/settings']);
  }

  resetSettings(): void {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      console.log('Settings reset');
    }
  }
}
