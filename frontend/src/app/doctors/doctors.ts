import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../interfaces/doctor';
@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css'
})
export class Doctors implements OnInit {
  doctors: Doctor[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading = true;
    this.errorMessage = '';

    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load doctors.';
        this.loading = false;
      }
    });
  }
  goToQueue(doctorId: number): void {
    this.router.navigate(['/queue'], {
      queryParams: { doctorId }
    });
  }
}