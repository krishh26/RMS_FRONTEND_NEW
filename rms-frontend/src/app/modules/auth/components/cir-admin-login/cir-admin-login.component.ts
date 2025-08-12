import { Component } from '@angular/core';
import { BaseLoginComponent } from '../base-login/base-login.component';

@Component({
  selector: 'app-cir-admin-login',
  standalone: true,
  imports: [BaseLoginComponent],
  template: `
    <app-base-login
      title="CIR Admin Login"
      subtitle="Access the administrative dashboard"
      backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      buttonGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      demoCredentials="Demo credentials: admin/admin"
    ></app-base-login>
  `
})
export class CirAdminLoginComponent extends BaseLoginComponent {}
