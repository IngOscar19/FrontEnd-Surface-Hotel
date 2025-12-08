import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService, DashboardStats, HabitacionStats } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html' 
})
export class DashboardPageComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);

  
  stats = signal<DashboardStats | null>(null);
  estadosHabitaciones = signal<HabitacionStats[]>([]);
  habitacionesRecientes = signal<any[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  
  usuario = this.authService.currentUser;

  
  nombreUsuario = computed(() => this.usuario()?.nombre || 'Usuario');
  rolUsuario = computed(() => this.usuario()?.rol || 'Sin rol');

  ngOnInit(): void {
    this.cargarEstadisticas();
    this.cargarHabitacionesPorEstado();
    this.cargarHabitacionesRecientes();
  }

  cargarEstadisticas(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.dashboardService.getEstadisticas().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
        
      },
      error: (err) => {
        console.error('Error cargando estadísticas:', err);
        this.error.set('No se pudieron cargar las estadísticas');
        this.loading.set(false);
      }
    });
  }

  cargarHabitacionesPorEstado(): void {
    this.dashboardService.getHabitacionesPorEstado().subscribe({
      next: (data) => {
        this.estadosHabitaciones.set(data);
        
      },
      error: (err) => {
        console.error('Error cargando estados:', err);
      }
    });
  }

  cargarHabitacionesRecientes(): void {
    this.dashboardService.getHabitacionesRecientes().subscribe({
      next: (data) => {
        this.habitacionesRecientes.set(data);
       
      },
      error: (err) => {
        console.error('Error cargando habitaciones recientes:', err);
      }
    });
  }

  
  getEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'disponible': 'bg-green-100 text-green-800',
      'ocupada': 'bg-red-100 text-red-800',
      'mantenimiento': 'bg-yellow-100 text-yellow-800',
      'limpieza': 'bg-blue-100 text-blue-800'
    };
    return colores[estado.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }

 
  verHabitaciones(): void {
    this.router.navigate(['/admin/habitaciones']);
  }

  verHabitacion(id: number): void {
    this.router.navigate(['/admin/habitaciones', id]);
  }

  logout(): void {
    ('Cerrando sesión desde dashboard');
    this.authService.logout();
  }

  
  refrescarDatos(): void {
    ('Refrescando datos del dashboard');
    this.cargarEstadisticas();
    this.cargarHabitacionesPorEstado();
    this.cargarHabitacionesRecientes();
  }
}