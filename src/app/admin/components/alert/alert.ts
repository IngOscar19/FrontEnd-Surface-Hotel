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
        
        <div class="alert shadow-2xl border-2 min-w-[320px] max-w-md flex gap-3 animate-in fade-in slide-in-from-right duration-300"
             [ngClass]="{
               'alert-success bg-success/95 border-success text-white': alert.type === 'success',
               'alert-error bg-error/95 border-error text-white': alert.type === 'error',
               'alert-warning bg-warning/95 border-warning text-gray-900': alert.type === 'warning',
               'alert-info bg-info/95 border-info text-white': alert.type === 'info'
             }">
          
          <!-- Iconos según el tipo -->
          <div class="flex-shrink-0">
            @if (alert.type === 'success') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            @if (alert.type === 'error') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            @if (alert.type === 'warning') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            @if (alert.type === 'info') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          </div>
          
          <!-- Contenido del mensaje -->
          <div class="flex-1 min-w-0">
            @if (alert.title) {
              <h3 class="font-bold text-base mb-1">{{ alert.title }}</h3>
            }
            <div class="text-sm leading-relaxed break-words">{{ alert.message }}</div>
          </div>
          
          <!-- Botón de cerrar -->
          <button 
            (click)="alertService.clear()" 
            class="btn btn-sm btn-ghost btn-circle flex-shrink-0 hover:bg-white/20"
            [ngClass]="{
              'text-white': alert.type !== 'warning',
              'text-gray-900': alert.type === 'warning'
            }"
            aria-label="Cerrar alerta">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    /* Animaciones personalizadas */
    .animate-in {
      animation-duration: 300ms;
      animation-fill-mode: both;
    }
    
    .fade-in {
      animation-name: fadeIn;
    }
    
    .slide-in-from-right {
      animation-name: slideInFromRight;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes slideInFromRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    /* Asegurar que la alerta esté siempre visible */
    .toast {
      pointer-events: none;
    }

    .alert {
      pointer-events: all;
    }
  `]
})
export class AlertComponent {
  public alertService = inject(AlertService);
}