import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment'; 
import { Observable, tap } from 'rxjs';
import { ReservaCreateDto, ReservaResponseDto } from '../../core/interface/reserva.interface';
import { HabitacionDetalle } from '../../core/interface/room.interface';

@Injectable({ providedIn: 'root' })
export class ReservacionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createReservation(data: ReservaCreateDto): Observable<ReservaResponseDto> {
    return this.http.post<ReservaResponseDto>(`${this.apiUrl}/reservas`, data); 
  }

  getReservations(): Observable<ReservaResponseDto[]> {
    return this.http.get<ReservaResponseDto[]>(`${this.apiUrl}/reservas`);
  }

  // Nuevo método para obtener habitaciones disponibles por fechas
  getAvailableRooms(fechaEntrada: string, fechaSalida: string): Observable<HabitacionDetalle[]> {
    const params = new HttpParams()
      .set('fechaEntrada', fechaEntrada)
      .set('fechaSalida', fechaSalida);
    
    return this.http.get<HabitacionDetalle[]>(`${this.apiUrl}/habitaciones/disponibles`, { params });
  }

  // Método alternativo si tu backend tiene un endpoint diferente
  checkRoomAvailability(habitacionId: number, fechaEntrada: string, fechaSalida: string): Observable<{ disponible: boolean }> {
    const params = new HttpParams()
      .set('fechaEntrada', fechaEntrada)
      .set('fechaSalida', fechaSalida);
    
    return this.http.get<{ disponible: boolean }>(`${this.apiUrl}/habitaciones/${habitacionId}/disponibilidad`, { params });
  }

  confirmReservation(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reservas/${id}/confirmar`, {}).pipe(
      tap(() => console.log(`Reserva ${id} confirmada exitosamente`))
    );
  }

  cancelReservation(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reservas/${id}/cancelar`, {}).pipe(
      tap(() => console.log(`Reserva ${id} cancelada exitosamente`))
    );
  }
}