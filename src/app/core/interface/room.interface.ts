export interface TipoHabitacion {
  id: number;
  nombre: string;
}

export interface Servicio {
  id: number;
  nombre: string;
}

export interface CreateRoomDTO {
  NumeroHabitacion: string;
  TipoHabitacionId: number;
  Piso: number;
  PrecioBase: number;
  Capacidad: number;
  Descripcion: string;
  ServiciosIds: number[];
}


export interface TipoHabitacionDetalle {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Foto {
  id: number;
  url: string;
  descripcion: string | null;
  esPrincipal: boolean;
}

export interface ServicioDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface HabitacionDetalle {
  id: number;
  numeroHabitacion: string;
  piso: number;
  precioBase: number;
  capacidad: number;
  descripcion: string | null;
  estado: string;
  tipoHabitacionId: number;
  tipoHabitacion: TipoHabitacionDetalle;
  fotos: Foto[];
  servicios: ServicioDetalle[];
  creadoEn: string;
  actualizadoEn: string;
}