import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../core/services/alert.service'; 

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (alertService.alert(); as alert) {
      <div class="toast toast-top toast-end z-[99999] fixed top-4 right-4">
        
        <div class="alert shadow-xl border-none text-white min-w-[300px] flex gap-2"
             [ngClass]="{
               'alert-success bg-success': alert.type === 'success',
               'alert-error bg-error': alert.type === 'error',
               'alert-warning bg-warning': alert.type === 'warning',
               'alert-info bg-info': alert.type === 'info'
             }">
          
          @if (alert.type === 'success') {
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          }
          @if (alert.type === 'error') {
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          }

          <div>
            <h3 class="font-bold text-xs uppercase">{{ alert.type }}</h3>
            <div class="text-sm">{{ alert.message }}</div>
          </div>
          
          <button (click)="alertService.clear()" class="btn btn-sm btn-ghost btn-circle text-white">✕</button>
        </div>
      </div>
    }
  `
})
export class AlertComponent {
  public alertService = inject(AlertService);
}