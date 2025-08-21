import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChildFn, CanActivateFn } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Injectable({

  providedIn: 'root'

})

export class AuthGuard implements CanActivate {

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  canActivate(): Promise<any> | boolean {
    if (!this.localStorageService.getLoggerToken()) {
      this.localStorageService.clearStorage();
      this.router.navigate(['/login']); // go to login if not authenticated
      return false;
    }
    return true;
  }
}
