import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { Router } from '@angular/router';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const isResetPasswordAPI = httpRequest.url.includes('acr/reset');
    if (isResetPasswordAPI) {
      return next.handle(httpRequest);
    }
    let jwt: string = '';
    let resetToken = localStorage.getItem('resetToken');

    if (resetToken) {
      resetToken = JSON.parse(resetToken);
    }

    if (this.localStorageService.getLoggerToken()) {
      jwt = this.localStorageService.getLoggerToken();
      console.log(jwt);
      // jwt = JSON.parse(jwt)
    } else {
      const data = localStorage.getItem('rmsPersonalDetails');
      if (data) {
        const personalDetails = JSON.parse(data);
        jwt = personalDetails?.data?.token;
      }
    }

    const authReq = httpRequest.clone({ setHeaders: { authorization: `Bearer ${jwt ? jwt : resetToken}` } });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Redirect to login page
          this.localStorageService.clearStorage();
          this.router.navigate(['/cir/cir-login']);
        }
        // Pass the error to the caller of the interceptor
        return throwError(error);
      })
    );
  }
}
