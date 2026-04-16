import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../interfaces/appointment';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://127.0.0.1:8000/api/appointments/';
  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }
  createAppointment(data: {
    doctor: number;
    appointment_date: string;
    appointment_time: string;
  }): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, data);
  }
  cancelAppointment(id: number) {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}