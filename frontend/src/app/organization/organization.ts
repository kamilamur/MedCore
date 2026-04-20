import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrganizationService } from '../services/organization.service.js';
import { Organization } from '../interfaces/organization.js';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organization.html',
  styleUrl: './organization.css'
})
export class Organizations implements OnInit {
  organizations: Organization[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private organizationService: OrganizationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }
  loadOrganizations(): void {
    this.loading = true;
    this.errorMessage = '';

    this.organizationService.getOrganizations().subscribe({
      next: (data) => {
        this.organizations = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load organizations.';
        this.loading = false;
      }
    });
  }
  goToDoctors(organizationId: number): void {
    this.router.navigate(['/doctors'], {
      queryParams: { organizationId }
    });
  }
}