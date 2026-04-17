import { Routes } from '@angular/router';
import { Doctors } from './doctors/doctors';
import { Queue } from './queue/queue';
import { LoginComponent } from './login/login';
import { ProfileComponent } from './profile/profile';

export const routes: Routes = [
  { path: 'doctors', component: Doctors },
  { path: 'queue', component: Queue },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
];
