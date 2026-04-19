import { Injectable } from '@angular/core';
import { Doctor, QueueEntry } from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  async getDoctors(): Promise<Doctor[]> {
    const res = await fetch(`${this.baseUrl}/doctors/`);
    if (!res.ok) {
      throw new Error('Failed to load doctors');
    }
    return res.json();
  }

  async getQueue(doctorId: number): Promise<QueueEntry[]> {
    const res = await fetch(`${this.baseUrl}/queue/${doctorId}/`);
    if (!res.ok) {
      throw new Error('Failed to load queue');
    }
    return res.json();
  }

  async joinQueue(doctorId: number, userId: number): Promise<QueueEntry> {
    const res = await fetch(`${this.baseUrl}/queue/${doctorId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: userId })
    });

    if (!res.ok) {
      throw new Error('Failed to join queue');
    }

    return res.json();
  }

  async leaveQueue(entryId: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/queue-entry/${entryId}/`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      throw new Error('Failed to leave queue');
    }
  }
}