import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('rms-frontend');
  private router = inject(Router);

  shouldShowNavigation(): boolean {
    const currentUrl = this.router.url;
    return !currentUrl.includes('/auth/');
  }
}
