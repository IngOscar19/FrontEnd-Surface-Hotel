import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment'; 
import { Observable, tap } from 'rxjs';
import { CreateHuespedDTO, Huesped } from '../../core/interface/reserva.interface';

@Injectable({ providedIn: 'root' })
export class HuespedService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createHuesped(data: CreateHuespedDTO): Observable<Huesped> {
    console.log('🔵 HuespedService - Enviando POST a:', `${this.apiUrl}/Huesped`);
    console.log('🔵 HuespedService - Payload:', JSON.stringify(data, null, 2));
    
    return this.http.post<Huesped>(`${this.apiUrl}/Huesped`, data).pipe(
      tap({
        next: (response) => {
          console.log('✅ HuespedService - Respuesta exitosa:', response);
          console.log('✅ HuespedService - ID recibido:', response.id);
        },
        error: (error) => {
          console.error('❌ HuespedService - Error COMPLETO:', error);
          console.error('❌ HuespedService - Status:', error.status);
          console.error('❌ HuespedService - URL:', error.url);
          console.error('❌ HuespedService - StatusText:', error.statusText);
          
          // Intentar extraer el mensaje de error del backend
          if (error.error) {
            if (typeof error.error === 'string') {
              console.error('❌ HuespedService - Error del servidor (texto):', error.error.substring(0, 500));
            } else {
              console.error('❌ HuespedService - Error del servidor (objeto):', error.error);
            }
          }
        }
      })
    );
  }

  getHuespedes(): Observable<Huesped[]> {
    console.log('🔵 HuespedService - GET huespedes');
    return this.http.get<Huesped[]>(`${this.apiUrl}/huespedes`);
  }
}