import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {
  doctor = 0;
  date = '';
  time = '';
  message = '';
  constructor(private service: AppointmentService) {}
  book() {
    this.message = '';
    this.service.createAppointment({
      doctor: this.doctor,
      appointment_date: this.date,
      appointment_time: this.time
    }).subscribe({
      next: () => {
        this.message = 'Appointment booked!';
        this.doctor = 0;
        this.date = '';
        this.time = '';
      },
      error: () => {
        this.message = 'Error booking appointment';
      }
    });
  }
}