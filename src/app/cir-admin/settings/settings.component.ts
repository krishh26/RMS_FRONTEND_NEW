import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  activeTab = 'general';
  settings = {
    general: {
      companyName: 'CIR Admin',
      timezone: 'UTC',
      language: 'English',
      dateFormat: 'MM/DD/YYYY'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      projectUpdates: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5
    },
    appearance: {
      theme: 'light',
      sidebarCollapsed: false,
      compactMode: false
    }
  };

  constructor() { }

  ngOnInit(): void {
    // Load settings from service or localStorage
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  saveSettings(): void {
    console.log('Saving settings:', this.settings);
    // Save settings to service or localStorage
    // Show success message
  }

  resetSettings(): void {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      console.log('Settings reset');
    }
  }
}
