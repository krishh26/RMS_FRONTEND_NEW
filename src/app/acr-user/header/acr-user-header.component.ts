import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-acr-user-header',
  templateUrl: './acr-user-header.component.html',
  styleUrls: ['./acr-user-header.component.scss']
})
export class AcrUserHeaderComponent implements OnInit {
  loginUser: any;
  TokenData: any;
  isDropdownOpen = false;

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

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const dropdown = document.querySelector('.dropdown');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }

  logout() {
    this.localStorageService.clearStorage();
    this.router.navigateByUrl('/auth/acr-user-login');
  }
}
