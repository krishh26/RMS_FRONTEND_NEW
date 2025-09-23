import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Editor, Toolbar, toHTML } from 'ngx-editor';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CirSericeService } from '../../services/cir-service/cir-serice.service';
import { NotificationService } from '../../services/notification/notification.service';
import Swal from 'sweetalert2';

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
  bannerId: string | null = null;
  pageTitle = 'Add Banner';
  isLoading = false;

  // Page types for dropdown
  pageTypes = [
    { value: 'cir_profile', label: 'CIR Profile Page' },
    { value: 'cir_user_registration', label: 'User Registration Page' },
    { value: 'cir_change_password', label: 'Change Password Page' },
    // { value: 'home', label: 'Home Page' },
    // { value: 'profile_page', label: 'Profile Page' },
    // { value: 'job_post', label: 'Job Post Page' }
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

  bannerData: any;
  file: any = null;
  logoFile: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cirservice: CirSericeService,
    private notificationService: NotificationService
  ) {
    this.mandatoryDetailsForm = this.fb.group({
      page_type: ['', Validators.required],
      content: [''], // Remove required validation as we'll handle it via editor
      background_color: ['#ffffff', Validators.required],
      logo: ['']
    });
  }

  ngOnInit(): void {
    // Check query parameters for add/edit mode
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'edit' && params['id']) {
        this.isEditMode = true;
        this.bannerId = params['id'];
        this.pageTitle = 'Edit Banner';
        this.loadBannerForEdit(this.bannerId!);
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
    console.log(formData);

    // Custom validation for editor content
    if (!formData.page_type) {
      this.mandatoryDetailsForm.get('page_type')?.markAsTouched();
      return;
    }

    // Check if content is valid
    let contentValid = false;
    if (typeof formData.content === 'string') {
      contentValid = formData.content &&
                    formData.content !== '<p></p>' &&
                    formData.content.trim() !== '' &&
                    formData.content !== '<p><br></p>';
    } else if (typeof formData.content === 'object' && formData.content !== null) {
      // If it's an object (JSON from editor), check if it has meaningful content
      contentValid = formData.content &&
                    formData.content.type &&
                    formData.content.content &&
                    formData.content.content.length > 0;
    }

    if (!contentValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Content Required',
        text: 'Please enter banner content.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.isLoading = true;

    // Convert content to HTML if it's a JSON object, otherwise use as is
    let htmlContent = formData.content;
    if (typeof formData.content === 'object' && formData.content !== null && formData.content.type) {
      // If it's a JSON object from the editor, convert it to HTML
      try {
        htmlContent = toHTML(formData.content);
      } catch (error) {
        console.error('Error converting content to HTML:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error processing banner content. Please try again.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545'
        });
        this.isLoading = false;
        return;
      }
    }

    // Use the form control content which contains the HTML from the editor
    const bannerData = {
      page_type: formData.page_type,
      content: htmlContent, // Get HTML content from form control
      background_color: formData.background_color,
      logo: formData.logo || (this.logoFile?.url || '')
    };

    console.log('Saving banner with content:', htmlContent);

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
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Banner created successfully!',
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['/cir-admin/settings']);
        });
      },
      error: (error) => {
        console.error('Error creating banner:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error?.error?.message || error?.message || 'Error creating banner. Please try again.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  updateBanner(formData: any): void {
    const apiUrl = `${environment.baseUrl}/banner/${this.bannerData?._id}`;
    const headers = this.getHeaders();

    this.http.put(apiUrl, formData, { headers }).subscribe({
      next: (response: any) => {
        console.log('Banner updated successfully:', response);
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Banner updated successfully!',
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['/cir-admin/settings']);
        });
      },
      error: (error) => {
        console.error('Error updating banner:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error?.error?.message || error?.message || 'Error updating banner. Please try again.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545'
        });
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

  loadBannerForEdit(bannerId: string): void {
    this.isLoading = true;
    const apiUrl = `${environment.baseUrl}/banner/page/${bannerId}`;
    const headers = this.getHeaders();

    this.http.get(apiUrl, { headers }).subscribe({
      next: (response: any) => {
        console.log('Banner loaded for edit:', response);

        // Handle the API response structure
        this.bannerData = response.data || response;

        // Set the form values - the editor will automatically update
        this.mandatoryDetailsForm.patchValue({
          page_type: this.bannerData.page_type,
          content: this.bannerData.content,
          background_color: this.bannerData.background_color || '#ffffff',
          logo: this.bannerData.logo || ''
        });

        // Set logo file if exists
        if (this.bannerData.logo) {
          this.logoFile = { url: this.bannerData.logo };
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading banner:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error?.error?.message || error?.message || 'Error loading banner. Please try again.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545'
        }).then(() => {
          this.router.navigate(['/cir-admin/settings']);
        });
      }
    });
  }

  resetForm(): void {
    this.mandatoryDetailsForm.reset();
    // Clear the editor content
    this.mandatoryDetailsEditor.setContent('');
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

  // File upload functionality for logo
  logoUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please select a valid image file (JPEG, JPG, PNG, or GIF).',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545'
        });
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please select an image file smaller than 5MB.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545'
        });
        return;
      }

      const data = new FormData();
      data.append('files', file);

      this.cirservice.fileUpload(data).subscribe((response) => {
        if (response?.status) {
          this.logoFile = response?.data;
          this.mandatoryDetailsForm.patchValue({
            logo: this.logoFile?.url || ''
          });
          console.log('Logo uploaded:', this.logoFile);
          this.notificationService.showSuccess(response?.message || 'Logo successfully uploaded.');
        } else {
          this.notificationService.showError(response?.message || 'Error uploading logo.');
        }
      }, (error) => {
        console.error('Error uploading logo:', error);
        this.notificationService.showError('Error uploading logo. Please try again.');
      });
    }
  }

  // Remove logo
  removeLogo(): void {
    this.logoFile = null;
    this.mandatoryDetailsForm.patchValue({
      logo: ''
    });
  }

  // Trigger logo upload
  triggerLogoUpload(): void {
    const fileInput = document.getElementById('logoUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
