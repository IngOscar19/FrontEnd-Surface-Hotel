import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../services/room.service';
import { HabitacionDetalle } from '../../../core/interface/room.interface';

@Component({
  selector: 'app-details-room',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './details-room.html'
})
export class DetailsRoomComponent implements OnInit {
  private roomService = inject(RoomService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Signals para manejo de estado
  habitacion = signal<HabitacionDetalle | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  selectedImageIndex = signal<number>(0);

  ngOnInit(): void {
    // Obtener el ID de la habitación desde la URL
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
        this.loading.set(false);
        console.log('Habitación cargada:', data);
      },
      error: (err) => {
        console.error('Error al cargar habitación:', err);
        this.error.set('No se pudo cargar la información de la habitación');
        this.loading.set(false);
      }
    });
  }

  // Cambiar imagen seleccionada en la galería
  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  // Navegar a la siguiente imagen
  nextImage(): void {
    const fotos = this.habitacion()?.fotos || [];
    if (fotos.length > 0) {
      const nextIndex = (this.selectedImageIndex() + 1) % fotos.length;
      this.selectedImageIndex.set(nextIndex);
    }
  }

  // Navegar a la imagen anterior
  prevImage(): void {
    const fotos = this.habitacion()?.fotos || [];
    if (fotos.length > 0) {
      const prevIndex = this.selectedImageIndex() === 0 
        ? fotos.length - 1 
        : this.selectedImageIndex() - 1;
      this.selectedImageIndex.set(prevIndex);
    }
  }

  // Obtener la URL completa de la imagen
  getImageUrl(url: string): string {
    // Si la URL ya es completa, retornarla
    if (url.startsWith('http')) {
      return url;
    }
    // Si es relativa, agregar el dominio del backend
    return `http://localhost:5053${url}`;
  }

  // Obtener badge de estado
  getEstadoBadgeClass(estado: string): string {
    const estados: { [key: string]: string } = {
      'disponible': 'badge-success',
      'ocupada': 'badge-danger',
      'mantenimiento': 'badge-warning',
      'limpieza': 'badge-info'
    };
    return estados[estado.toLowerCase()] || 'badge-secondary';
  }

  // Navegar a editar
  editarHabitacion(): void {
    const id = this.habitacion()?.id;
    if (id) {
      this.router.navigate(['/admin/editar-habitacion', id]);
    }
  }

  // Volver a la lista
  volverALista(): void {
    this.router.navigate(['/admin/habitaciones']);
  }
}