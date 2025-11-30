export interface Temporada {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  factorMultiplicador: number;
  activo: boolean;
  creadoEn?: string;
  actualizadoEn?: string;
  habitacionPrecios?: any[];
}

export interface TipoHabitacion {
  id: number;
  nombre: string;
  descripcion?: string;
  capacidad?: number;
  factorTipo: number;
  activo?: boolean;
}

export interface Habitacion {
  id: number;
  numeroHabitacion: string;
  tipoHabitacionId: number;
  tipoHabitacion?: TipoHabitacion;
  precioBase: number;
  estado: string;
  piso?: number;
  descripcion?: string;
  activo?: boolean;
}

// Interfaz auxiliar para mostrar en la tabla de Configuración
export interface PrecioPorTipoView {
  idTipo?: number;
  nombreTipo: string;
  precioBase: number;
  cantidadHabitaciones: number;
}

// DTOs para crear/actualizar
export interface TemporadaCreateDto {
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  factorMultiplicador: number;
  activo: boolean;
}