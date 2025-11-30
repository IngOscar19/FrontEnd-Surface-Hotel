import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment'; 
import { Observable, tap } from 'rxjs';
import { ReservaCreateDto, ReservaResponseDto } from '../../core/interface/reserva.interface';

@Injectable({ providedIn: 'root' })
export class ReservacionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createReservation(data: ReservaCreateDto): Observable<ReservaResponseDto> {
    console.log('🔵 ReservacionService - Enviando POST a:', `${this.apiUrl}/reservas`);
    console.log('🔵 ReservacionService - Payload:', data);
    
    return this.http.post<ReservaResponseDto>(`${this.apiUrl}/reservas`, data).pipe(
      tap({
        next: (response) => {
          console.log('✅ ReservacionService - Reserva creada exitosamente:', response);
          console.log('✅ ReservacionService - ID de reserva:', response.id);
        },
        error: (error) => {
          console.error('❌ ReservacionService - Error al crear reserva:', error);
          console.error('❌ ReservacionService - Status:', error.status);
          console.error('❌ ReservacionService - Mensaje:', error.message);
          console.error('❌ ReservacionService - Detalles:', error.error);
        }
      })
    );
  }

  getReservations(): Observable<ReservaResponseDto[]> {
    console.log('🔵 ReservacionService - GET reservas');
    return this.http.get<ReservaResponseDto[]>(`${this.apiUrl}/reservas`);
  }
}