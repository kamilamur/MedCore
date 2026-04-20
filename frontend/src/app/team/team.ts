import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.html',
  styleUrls: ['./team.css']
})
export class TeamComponent {
  developers = [
    { 
      name: 'Moldyr Sharipova', 
      role: 'Frontend Developer (Angular), Backend', 
      task: 'Разработка интерфейса, логика Signals, роутинг и дизайн MedCore.',
      photo: 'https://avatars.githubusercontent.com/u/187541006?s=400&u=f811c719f219e1e2476819ee770cfa170d4019ea&v=4' 
    },
    { 
      name: 'Kamila Muralinova', 
      role: 'Backend Developer (Django), Frontend', 
      task: 'Проектирование базы данных, API эндпоинты, JWT аутентификация.',
      photo: 'https://avatars.githubusercontent.com/u/195541795?v=4' 
    }
  ];

  constructor(private http: HttpClient) {}  

  sendApplication(name: string, email: string, message: string) {
    if (!name || !email) {
      alert('Please fill name and email');
      return;
    }
    const data = { name, email, message };
    this.http.post('http://127.0.0.1:8000/api/send-application/', data).subscribe({
      next: () => alert('Application sent!'),
      error: (_err: any) => alert('Error! Check if Backend is running.')
    });
  }
}