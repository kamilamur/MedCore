import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Doctor } from '../services/models';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css'
})
export class Doctors {
  doctors: Doctor[] = [];
  currentUserId = 1;

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async loadDoctors() {
    try {
      this.doctors = await this.api.getDoctors();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Doctors fetch error:', error);
    }
  }

  checkQueue(doctorId: number) {
    this.router.navigate(['/queue'], { queryParams: { doctorId } });
  }

  async joinQueue(doctorId: number) {
    try {
      await this.api.joinQueue(doctorId, this.currentUserId);
      this.router.navigate(['/queue'], { queryParams: { doctorId } });
    } catch (error) {
      console.error('Join queue error:', error);
    }
  }
}