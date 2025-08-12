import { Component } from '@angular/core';
import { BaseLoginComponent } from '../base-login/base-login.component';

@Component({
  selector: 'app-cir-user-login',
  standalone: true,
  imports: [BaseLoginComponent],
  template: `
    <app-base-login
      title="CIR User Login"
      subtitle="Access your user dashboard"
      backgroundGradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
      buttonGradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
      demoCredentials="Demo credentials: user/user"
    ></app-base-login>
  `
})
export class CirUserLoginComponent extends BaseLoginComponent {}
