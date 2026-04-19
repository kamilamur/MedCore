import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  username: string = '';
  role: string = '';
  reminders: any[] = [];
  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.username = localStorage.getItem('username') || 'User';
    this.role = localStorage.getItem('role') || '';
    this.auth.profile().subscribe({
      next: (data: any) => {
        if (data?.user?.username) {
          this.username = data.user.username;
        }
        if (data?.role) {
          this.role = data.role;
        }
        if (data?.reminders) {
          this.reminders = data.reminders;
        }
      },
      error: (err) => {
        console.error('Profile API error:', err);
      }
    });
  }
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
  formatTime(timeString: string): string {
    if (!timeString) return '';
    return timeString.slice(0, 5);
  }
  formatDateTime(dateTimeString: string): string {
    return new Date(dateTimeString).toLocaleString();
  }
  getDoctorFullName(reminder: any): string {
    return `Dr. ${reminder.doctor_first_name} ${reminder.doctor_last_name}`;
  }
  onLogout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('is_staff');
    this.router.navigate(['/login']);
  }
}