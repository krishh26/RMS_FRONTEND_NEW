import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  activeTab = 'general';
  mandatoryDetailsForm: FormGroup;
  mandatoryDetailsEditor: Editor = new Editor();
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
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

  constructor(private fb: FormBuilder) {
    this.mandatoryDetailsForm = this.fb.group({
      details: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load settings from service or localStorage
  }

  ngOnDestroy(): void {
    this.mandatoryDetailsEditor.destroy();
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
