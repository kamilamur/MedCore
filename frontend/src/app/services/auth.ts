import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api';
  constructor(private http: HttpClient) {}
  login(data: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, data);
  }
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout/`, {});
  }
  profile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/`);
  }
  register(data: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/`, data);
  }
}