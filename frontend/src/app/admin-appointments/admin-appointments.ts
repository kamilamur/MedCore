import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../interfaces/appointment';
@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-appointments.html',
})
export class AdminAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  error = '';
  constructor(private service: AppointmentService) {}
  ngOnInit() {
    this.loadAppointments();
  }
  loadAppointments() {
    this.service.getAppointments().subscribe({
      next: (data) => this.appointments = data,
      error: () => this.error = 'Failed to load appointments'
    });
  }
  cancel(id: number) {
    this.service.cancelAppointment(id).subscribe(() => {
      this.loadAppointments();
    });
  }
}
