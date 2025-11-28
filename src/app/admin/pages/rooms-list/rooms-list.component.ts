import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../services/room.service';
import { HabitacionDetalle } from '../../../core/interface/room.interface';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './rooms-list.component.html'
})
export class RoomsListComponent implements OnInit {
  private roomService = inject(RoomService);
  private router = inject(Router);

  rooms: HabitacionDetalle[] = [];
  isLoading = false; 
  error: string | null = null;

  // Propiedades para filtros (usadas en el HTML)
  searchTerm: string = '';
  filterType: string = '';
  filterStatus: string = '';

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.isLoading = true;
    this.error = null;

    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.isLoading = false;
        console.log('Habitaciones cargadas:', data);
      },
      error: (err) => {
        console.error('Error al cargar habitaciones:', err);
        this.error = 'No se pudieron cargar las habitaciones';
        this.isLoading = false;
      }
    });
  }

  // Computed property para habitaciones filtradas
  get filteredRooms(): HabitacionDetalle[] {
    return this.rooms.filter(room => {
      // Filtro por término de búsqueda
      const matchesSearch = !this.searchTerm || 
        room.numeroHabitacion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        room.tipoHabitacion.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtro por tipo
      const matchesType = !this.filterType || 
        room.tipoHabitacion.nombre.toLowerCase() === this.filterType.toLowerCase();

      // Filtro por estado
      const matchesStatus = !this.filterStatus || 
        room.estado.toLowerCase() === this.filterStatus.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  // Navegar a crear habitación
  navigateToCreateRoom(): void {
    this.router.navigate(['/admin/crear-habitacion']);
  }

  // Ver detalles de habitación
  viewRoom(id: number): void {
    this.router.navigate(['/admin/habitaciones', id]);
  }

  // Editar habitación
  editRoom(id: number): void {
    this.router.navigate(['/admin/editar-habitacion', id]);
  }

  // Eliminar habitación
  deleteRoom(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta habitación?')) {
      this.roomService.deleteRoom(id).subscribe({
        next: () => {
          this.loadRooms();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('No se pudo eliminar la habitación');
        }
      });
    }
  }

  // Helper para obtener label de estado (usado en el HTML)
  getStatusLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      'disponible': 'Disponible',
      'ocupada': 'Ocupada',
      'mantenimiento': 'Mantenimiento',
      'limpieza': 'Limpieza'
    };
    return labels[estado.toLowerCase()] || estado;
  }

  // Helper para obtener el nombre del tipo
  getTipoNombre(room: HabitacionDetalle): string {
    return room.tipoHabitacion?.nombre || 'Sin tipo';
  }

  // Helper para badge de estado
  getEstadoBadgeClass(estado: string): string {
    const estados: { [key: string]: string } = {
      'disponible': 'badge-success',
      'ocupada': 'badge-error',
      'mantenimiento': 'badge-warning',
      'limpieza': 'badge-info'
    };
    return estados[estado.toLowerCase()] || 'badge-secondary';
  }
}