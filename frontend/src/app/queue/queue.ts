import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './queue.html',
  styleUrl: './queue.css'
})
export class Queue implements OnInit {
  queueEntries: any[] = [];
  doctorId: number = 1;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.doctorId = Number(params['doctorId']) || 1;
      this.loadQueue();
    });
  }

  loadQueue() {
    fetch(`http://127.0.0.1:8000/api/queue/${this.doctorId}/`)
      .then((res) => res.json())
      .then((data) => {
        this.queueEntries = data;
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Queue fetch error:', error);
      });
  }
}