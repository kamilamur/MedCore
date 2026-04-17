import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginData = { username: '', password: '' };
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.auth.login(this.loginData).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/profile']);
        localStorage.setItem('is_staff', res.is_staff.toString()); 
        localStorage.setItem('username', res.username);
      },
      error: () => this.errorMessage = 'Ошибка входа!'
    });
  }
}