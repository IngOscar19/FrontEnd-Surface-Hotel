import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservacionService } from '../../services/reservacion.service';
import { ReservaResponseDto } from '../../../core/interface/reserva.interface';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reserva-list.html',
})
export class ReservaList implements OnInit {

  private reservacionService = inject(ReservacionService);

  // Signal para manejar el estado
  reservas = signal<ReservaResponseDto[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.isLoading.set(true);
    
    this.reservacionService.getReservations().subscribe({
      next: (data) => {
        this.reservas.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar reservas', err);
        this.isLoading.set(false);
        // Opcional: Aquí podrías cargar datos mock si falla el backend
      }
    });
  }
}