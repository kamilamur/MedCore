import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class AboutComponent {
  teamName = "MedCore Development Team";
  version = "2.0.4-stable";
  
  features = [
    { title: 'Security', desc: 'JWT-based authentication' },
    { title: 'Efficiency', desc: 'Real-time queue management' },
    { title: 'Modern UI', desc: 'Built with Angular Signals' }
  ];

  constructor() {}
}