import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'User',
      status: 'Active',
      lastLogin: '2024-03-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-03-14'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'User',
      status: 'Inactive',
      lastLogin: '2024-03-10'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Here you would typically fetch users from a service
  }

  editUser(userId: number): void {
    console.log('Edit user:', userId);
  }

  deleteUser(userId: number): void {
    console.log('Delete user:', userId);
  }

  toggleUserStatus(userId: number): void {
    console.log('Toggle user status:', userId);
  }
}
