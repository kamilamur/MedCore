import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../interfaces/appointment';
@Component({
  selector: 'app-my-appointments',
  standalone: true,
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css'
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  constructor(private service: AppointmentService) {}
  ngOnInit() {
    this.load();
  }
  load() {
    this.service.getAppointments().subscribe({
      next: (data) => this.appointments = data,
      error: () => console.log('Error loading')
    });
  }
  cancel(id: number) {
    this.service.cancelAppointment(id).subscribe(() => {
      this.load();
    });
  }
}