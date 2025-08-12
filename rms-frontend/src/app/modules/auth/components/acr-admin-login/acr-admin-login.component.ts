import { Component } from '@angular/core';
import { BaseLoginComponent } from '../base-login/base-login.component';

@Component({
  selector: 'app-acr-admin-login',
  standalone: true,
  imports: [BaseLoginComponent],
  template: `
    <app-base-login
      title="ACR Admin Login"
      subtitle="Access the ACR administrative dashboard"
      backgroundGradient="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
      buttonGradient="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
      demoCredentials="Demo credentials: acr-admin/acr-admin"
    ></app-base-login>
  `
})
export class AcrAdminLoginComponent extends BaseLoginComponent {}
