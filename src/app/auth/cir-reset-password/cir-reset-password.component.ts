import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cir-reset-password',
  templateUrl: './cir-reset-password.component.html',
  styleUrls: ['./cir-reset-password.component.scss']
})
export class CirResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loading = false;
  passwordReset = false;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Get token from route params
    this.route.params.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword && confirmPassword.errors) {
      delete confirmPassword.errors['passwordMismatch'];
    }

    return null;
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.token) {
      this.loading = true;
      // TODO: Implement password reset logic with token
      console.log('Form submitted:', this.resetPasswordForm.value);
      console.log('Token:', this.token);

      // Simulate API call
      setTimeout(() => {
        this.loading = false;
        this.passwordReset = true;
      }, 2000);
    }
  }
}
