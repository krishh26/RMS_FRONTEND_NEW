import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginCredentials } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container" [style.background]="backgroundGradient">
      <div class="login-card">
        <div class="login-header">
          <h1>{{ title }}</h1>
          <p>{{ subtitle }}</p>
        </div>

        <form class="login-form" (ngSubmit)="onLogin()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="loginData.username"
              placeholder="Enter username"
              required
            >
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="loginData.password"
              placeholder="Enter password"
              required
            >
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="login-btn"
            [disabled]="isLoading"
            [style.background]="buttonGradient"
          >
            <span *ngIf="!isLoading">Login</span>
            <span *ngIf="isLoading">Logging in...</span>
          </button>
        </form>

        <div class="login-footer">
          <p>{{ demoCredentials }}</p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './base-login.component.scss'
})
export class BaseLoginComponent {
  @Input() title: string = 'Login';
  @Input() subtitle: string = 'Access your dashboard';
  @Input() backgroundGradient: string = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  @Input() buttonGradient: string = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  @Input() demoCredentials: string = 'Demo credentials: username/password';

  loginData: LoginCredentials = {
    username: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    protected authService: AuthService,
    protected router: Router
  ) {}

  async onLogin(): Promise<void> {
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const result = await this.authService.login(this.loginData);

      if (result.success && result.user) {
        // Always go to project-list after login
        this.router.navigate(['/project-list']);
      } else {
        this.errorMessage = result.message;
      }
    } catch (error) {
      this.errorMessage = 'An error occurred during login';
    } finally {
      this.isLoading = false;
    }
  }
}
