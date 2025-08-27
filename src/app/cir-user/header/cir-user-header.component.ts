import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-cir-user-header',
  templateUrl: './cir-user-header.component.html',
  styleUrls: ['./cir-user-header.component.scss']
})
export class CirUserHeaderComponent implements OnInit {
  loginUser: any;
  TokenData: any;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginUser = this.localStorageService.getLogger();
    const tokenData = localStorage.getItem("DecodedToken");
    if (tokenData) {
      try {
        this.TokenData = JSON.parse(tokenData);
      } catch (error) {
        console.error("Error parsing token data as JSON", error);
      }
    }
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    this.localStorageService.clearStorage();
    this.router.navigateByUrl('/cir/cir-user-login');
  }
}
