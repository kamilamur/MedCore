import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../interfaces/doctor';
import { QueueEntry } from '../interfaces/queue-entry';
import { Organization } from '../interfaces/organization';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private baseUrl = 'http://127.0.0.1:8000/api';
  private apiUrl = 'http://127.0.0.1:8000/api';
  constructor(private http: HttpClient) {}
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/doctors/`);
  }
  getMyOrAllQueues(): Observable<QueueEntry[]> {
    return this.http.get<QueueEntry[]>(`${this.baseUrl}/queue/`, {
      headers: this.getAuthHeaders()
    });
  }
  getQueue(doctorId: number): Observable<QueueEntry[]> {
    return this.http.get<QueueEntry[]>(`${this.baseUrl}/queue/${doctorId}/`, {
      headers: this.getAuthHeaders()
    });
  }
  joinQueue(doctorId: number, userId: number): Observable<QueueEntry> {
    return this.http.post<QueueEntry>(
      `${this.baseUrl}/queue/${doctorId}/`,
      { user: userId },
      { headers: this.getAuthHeaders() }
    );
  }
  leaveQueue(entryId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/queue-entry/${entryId}/`, {
      headers: this.getAuthHeaders()
    });
  }
  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.apiUrl}/organizations/`);
  }
}