import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../interfaces/appointment';
@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css'
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private appointmentService: AppointmentService) {}
  ngOnInit(): void {
    this.loadAppointments();
  }
  loadAppointments(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.appointmentService.getAppointments().subscribe({
      next: (data: Appointment[]) => {
        this.appointments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Appointments load error:', err);
        this.errorMessage = 'Unable to load appointments.';
        this.loading = false;
      }
    });
  }
  cancelAppointment(id: number): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.appointmentService.cancelAppointment(id).subscribe({
      next: () => {
        this.successMessage = 'Appointment cancelled successfully.';
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Cancel appointment error:', err);
        this.errorMessage = 'Unable to cancel appointment.';
      }
    });
  }
  getDoctorFullName(appointment: Appointment): string {
    return `Dr. ${appointment.doctor_first_name} ${appointment.doctor_last_name}`;
  }
}