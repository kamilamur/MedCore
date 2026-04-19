import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string = '';
  role: string = '';
  constructor(private router: Router) {}
  ngOnInit(): void {
    const token = localStorage.getItem('access');

    this.isLoggedIn = !!token;
    this.username = localStorage.getItem('username') || '';
    this.role = localStorage.getItem('role') || '';
  }
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}