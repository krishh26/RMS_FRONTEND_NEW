import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  username: string;
  role: 'cir-admin' | 'cir-user' | 'acr-admin' | 'acr-user';
  permissions: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Demo credentials for testing
  private readonly DEMO_CREDENTIALS = {
    'admin': { password: 'admin', role: 'cir-admin' },
    'user': { password: 'user', role: 'cir-user' },
    'acr-admin': { password: 'acr-admin', role: 'acr-admin' },
    'acr-user': { password: 'acr-user', role: 'acr-user' }
  };

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Check if user is already logged in (from localStorage) - only in browser
    if (isPlatformBrowser(this.platformId)) {
      this.checkStoredAuth();
    }
  }

  private checkStoredAuth(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> {
    const userCreds = this.DEMO_CREDENTIALS[credentials.username as keyof typeof this.DEMO_CREDENTIALS];

    if (!userCreds || userCreds.password !== credentials.password) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user: User = {
      id: Date.now().toString(),
      username: credentials.username,
      role: userCreds.role as User['role'],
      permissions: this.getPermissionsForRole(userCreds.role as User['role'])
    };

    // Store user in localStorage - only in browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);

    return {
      success: true,
      message: 'Login successful',
      user
    };
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.permissions.includes(permission) || false;
  }

  private getPermissionsForRole(role: User['role']): string[] {
    const permissions = {
      'cir-admin': ['read', 'write', 'delete', 'admin'],
      'cir-user': ['read', 'write'],
      'acr-admin': ['read', 'write', 'delete', 'admin'],
      'acr-user': ['read', 'write']
    };
    return permissions[role] || [];
  }

  getRedirectUrl(role: User['role']): string {
    const redirects = {
      'cir-admin': '/cir-admin/dashboard',
      'cir-user': '/cir-user/dashboard',
      'acr-admin': '/acr-admin/dashboard',
      'acr-user': '/acr-user/dashboard'
    };
    return redirects[role] || '/';
  }
}
