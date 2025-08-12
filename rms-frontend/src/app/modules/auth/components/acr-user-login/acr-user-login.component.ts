import { Component } from '@angular/core';
import { BaseLoginComponent } from '../base-login/base-login.component';

@Component({
  selector: 'app-acr-user-login',
  standalone: true,
  imports: [BaseLoginComponent],
  template: `
    <app-base-login
      title="ACR User Login"
      subtitle="Access your ACR user dashboard"
      backgroundGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      buttonGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      demoCredentials="Demo credentials: acr-user/acr-user"
    ></app-base-login>
  `
})
export class AcrUserLoginComponent extends BaseLoginComponent {}
