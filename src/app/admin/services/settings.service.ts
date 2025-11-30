import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Temporada, TipoHabitacion, Habitacion } from '../../core/interface/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5053/api'; 

  // Obtener todas las temporadas
  getTemporadas(): Observable<Temporada[]> {
    return this.http.get<Temporada[]>(`${this.apiUrl}/TemporadaPrecio`);
  }

  // Obtener tipos de habitación
  getTiposHabitacion(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(`${this.apiUrl}/TiposHabitacion`);
  }

  // Obtener habitaciones
  getHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.apiUrl}/Habitacion`);
  }

  // Obtener datos del dashboard de configuración (sin habitaciones)
  getDashboardData() {
    return forkJoin({
      temporadas: this.getTemporadas(),
      tipos: this.getTiposHabitacion()
    });
  }

  // Crear temporada
  createTemporada(temporada: any): Observable<Temporada> {
    const dto = {
      nombre: temporada.nombre,
      descripcion: temporada.descripcion || '',
      fechaInicio: temporada.fechaInicio,
      fechaFin: temporada.fechaFin,
      factorMultiplicador: parseFloat(temporada.factorMultiplicador),
      activo: temporada.activo ?? true
    };
    
    return this.http.post<Temporada>(`${this.apiUrl}/TemporadaPrecio`, dto);
  }

  // Actualizar una habitación
  updateHabitacion(id: number, habitacion: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.apiUrl}/Habitacion/${id}`, habitacion);
  }

  // Actualizar precios masivamente por tipo
  updatePrecioPorTipo(tipoId: number, nuevoPrecio: number, todasLasHabitaciones: Habitacion[]): Observable<any> {
    // Filtrar habitaciones del tipo especificado
    const habitacionesAActualizar = todasLasHabitaciones.filter(h => h.tipoHabitacionId === tipoId);
    
    if (habitacionesAActualizar.length === 0) {
      return of([]); // Retornar observable vacío si no hay habitaciones
    }

    // Crear peticiones PUT para cada habitación
    const peticiones = habitacionesAActualizar.map(hab => {
      const habitacionActualizada: Habitacion = { 
        ...hab, 
        precioBase: nuevoPrecio 
      };
      return this.updateHabitacion(hab.id, habitacionActualizada);
    });

    return forkJoin(peticiones);
  }
}