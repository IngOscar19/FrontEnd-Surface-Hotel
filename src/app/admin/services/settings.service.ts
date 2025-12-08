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

   
  getTemporadas(): Observable<Temporada[]> {
    return this.http.get<Temporada[]>(`${this.apiUrl}/TemporadaPrecio`);
  }

  
  getTiposHabitacion(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(`${this.apiUrl}/TiposHabitacion`);
  }

  
  getHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.apiUrl}/Habitacion`);
  }

 
  getDashboardData() {
    return forkJoin({
      temporadas: this.getTemporadas(),
      tipos: this.getTiposHabitacion()
    });
  }

 
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

  
  updateHabitacion(id: number, habitacion: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.apiUrl}/Habitacion/${id}`, habitacion);
  }

  
  updatePrecioPorTipo(tipoId: number, nuevoPrecio: number, todasLasHabitaciones: Habitacion[]): Observable<any> {
    
    const habitacionesAActualizar = todasLasHabitaciones.filter(h => h.tipoHabitacionId === tipoId);
    
    if (habitacionesAActualizar.length === 0) {
      return of([]); 
    }

    
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