import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

export interface DashboardStats {
  totalHabitaciones: number;
  habitacionesDisponibles: number;
  habitacionesOcupadas: number;
  habitacionesMantenimiento: number;
  porcentajeOcupacion: number;
  reservasActivas: number;
  checkInsHoy: number;
  checkOutsHoy: number;
  ingresosMes: number;
}

export interface HabitacionStats {
  estado: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Obtener estadísticas completas del dashboard
  getEstadisticas(): Observable<DashboardStats> {
    return forkJoin({
      habitaciones: this.http.get<any[]>(`${this.apiUrl}/habitaciones`),
    }).pipe(
      map(({ habitaciones }) => {
        // Calcular estadísticas de habitaciones
        const total = habitaciones.length;
        const disponibles = habitaciones.filter(h => h.estado === 'disponible').length;
        const ocupadas = habitaciones.filter(h => h.estado === 'ocupada').length;
        const mantenimiento = habitaciones.filter(h => h.estado === 'mantenimiento').length;
        
        const porcentaje = total > 0 ? Math.round((ocupadas / total) * 100) : 0;

        return {
          totalHabitaciones: total,
          habitacionesDisponibles: disponibles,
          habitacionesOcupadas: ocupadas,
          habitacionesMantenimiento: mantenimiento,
          porcentajeOcupacion: porcentaje,
          reservasActivas: 0, 
          checkInsHoy: 0,
          checkOutsHoy: 0,
          ingresosMes: 0
        };
      })
    );
  }

  // Obtener habitaciones por estado
  getHabitacionesPorEstado(): Observable<HabitacionStats[]> {
    return this.http.get<any[]>(`${this.apiUrl}/habitaciones`).pipe(
      map(habitaciones => {
        const estadosMap = new Map<string, number>();
        
        habitaciones.forEach(h => {
          const estado = h.estado || 'sin estado';
          estadosMap.set(estado, (estadosMap.get(estado) || 0) + 1);
        });

        return Array.from(estadosMap.entries()).map(([estado, cantidad]) => ({
          estado,
          cantidad
        }));
      })
    );
  }

  // Obtener habitaciones recientes (últimas 5)
  getHabitacionesRecientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/habitaciones`).pipe(
      map(habitaciones => {
        // Ordenar por fecha de actualización
        return habitaciones
          .sort((a, b) => new Date(b.actualizadoEn).getTime() - new Date(a.actualizadoEn).getTime())
          .slice(0, 5);
      })
    );
  }
}