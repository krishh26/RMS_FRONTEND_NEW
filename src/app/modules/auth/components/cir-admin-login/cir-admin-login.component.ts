import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CirSericeService } from '../../../../services/cir-service/cir-serice.service';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { NotificationService } from '../../../../services/notification/notification.service';
import { Patterns } from '../../../../shared/constant/validation-patterns.const';

@Component({
  selector: 'app-cir-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RecaptchaModule, HttpClientModule],
  providers: [CirSericeService, LocalStorageService],
  templateUrl: './cir-admin-login.component.html',
  styleUrl: './cir-admin-login.component.scss'
})
export class CirAdminLoginComponent {
  loginForm: FormGroup;
  password = 'password';
  showPassword = false;
  DecodedToken: any = [];
  captchaToken: string = '';
  captchaError = false;

  constructor(
    private router: Router,
    private cirservice: CirSericeService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(Patterns.email)]),
      password: new FormControl('', [Validators.required, Validators.pattern(Patterns.password)])
    });
  }

  ngOnInit() {
  }

  login(): void {
    this.loginForm.markAllAsTouched();
    this.captchaError = !this.captchaToken;
    if (this.loginForm.valid && this.captchaToken) {
      const loginData = {
        ...this.loginForm.value, // Spread operator to include form data (email, password)
        captchaToken: this.captchaToken, // Include the CAPTCHA token
      };
      this.cirservice.loginUser(loginData).subscribe((response) => {
        if (response?.status == true) {
          const token = response?.data?.token;
          this.DecodedToken = jwtDecode(token);
          console.log('Decoded Token:', this.DecodedToken);
          localStorage.setItem("DecodedToken", JSON.stringify(this.DecodedToken));
          this.localStorageService.setLoginToken(response?.data);
          this.localStorageService.setLogger(response?.data?.user);
          this.router.navigate(['/cir-admin/projects']);
          this.notificationService.showSuccess(response?.message);
        } else {
          this.notificationService.showError(response?.message);
        }
      }, (error) => {
        this.notificationService.showError(error?.error?.message || 'Something went wrong!');
      })
    }
  }

  onCaptchaResolved(token: string | null): void {
    if (token) {
      this.captchaToken = token; // Set the resolved token
      this.captchaError = false; // Clear error
    } else {
      this.captchaToken = ''; // Reset if CAPTCHA fails to resolve
      this.captchaError = true; // Show error
    }
  }

  public showHidePass(type: string): void {
    if (type == 'password' && this.password === 'password') {
      this.password = 'text';
      this.showPassword = true;
    } else {
      this.password = 'password';
      this.showPassword = false;
    }
  }
}
