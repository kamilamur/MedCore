import { Routes } from '@angular/router';
import { AppointmentComponent } from './appointment/appointment.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { Doctors } from './doctors/doctors';
import { Queue } from './queue/queue';
export const routes: Routes = [
  { path: 'appointment', component: AppointmentComponent },
  { path: 'my-appointments', component: MyAppointmentsComponent },
  { path: 'doctors', component: Doctors },
  { path: 'queue', component: Queue },
];