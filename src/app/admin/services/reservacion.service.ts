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
    
    return this.http.post<ReservaResponseDto>(`${this.apiUrl}/reservas`, data); 
  }

  getReservations(): Observable<ReservaResponseDto[]> {
    return this.http.get<ReservaResponseDto[]>(`${this.apiUrl}/reservas`);
  }

  
  confirmReservation(id: number): Observable<any> {
    (`ReservacionService - Confirmando reserva ${id}`);
    return this.http.patch(`${this.apiUrl}/reservas/${id}/confirmar`, {}).pipe(
      tap(() => (`Reserva ${id} confirmada exitosamente`))
    );
  }

   
  cancelReservation(id: number): Observable<any> {
    (`ReservacionService - Cancelando reserva ${id}`);
    return this.http.patch(`${this.apiUrl}/reservas/${id}/cancelar`, {}).pipe(
      tap(() => (`Reserva ${id} cancelada exitosamente`))
    );
  }
}