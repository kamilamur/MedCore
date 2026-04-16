import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css'
})
export class Doctors {
  doctors: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  loadDoctors() {
    fetch('http://127.0.0.1:8000/api/doctors/')
      .then((res) => res.json())
      .then((data) => {
        this.doctors = data;
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Doctors fetch error:', error);
      });
  }

  checkQueue(doctorId: number) {
    this.router.navigate(['/queue'], { queryParams: { doctorId } });
  }
}