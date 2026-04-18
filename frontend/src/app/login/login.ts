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
  
    console.log('Отправляем данные:', authData); 
  
    this.auth.login(authData).subscribe({
      next: (res: any) => {
        console.log('Ответ сервера:', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('is_staff', res.is_staff.toString());
        localStorage.setItem('username', res.username);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Ошибка бэкенда:', err);
        this.errorMessage = "Ошибка входа! Проверьте логин и пароль.";
      }
    });
  }
}