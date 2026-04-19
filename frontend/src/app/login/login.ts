import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginData = { username: '', password: '' };
  errorMessage = '';
  constructor(private auth: AuthService, private router: Router) {}
  onLogin() {
    const authData = {
      username: this.loginData.username.trim(),
      password: this.loginData.password.trim()
    };
    this.auth.login(authData).subscribe({
      next: (res: any) => {
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);
        localStorage.setItem('username', res.username);
        localStorage.setItem('is_staff', res.is_staff.toString());
        localStorage.setItem('role', res.role);
        localStorage.setItem('user_id', res.user_id.toString());
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage = 'Ошибка входа! Проверьте логин и пароль.';
      }
    });
  }
}