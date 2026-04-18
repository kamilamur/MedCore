import { Routes } from '@angular/router';
import { AppointmentComponent } from './appointment/appointment.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { Doctors } from './doctors/doctors';
import { Queue } from './queue/queue';
import { LoginComponent } from './login/login';
import { ProfileComponent } from './profile/profile';
export const routes: Routes = [
  { path: '', redirectTo: 'doctors', pathMatch: 'full' },
  { path: 'appointment', component: AppointmentComponent },
  { path: 'my-appointments', component: MyAppointmentsComponent },
  { path: 'doctors', component: Doctors },
  { path: 'queue', component: Queue },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
];