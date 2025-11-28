// src/app/features/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html' 
})
export class DashboardPageComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}