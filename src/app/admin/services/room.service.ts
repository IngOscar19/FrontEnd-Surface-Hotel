// src/app/admin/services/room.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';
import { 
  HabitacionDetalle, 
  TipoHabitacion, 
  Servicio,
  CreateRoomDTO 
} from '../../core/interface/room.interface'

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // ✅ Obtener todas las habitaciones
  getRooms(): Observable<HabitacionDetalle[]> {
    return this.http.get<HabitacionDetalle[]>(`${this.apiUrl}/habitaciones`);
  }

  // ✅ Obtener una habitación por ID (CON DETALLE COMPLETO)
  getRoomById(id: number): Observable<HabitacionDetalle> {
    return this.http.get<HabitacionDetalle>(`${this.apiUrl}/habitaciones/${id}`);
  }

  // ✅ Obtener catálogos para llenar los selects
  getTiposHabitacion(): Observable<TipoHabitacion[]> {
    console.log('Llamando a:', `${this.apiUrl}/tipos-habitacion`);
    return this.http.get<TipoHabitacion[]>(`${this.apiUrl}/tipos-habitacion`);
  }

  getServicios(): Observable<Servicio[]> {
    console.log('Llamando a:', `${this.apiUrl}/servicios`);
    return this.http.get<Servicio[]>(`${this.apiUrl}/servicios`);
  }

  // ✅ Crear habitación con fotos
  createRoom(data: CreateRoomDTO, files: File[]): Observable<any> {
    const formData = new FormData();

    formData.append('NumeroHabitacion', data.NumeroHabitacion);
    formData.append('TipoHabitacionId', data.TipoHabitacionId.toString());
    formData.append('Piso', data.Piso.toString());
    formData.append('PrecioBase', data.PrecioBase.toString());
    formData.append('Capacidad', data.Capacidad.toString());
    formData.append('Descripcion', data.Descripcion);

    if (data.ServiciosIds && data.ServiciosIds.length > 0) {
      data.ServiciosIds.forEach((id: number) => {
        formData.append('ServiciosIds', id.toString());
      });
    }

    files.forEach((file) => {
      formData.append('Fotos', file);
    });

    return this.http.post(`${this.apiUrl}/habitaciones`, formData);
  }

  // ✅ Actualizar habitación
  updateRoom(id: number, data: any, files?: File[]): Observable<any> {
    const formData = new FormData();

    formData.append('NumeroHabitacion', data.NumeroHabitacion);
    formData.append('TipoHabitacionId', data.TipoHabitacionId);
    formData.append('Piso', data.Piso);
    formData.append('PrecioBase', data.PrecioBase);
    formData.append('Capacidad', data.Capacidad);
    formData.append('Descripcion', data.Descripcion);

    if (data.ServiciosIds && data.ServiciosIds.length > 0) {
      data.ServiciosIds.forEach((id: number) => {
        formData.append('ServiciosIds', id.toString());
      });
    }

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('Fotos', file);
      });
    }

    return this.http.put(`${this.apiUrl}/habitaciones/${id}`, formData);
  }

  // ✅ Eliminar habitación
  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/habitaciones/${id}`);
  }
}