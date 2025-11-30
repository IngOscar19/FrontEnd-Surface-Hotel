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
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'No se pudieron cargar las habitaciones';
        this.isLoading = false;
      }
    });
  }

  get filteredRooms(): HabitacionDetalle[] {
    return this.rooms.filter(room => {
      // CORRECCIÓN: Validamos que las propiedades existan antes de usar toLowerCase()
      const searchLower = this.searchTerm.toLowerCase();
      
      const matchesSearch = !this.searchTerm || 
        room.numeroHabitacion?.toString().toLowerCase().includes(searchLower) ||
        room.tipoHabitacion?.nombre?.toLowerCase().includes(searchLower);

      const matchesType = !this.filterType || 
        room.tipoHabitacion?.nombre?.toLowerCase() === this.filterType.toLowerCase();

      const matchesStatus = !this.filterStatus || 
        room.estado?.toLowerCase() === this.filterStatus.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  navigateToCreateRoom(): void {
    this.router.navigate(['/admin/crear-habitacion']);
  }

  viewRoom(id: number): void {
    this.router.navigate(['/admin/habitaciones', id]);
  }

  editRoom(id: number): void {
    this.router.navigate(['/admin/editar-habitacion', id]);
  }

  deleteRoom(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta habitación?')) {
      this.roomService.deleteRoom(id).subscribe({
        next: () => this.loadRooms(),
        error: (err) => alert('No se pudo eliminar la habitación')
      });
    }
  }

  getStatusLabel(estado: string): string {
    // Protección contra undefined
    if (!estado) return 'Desconocido';
    
    const labels: { [key: string]: string } = {
      'disponible': 'Disponible',
      'ocupada': 'Ocupada',
      'mantenimiento': 'Mantenimiento',
      'limpieza': 'Limpieza'
    };
    return labels[estado.toLowerCase()] || estado;
  }
}