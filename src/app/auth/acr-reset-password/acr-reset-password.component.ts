import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcrServiceService } from 'src/app/services/acr-service/acr-service.service';
import { CirSericeService } from 'src/app/services/cir-service/cir-serice.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Patterns } from 'src/app/shared/constant/validation-patterns.const';

@Component({
  selector: 'app-acr-reset-password',
  templateUrl: './acr-reset-password.component.html',
  styleUrls: ['./acr-reset-password.component.scss']
})
export class AcrResetPasswordComponent implements OnInit {

  resetpasswordForm: FormGroup;
  password = 'password';
  showPassword = false;
  confirmPassword = 'password';
  confirmShowPassword = false;
  token: string = '';
  loginToken: String = '';

  constructor(
    private router: Router,
    private acrservice: AcrServiceService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
    });
    this.resetpasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }


  ngOnInit() {
    this.loginToken = this.token ? this.token : this.localStorageService.getLoggerToken();
    console.log(this.loginToken);

  }

  submit() {
    if (this.resetpasswordForm.valid) {
      const payload = {
        password: this.resetpasswordForm.get('password')?.value,
        // token: this.token
      }
      this.acrservice.resetpassword(payload, this.loginToken).subscribe((response) => {
        if (response?.status == true) {
          this.router.navigate(['/acr/acr-login']);
          localStorage.removeItem('resetToken');
        } else {
          this.notificationService.showError(response?.message);
        }
      }, (error) => {
        this.notificationService.showError(error?.error?.message || 'Something went wrong!');
      })
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

    if (type !== 'password' && this.confirmPassword === 'password') {
      this.confirmPassword = 'text';
      this.confirmShowPassword = true;
    } else {
      this.confirmPassword = 'password';
      this.confirmShowPassword = false;
    }
  }

}
