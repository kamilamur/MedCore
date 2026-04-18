import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Doctor, QueueEntry } from '../services/models';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './queue.html',
  styleUrl: './queue.css'
})
export class Queue implements OnInit {
  doctors: Doctor[] = [];
  queueEntries: QueueEntry[] = [];
  selectedDoctorId: number | null = null;
  doctorId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      this.doctors = await this.api.getDoctors();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Doctors fetch error:', error);
    }

    this.route.queryParams.subscribe((params) => {
      const id = params['doctorId'] ? +params['doctorId'] : null;
      if (id !== null) {
        this.selectedDoctorId = id;
        this.doctorId = id;
        this.loadQueue();
      }
    });
  }

  async showQueue() {
    if (this.selectedDoctorId === null) {
      return;
    }

    this.doctorId = this.selectedDoctorId;
    await this.loadQueue();
  }

  async loadQueue() {
    if (this.doctorId === null) {
      this.queueEntries = [];
      return;
    }

    try {
      this.queueEntries = await this.api.getQueue(this.doctorId);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Queue fetch error:', error);
    }
  }

  async leaveQueue(entryId: number) {
    try {
      await this.api.leaveQueue(entryId);
      await this.loadQueue();
    } catch (error) {
      console.error('Leave queue error:', error);
    }
  }
}