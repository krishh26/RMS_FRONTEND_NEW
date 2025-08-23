import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cir-forgot-password',
  templateUrl: './cir-forgot-password.component.html',
  styleUrls: ['./cir-forgot-password.component.scss']
})
export class CirForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loading = false;
  emailSent = false;

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      // TODO: Implement forgot password logic
      console.log('Form submitted:', this.forgotPasswordForm.value);

      // Simulate API call
      setTimeout(() => {
        this.loading = false;
        this.emailSent = true;
      }, 2000);
    }
  }

  resetForm() {
    this.emailSent = false;
    this.forgotPasswordForm.reset();
  }
}
