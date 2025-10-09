import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database-service/database.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { User, UserFilter, UserResponse } from 'src/app/shared/constant/user.interface';
import { pagination } from 'src/app/shared/constant/pagination.constant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  expandedUser: string | null = null;
  showFilter: boolean = false;

  // Pagination
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;

  // Filter
  userFilter: UserFilter = {
    name: '',
    phoneNumber: '',
    email: '',
    country: '',
    UKDrivinglicense: '',
    nationality: '',
    currentWork: '',
    eligible_for_SC: '',
    sc_dv_clearance_hold: '',
    referredBy: ''
  };

  // Table headers for basic view
  basicHeaders = ['Name', 'Email', 'Phone Number', 'Nationality', 'Current Work', 'Status',
    // 'Actions'
  ];

  // Table headers for detailed view
  detailedHeaders = [
    'Country Code',
    'UK Visa Type',
    'UK Driving License',
    'Current Location',
    'Notice Period (Days)',
    'Looking For',
    'Work Preference',
    'Expected Day Rate',
    'Referred By',
    'SC/DV Clearance Hold',
    'Valid Up To',
    'Eligible For SC Clearance',
    'Call Day',
    'Call Time',
    'Preferred Roles',
    'Any Question',
    'Profile',
    'Resume'
  ];

  constructor(
    private databaseService: DatabaseService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    const payload = {
      modelName: 'User',
      page: this.page,
      page_size: this.pagesize
    };

    this.databaseService.getModelData(payload, this.userFilter).subscribe((response: UserResponse) => {
      if (response?.status) {
        this.users = response?.data;
        // Ensure each user has an id field (handle both _id and id)
        this.users = this.users.map(user => ({
          ...user,
          id: user.id || (user as any)._id || Math.random().toString(36).substr(2, 9)
        }));
        this.filteredUsers = [...this.users];
        this.totalRecords = response?.meta_data?.items;
      } else {
        this.notificationService.showError(response?.message || 'Failed to fetch users');
      }
    }, (error) => {
      this.notificationService.showError('Error fetching users');
    });
  }

  toggleUserDetails(userId: string): void {
    // If clicking on the same user, close it. Otherwise, open this user and close others
    if (this.expandedUser === userId) {
      this.expandedUser = null;
    } else {
      this.expandedUser = userId;
    }
  }

  viewDetails(userId: string): void {
    console.log('View user details:', userId);
    // Navigate to user details page if needed
  }

  editUser(userId: string): void {
    console.log('Edit user:', userId);
    // Navigate to edit page
  }

  deleteUser(userId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Implement delete API call here
        this.notificationService.showSuccess('User deleted successfully');
        this.getUsers();
      }
    });
  }

  toggleUserStatus(event: Event, userId: string, currentStatus: boolean): void {
    // Prevent the default checkbox behavior
    event.preventDefault();
    
    const newStatus = !currentStatus;
    const statusText = newStatus ? 'activate' : 'deactivate';
 
    Swal.fire({
      title: 'Change User Status',
      text: `Are you sure you want to ${statusText} this user?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus ? '#28a745' : '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}!`,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.databaseService.changeUserStatus(userId, newStatus).subscribe(
          (response) => {
            if (response?.status) {
              this.notificationService.showSuccess(response.message || `User ${statusText}d successfully`);
              // Update the user status in the local array
              const userIndex = this.users.findIndex(user => user.id === userId);
              if (userIndex !== -1) {
                this.users[userIndex].isActive = newStatus;
              }
            } else {
              this.notificationService.showError(response?.message || `Failed to ${statusText} user`);
              // Revert the status on error
              const userIndex = this.users.findIndex(user => user.id === userId);
              if (userIndex !== -1) {
                this.users[userIndex].isActive = currentStatus;
              }
            }
          },
          (error) => {
            console.error('Error changing user status:', error);
            this.notificationService.showError(`Error occurred while trying to ${statusText} user`);
            // Revert the status on error
            const userIndex = this.users.findIndex(user => user.id === userId);
            if (userIndex !== -1) {
              this.users[userIndex].isActive = currentStatus;
            }
          }
        );
      }
      // If cancelled, the checkbox will remain in its original state since we prevented the default behavior
    });
  }

  openDocument(document: any): void {
    if (document?.url) {
      window.open(document.url, '_blank', 'noopener, noreferrer');
    }
  }

  downloadAsExcel(): void {
    const processedData = this.processDataForExcel(this.users);
    this.databaseService.ExportToExcel(processedData, "usersList");
  }

  downloadAsExcelAll(): void {
    const payload = {
      modelName: 'User',
      page: 1,
      limit: 10000
    };

    this.databaseService.getModelData(payload, {}).subscribe((response: UserResponse) => {
      if (response?.status) {
        const processedData = this.processDataForExcel(response?.data);
        this.databaseService.ExportToExcel(processedData, "usersList");
      } else {
        this.notificationService.showError(response?.message || 'Failed to fetch all users');
      }
    });
  }

  private processDataForExcel(data: User[]): any[] {
    return data.map(item => {
      const processedItem = { ...item };

      // Convert array fields to comma-separated strings
      const arrayFields = ['lookingFor', 'workPreference', 'preferredRoles'];
      arrayFields.forEach(field => {
        if (Array.isArray(processedItem[field as keyof User])) {
          (processedItem as any)[field] = (processedItem[field as keyof User] as string[]).join(', ');
        }
      });

      // Convert boolean fields to readable strings
      if (typeof processedItem.UKDrivinglicense === 'boolean') {
        (processedItem as any).UKDrivinglicense = processedItem.UKDrivinglicense ? 'Yes' : 'No';
      }

      if (typeof processedItem.sc_dv_clearance_hold === 'boolean') {
        (processedItem as any).sc_dv_clearance_hold = processedItem.sc_dv_clearance_hold ? 'Yes' : 'No';
      }

      if (typeof processedItem.eligible_for_SC === 'boolean') {
        (processedItem as any).eligible_for_SC = processedItem.eligible_for_SC ? 'Yes' : 'No';
      }

      return processedItem;
    });
  }

  applyFilter(): void {
    this.getUsers();
  }

  resetFilter(): void {
    this.userFilter = {
      name: '',
      phoneNumber: '',
      email: '',
      country: '',
      UKDrivinglicense: '',
      nationality: '',
      currentWork: '',
      eligible_for_SC: '',
      sc_dv_clearance_hold: '',
      referredBy: ''
    };
    this.getUsers();
  }

  paginate(page: number): void {
    this.page = page;
    this.getUsers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Number only validation
  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    const startPage = Math.max(1, this.page - 2);
    const endPage = Math.min(totalPages, this.page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pagesize);
  }

  getReferredByName(referredBy: string | number): string {
    const referredByMap: { [key: string]: string } = {
      '0': 'LinkedIn',
      '1': 'SaiVen Technology Solutions Ltd',
      '2': 'Delphi Services Ltd',
      '3': 'Apex IT',
      '4': 'Jamie Thompson',
      '5': 'WhatsApp',
      '6': 'LinkedIn',
      '7': 'Westgate IT Hub Pvt Ltd',
      '8': 'Spectrum',
      '9': 'SWT',
      '10': 'MC Personal',
      '11': 'Akkodis',
      '12': 'Next Move Recruitment Ltd',
      '13': 'We Are Dcoded Limited',
      '14': 'Heat Recruitment Limited',
      '15': 'Starapex Recruitment',
      '16': 'Colossus Recruitment Ltd',
      '17': 'Hexwired Recruitment Limited',
      '18': 'Fynity',
      '19': 'Others',
      '20': 'RH Portal'
    };

    const key = String(referredBy);
    return referredByMap[key] || 'Unknown';
  }
}
