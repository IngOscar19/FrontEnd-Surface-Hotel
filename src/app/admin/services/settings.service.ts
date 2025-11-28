import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Temporada, TipoHabitacion, Habitacion } from '../../core/interface/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5053/api'; 

  
  // ... (Tus métodos anteriores getTemporadas, getHabitaciones, etc. déjalos igual) ...
  getTemporadas(): Observable<Temporada[]> {
    return this.http.get<Temporada[]>(`${this.apiUrl}/TemporadaPrecio`);
  }

  getTiposHabitacion(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(`${this.apiUrl}/TiposHabitacion`); // Asegura que este endpoint exista o usa un mock
  }

  getHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.apiUrl}/Habitacion`);
  }

  getDashboardData() {
    return forkJoin({
      temporadas: this.getTemporadas(),
      tipos: this.getTiposHabitacion(),
      habitaciones: this.getHabitaciones()
    });
  }

  // --- NUEVOS MÉTODOS PARA LOS BOTONES ---

  // 1. Crear Temporada
  createTemporada(temporada: any): Observable<Temporada> {
    return this.http.post<Temporada>(`${this.apiUrl}/TemporadaPrecio`, temporada);
  }

  // 2. Actualizar Precios Masivamente
  // Recibe: { tipoId: 1, nuevoPrecio: 1500 } y la lista actual de habitaciones para saber cuáles actualizar
  updatePrecioPorTipo(tipoId: number, nuevoPrecio: number, todasLasHabitaciones: Habitacion[]): Observable<any> {
    // Filtramos las habitaciones que son de este tipo
    const habitacionesAActualizar = todasLasHabitaciones.filter(h => h.tipoHabitacionId === tipoId);
    
    if (habitacionesAActualizar.length === 0) return new Observable(o => o.complete());

    // Creamos una petición PUT para cada habitación (Esto es temporal, lo ideal sería un endpoint masivo en Backend)
    const peticiones = habitacionesAActualizar.map(hab => {
      // Clona el objeto y actualiza el precio
      const habitacionActualizada = { ...hab, precioBase: nuevoPrecio };
      return this.http.put(`${this.apiUrl}/Habitacion/${hab.id}`, habitacionActualizada);
    });

    // Ejecuta todas las peticiones en paralelo
    return forkJoin(peticiones);
  }
}