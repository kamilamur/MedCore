import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { Doctors } from './doctors/doctors';
import { Queue } from './queue/queue';
import { LoginComponent } from './login/login';
import { ProfileComponent } from './profile/profile';
import { RegisterComponent } from './register/register';
import { AdminAppointmentsComponent } from './admin-appointments/admin-appointments';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'appointment', component: AppointmentComponent },
  { path: 'my-appointments', component: MyAppointmentsComponent },
  { path: 'doctors', component: Doctors },
  { path: 'queue', component: Queue },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-appointments', component: AdminAppointmentsComponent },
];