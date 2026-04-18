import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private BASE_URL = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login/`, credentials);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/profile/`);
  }

  logout() {
    return this.http.post(`${this.BASE_URL}/logout/`, {});
  }
}