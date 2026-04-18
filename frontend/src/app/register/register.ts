import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, FormsModule, RouterLink]
})
export class RegisterComponent {
  regData = { username: '', email: '', password: '' };
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    if (!this.regData.username || !this.regData.password) {
      this.errorMessage = "Заполните логин и пароль!";
      return;
    }

    this.auth.register(this.regData).subscribe({
      next: () => {
        alert('Регистрация прошла успешно! Теперь войдите в систему.');
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Ошибка! Возможно, такой юзер уже существует.";
      }
    });
  }
}
