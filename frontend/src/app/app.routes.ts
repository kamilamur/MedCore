import { Routes } from '@angular/router';
import { Doctors } from './doctors/doctors';
import { Queue } from './queue/queue';

export const routes: Routes = [
  { path: 'doctors', component: Doctors },
  { path: 'queue', component: Queue }
];