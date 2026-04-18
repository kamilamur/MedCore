import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router'; 
import { AuthService } from '../services/auth';
@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent {
  userData: any;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.getProfile().subscribe(data => this.userData = data);
  }

  onLogout() {
    this.auth.logout().subscribe(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      localStorage.removeItem('is_staff');
    });
  }
}