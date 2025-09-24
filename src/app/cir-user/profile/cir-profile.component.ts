import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CirSericeService } from 'src/app/services/cir-service/cir-serice.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-cir-profile',
  templateUrl: './cir-profile.component.html',
  styleUrls: ['./cir-profile.component.scss'],
})
export class CirProfileComponent implements OnInit {
  // Stepper properties
  currentStep = 1;

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  loginDetails: any = {
    profile: {
      url: '',
    },
  };
  file: any = null;

  // Password visibility flags
  currentShowPassword = false;
  showPassword = false;
  confirmShowPassword = false;
  bannerDetails: any = null;
  changePasswordBannerDetails: any = null;

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private cirservice: CirSericeService
  ) {
    this.initializeForms();
    this.getBanerDetails();
    this.getChangePasswordBannerDetails();
  }

  ngOnInit(): void {
    const userDetails = this.localStorageService.getLogger();
    if (userDetails) {
      this.loginDetails = userDetails;
      this.profileForm.patchValue({
        name: userDetails.name || '',
        email: userDetails.email || '',
        phoneNumber: userDetails.phoneNumber || '',
        nationality: userDetails.nationality || '',
        postalCode: userDetails.postalCode || '',
      });
    }
  }

  private initializeForms(): void {
    // Profile form initialization
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      nationality: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    });

    // Password form initialization
    this.passwordForm = this.fb.group({
      currentPassword: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[@])[a-zA-Z0-9@]+$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[@])[a-zA-Z0-9@]+$'),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[@])[a-zA-Z0-9@]+$'),
        ],
      ],
    });
  }

  // Stepper navigation methods
  goToNextStep(): void {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  fileUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.file = {
        url: URL.createObjectURL(file),
        file: file,
      };
    }
  }

  showHidePass(field: string): void {
    switch (field) {
      case 'currentPassword':
        this.currentShowPassword = !this.currentShowPassword;
        break;
      case 'password':
        this.showPassword = !this.showPassword;
        break;
      case 'confirmPassword':
        this.confirmShowPassword = !this.confirmShowPassword;
        break;
    }
  }

  submitProfile(): void {
    if (this.profileForm.valid) {
      console.log('Profile form submitted:', this.profileForm.value);
      // Here you would typically call a service to update the profile
      this.loginDetails = { ...this.loginDetails, ...this.profileForm.value };
      this.localStorageService.setLogger(this.loginDetails);
      // Move to next step after successful profile update
      this.goToNextStep();
    } else {
      Object.keys(this.profileForm.controls).forEach((key) => {
        const control = this.profileForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  submitPassword(): void {
    if (this.passwordForm.valid) {
      const { password, confirmPassword } = this.passwordForm.value;
      if (password !== confirmPassword) {
        // Handle password mismatch
        return;
      }
      console.log('Password form submitted:', this.passwordForm.value);
      // Here you would typically call a service to update the password
      // Reset form after successful password update
      this.passwordForm.reset();
      // Optionally go back to profile step
      this.goToPreviousStep();
    } else {
      Object.keys(this.passwordForm.controls).forEach((key) => {
        const control = this.passwordForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  getBanerDetails(): void {
    this.cirservice.getBanerDetails('cir_profile').subscribe((response) => {
      if (response?.status) {
        this.bannerDetails = response?.data || null;
      } else {
        this.bannerDetails = null;
      }
    });
  }

  getChangePasswordBannerDetails(): void {
    this.cirservice.getBanerDetails('cir_change_password').subscribe((response) => {
      if (response?.status) {
        this.changePasswordBannerDetails = response?.data || null;
      } else {
        this.changePasswordBannerDetails = null;
      }
    });
  }
}
