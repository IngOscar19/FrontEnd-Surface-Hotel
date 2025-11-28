export interface Temporada {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  factorMultiplicador: number;
  activo: boolean;
}

export interface TipoHabitacion {
  id: number;
  nombre: string;
  descripcion?: string;
  factorTipo: number;
}

export interface Habitacion {
  id: number;
  numeroHabitacion: string;
  tipoHabitacionId: number;
  precioBase: number; // ¡Aquí está el dato importante!
  estado: string;
}

// Interfaz auxiliar para mostrar en la tabla de Configuración
export interface PrecioPorTipoView {
  idTipo: number;
  nombreTipo: string;
  precioBase: number;
  cantidadHabitaciones: number; // Opcional: para saber cuántas hay de este tipo
}