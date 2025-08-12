import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="project-list">
      <h2>Project List</h2>
      <p>Welcome! This is a placeholder for your project list page.</p>
    </section>
  `,
  styles: [`
    .project-list { padding: 24px; }
    h2 { margin: 0 0 12px 0; }
  `]
})
export class ProjectListComponent {}
