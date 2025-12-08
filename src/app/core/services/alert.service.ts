import { Injectable, signal } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  type: AlertType;
  message: string;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  public alert = signal<Alert | null>(null);
  private timeoutId: any;

 
  show(type: AlertType, message: string, duration: number = 3000) {
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    
    this.alert.set({ type, message });

   
    if (duration > 0) {
      this.timeoutId = setTimeout(() => {
        this.clear();
      }, duration);
    }
  }


  success(message: string) {
    this.show('success', message);
  }

  error(message: string) {
    
    this.show('error', message, 5000);
  }

  warning(message: string) {
    this.show('warning', message);
  }

  
  info(message: string) {
    this.show('info', message);
  }

  clear() {
    this.alert.set(null);
  }
}