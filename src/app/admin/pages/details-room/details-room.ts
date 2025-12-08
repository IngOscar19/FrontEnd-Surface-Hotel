import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../services/room.service';
import { ReservacionService } from '../../services/reservacion.service';  
import { HabitacionDetalle } from '../../../core/interface/room.interface';
import { ReservaResponseDto } from '../../../core/interface/reserva.interface'; 

@Component({
  selector: 'app-details-room',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './details-room.html'
})
export class DetailsRoomComponent implements OnInit {
  private roomService = inject(RoomService);
  private reservacionService = inject(ReservacionService); 
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  
  habitacion = signal<HabitacionDetalle | null>(null);
  reservaActiva = signal<ReservaResponseDto | null>(null); 
  
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  selectedImageIndex = signal<number>(0);

  ngOnInit(): void {
    
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.cargarHabitacion(+id);
    } else {
      this.error.set('ID de habitación no válido');
      this.loading.set(false);
    }
  }

  cargarHabitacion(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.roomService.getRoomById(id).subscribe({
      next: (data) => {
        this.habitacion.set(data);
       
        this.cargarReservaAsociada(id);
      },
      error: (err) => {
        console.error('Error al cargar habitación:', err);
        this.error.set('No se pudo cargar la información de la habitación');
        this.loading.set(false);
      }
    });
  }

 
  cargarReservaAsociada(habitacionId: number): void {
    this.reservacionService.getReservations().subscribe({
      next: (reservas) => {
        
        const reserva = reservas.find(r => 
          r.habitacionId === habitacionId && 
          (r.estado === 'pendiente' || r.estado === 'confirmada')
        );
        
        if (reserva) {
          this.reservaActiva.set(reserva);
        } else {
          this.reservaActiva.set(null);
        }
        this.loading.set(false); 
      },
      error: (err) => {
        
        this.loading.set(false); 
      }
    });
  }


  confirmarReserva(): void {
    const reserva = this.reservaActiva();
    if (!reserva) return;

    if (confirm('¿Confirmar entrada del huésped? La habitación pasará a estado OCUPADA.')) {
      this.loading.set(true);
      this.reservacionService.confirmReservation(reserva.id).subscribe({
        next: () => {
          ('Reserva confirmada');
          
          if(this.habitacion()?.id) this.cargarHabitacion(this.habitacion()!.id);
        },
        error: (err) => {
          console.error(err);
          alert('Error al confirmar reserva');
          this.loading.set(false);
        }
      });
    }
  }

  
  cancelarReserva(): void {
    const reserva = this.reservaActiva();
    if (!reserva) return;

    if (confirm('¿Seguro que deseas cancelar esta reserva? Si la habitación estaba ocupada, pasará a LIMPIEZA.')) {
      this.loading.set(true);
      this.reservacionService.cancelReservation(reserva.id).subscribe({
        next: () => {
         
          if(this.habitacion()?.id) this.cargarHabitacion(this.habitacion()!.id);
        },
        error: (err) => {
          console.error(err);
          alert('Error al cancelar reserva');
          this.loading.set(false);
        }
      });
    }
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  nextImage(): void {
    const fotos = this.habitacion()?.fotos || [];
    if (fotos.length > 0) {
      const nextIndex = (this.selectedImageIndex() + 1) % fotos.length;
      this.selectedImageIndex.set(nextIndex);
    }
  }

  prevImage(): void {
    const fotos = this.habitacion()?.fotos || [];
    if (fotos.length > 0) {
      const prevIndex = this.selectedImageIndex() === 0 
        ? fotos.length - 1 
        : this.selectedImageIndex() - 1;
      this.selectedImageIndex.set(prevIndex);
    }
  }

  getImageUrl(url: string): string {
    if (url.startsWith('http')) return url;
    return `http://localhost:5053${url}`;
  }

  getEstadoBadgeClass(estado: string): string {
    const estados: { [key: string]: string } = {
      'disponible': 'badge-success',
      'ocupada': 'badge-danger',
      'mantenimiento': 'badge-warning',
      'limpieza': 'badge-info'
    };
    return estados[estado.toLowerCase()] || 'badge-secondary';
  }

  editarHabitacion(): void {
    const id = this.habitacion()?.id;
    if (id) {
      this.router.navigate(['/admin/editar-habitacion', id]);
    }
  }

  volverALista(): void {
    this.router.navigate(['/admin/habitaciones']);
  }
}