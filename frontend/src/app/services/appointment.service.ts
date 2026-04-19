import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../interfaces/appointment';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = 'http://127.0.0.1:8000/api/appointments/';
  constructor(private http: HttpClient) {}
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }
  createAppointment(data: {
    doctor: number;
    appointment_date: string;
    appointment_time: string;
  }): Observable<any> {
    return this.http.post(this.baseUrl, data, {
      headers: this.getAuthHeaders()
    });
  }
  cancelAppointment(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}${id}/`, {
      status: 'cancelled'
    }, {
      headers: this.getAuthHeaders()
    });
  }
}