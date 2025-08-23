import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AcrServiceService } from 'src/app/services/acr-service/acr-service.service';
import { CirSericeService } from 'src/app/services/cir-service/cir-serice.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Patterns } from 'src/app/shared/constant/validation-patterns.const';

@Component({
  selector: 'app-acr-forgot-password',
  templateUrl: './acr-forgot-password.component.html',
  styleUrls: ['./acr-forgot-password.component.scss']
})
export class AcrForgotPasswordComponent implements OnInit {

  forgotpasswordForm: FormGroup;
  captchaToken: string = '';
  captchaError = false;

  constructor(
    private router: Router,
    private acrservice: AcrServiceService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
  ) {
    this.forgotpasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(Patterns.email)]),
    });
  }

  ngOnInit() {
  }

  submit() {
    this.forgotpasswordForm.markAllAsTouched();
    this.captchaError = !this.captchaToken;

    if (this.forgotpasswordForm.valid && this.captchaToken) {

      const forgetData = {
        ...this.forgotpasswordForm.value,
        captchaToken: this.captchaToken,
      }

      this.acrservice.forgotpassword(forgetData).subscribe((response) => {
        if (response?.status == true) {
          this.localStorageService.setLoginToken(response?.data);
          this.localStorageService.setLogger(response?.data?.user);
          this.notificationService.showSuccess('We have sent a password reset link to your registered email address.');
        } else if (response?.status == true && response?.message == 'User not found') {
          this.notificationService.showError('Invalid Email Address. Try again with registered Email.');
        }
      }, (error) => {
        this.notificationService.showError('Invalid Email Address. Try again with registered Email.');
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

}
