import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../interfaces/doctor';
import { QueueEntry } from '../interfaces/queue-entry';
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
  overviewEntries: QueueEntry[] = [];
  selectedDoctorId: number | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  role: string = '';
  userId: number | null = null;
  currentUserEntry: QueueEntry | null = null;
  constructor(
    private doctorService: DoctorService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    const storedUserId = localStorage.getItem('user_id');
    this.userId = storedUserId ? Number(storedUserId) : null;
    this.loadDoctors();
    this.loadOverview();
    this.route.queryParams.subscribe(params => {
      if (params['doctorId']) {
        this.selectedDoctorId = Number(params['doctorId']);
        this.showQueue();
      }
    });
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data: Doctor[]) => {
        this.doctors = data;
      },
      error: (err) => {
        console.error('Doctors error:', err);
        this.errorMessage = 'Unable to load doctors.';
      }
    });
  }
  loadOverview(): void {
    this.doctorService.getMyOrAllQueues().subscribe({
      next: (data: QueueEntry[]) => {
        this.overviewEntries = data;
      },
      error: (err) => {
        console.error('Queue overview error:', err);
      }
    });
  }
  showQueue(): void {
    if (!this.selectedDoctorId) {
      this.errorMessage = 'Please select a doctor.';
      this.queueEntries = [];
      this.currentUserEntry = null;
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.doctorService.getQueue(this.selectedDoctorId).subscribe({
      next: (data: QueueEntry[]) => {
        this.queueEntries = data;
        this.loading = false;
        this.currentUserEntry =
          this.queueEntries.find(entry => entry.user === this.userId) || null;
      },
      error: (err) => {
        console.error('Queue error:', err);
        this.errorMessage = 'Unable to load queue.';
        this.loading = false;
      }
    });
  }
  joinQueue(): void {
    if (!this.selectedDoctorId || !this.userId) {
      this.errorMessage = 'You must be logged in as a patient.';
      return;
    }

    if (this.currentUserEntry) {
      this.errorMessage = `You are already in this queue. Your position is ${this.currentUserEntry.position}.`;
      return;
    }
    this.doctorService.joinQueue(this.selectedDoctorId, this.userId).subscribe({
      next: () => {
        this.successMessage = 'You joined the queue successfully.';
        this.showQueue();
        this.loadOverview();
      },
      error: (err) => {
        console.error('Join queue error:', err);
        this.errorMessage = 'Unable to join queue.';
      }
    });
  }
  leaveQueue(entryId: number): void {
    this.doctorService.leaveQueue(entryId).subscribe({
      next: () => {
        this.successMessage = 'You left the queue.';
        this.showQueue();
        this.loadOverview();
      },
      error: (err) => {
        console.error('Leave queue error:', err);
        this.errorMessage = 'Unable to leave queue.';
      }
    });
  }
  isCurrentUserEntry(entry: QueueEntry): boolean {
    return !!this.userId && entry.user === this.userId;
  }
  getSelectedDoctor(): Doctor | undefined {
    return this.doctors.find(d => d.id === this.selectedDoctorId);
  }
}