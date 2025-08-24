# ACR Admin Module

This module provides administrative functionality for the ACR system, including a modern sidebar navigation similar to the CIR Admin module.

## Components

### Sidebar Component (`AcrAdminSidebarComponent`)
- **Location**: `src/app/acr-admin/sidebar/`
- **Features**:
  - Collapsible sidebar with smooth animations
  - Mobile-responsive design
  - Navigation menu with submenu support
  - Active route highlighting
  - Brand logo and name display

### Layout Component (`AcrAdminLayoutComponent`)
- **Location**: `src/app/acr-admin/layout/`
- **Features**:
  - Integrates sidebar with main content
  - Top header with page title and breadcrumbs
  - User menu dropdown
  - Responsive design

### Dashboard Component (`AcrAdminDashboardComponent`)
- **Location**: `src/app/acr-admin/dashboard/`
- **Features**:
  - Welcome section with quick actions
  - Statistics cards showing key metrics
  - Recent activities feed
  - Quick action buttons
  - Performance overview and deadlines

## Navigation Structure

The sidebar includes the following main sections:

1. **Dashboard** - Main overview page
2. **Projects** - Project management
   - All Projects
   - Add Project
3. **Jobs** - Job management
   - All Jobs
   - Add Job
   - Applications
4. **Candidates** - Candidate management
   - All Candidates
   - Add Candidate
5. **Contracts** - Contract management
   - All Contracts
   - Add Contract
6. **Users** - User management
   - All Users
   - Add User

## Features

### Responsive Design
- Desktop: Full sidebar with labels
- Mobile: Collapsible sidebar with overlay
- Tablet: Adaptive layout

### Accessibility
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- High contrast mode support

### Performance
- Lazy loading of modules
- Optimized animations
- Efficient routing

## Usage

The module is automatically loaded when navigating to `/acr-admin` routes. The sidebar will appear on all pages within the ACR Admin section.

## Styling

The sidebar uses SCSS with:
- CSS custom properties for theming
- Flexbox and CSS Grid for layouts
- Smooth transitions and animations
- Mobile-first responsive design

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes
