import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../interfaces/doctor';
@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent implements OnInit {
  doctors: Doctor[] = [];
  selectedDoctorId: number | null = null;
  appointmentDate: string = '';
  appointmentTime: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  loadingDoctors: boolean = false;
  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService
  ) {}
  ngOnInit(): void {
    this.loadDoctors();
  }
  loadDoctors(): void {
    this.loadingDoctors = true;
    this.errorMessage = '';
    this.doctorService.getDoctors().subscribe({
      next: (data: Doctor[]) => {
        this.doctors = data;
        this.loadingDoctors = false;
      },
      error: (err) => {
        console.error('Doctors load error:', err);
        this.errorMessage = 'Unable to load doctors.';
        this.loadingDoctors = false;
      }
    });
  }
  bookAppointment(): void {
    this.successMessage = '';
    this.errorMessage = '';
    if (!this.selectedDoctorId) {
      this.errorMessage = 'Select a doctor.';
      return;
    }
    if (!this.appointmentDate) {
      this.errorMessage = 'Select a date.';
      return;
    }

    if (!this.appointmentTime) {
      this.errorMessage = 'Select time.';
      return;
    }
    console.log('selectedDoctorId:', this.selectedDoctorId);
console.log('appointmentDate:', this.appointmentDate);
console.log('appointmentTime:', this.appointmentTime);
console.log('payload:', {
  doctor: this.selectedDoctorId,
  appointment_date: this.appointmentDate,
  appointment_time: this.appointmentTime
});
    this.appointmentService.createAppointment({
      doctor: this.selectedDoctorId,
      appointment_date: this.appointmentDate,
      appointment_time: this.appointmentTime
    }).subscribe({
      next: () => {
        this.successMessage = 'Appointment booked';
        this.selectedDoctorId = null;
        this.appointmentDate = '';
        this.appointmentTime = '';
      },
      error: (err) => {
        console.error('Appointment create error:', err);
        this.errorMessage = 'Unable to book appointment.';
      }
    });
  }
}