// -------- HUESPED -----------
export interface CreateHuespedDTO {
  Nombre: string;
  Apellido: string;
  Email?: string | null;
  Telefono?: string | null;
  NumeroDocumento?: string | null;
  TipoDocumento?: string | null;
  Nacionalidad?: string | null;
  Direccion?: string | null;
  FechaNacimiento?: string | null;
}

// Tu backend devuelve propiedades en camelCase (minúscula)
export interface Huesped {
  id: number;          // camelCase
  nombre: string;
  apellido: string;
  email?: string | null;
  telefono?: string | null;
  numeroDocumento?: string | null;
  tipoDocumento?: string | null;
  nacionalidad?: string | null;
  direccion?: string | null;
  fechaNacimiento?: string | null;
  creadoEn?: string;
  actualizadoEn?: string;
}

// -------- RESERVAS ----------
export interface ReservaCreateDto {
  HabitacionId: number;
  HuespedId: number;
  FechaEntrada: string;
  FechaSalida: string;
  NumeroHuespedes: number;
  Observaciones?: string | null;
}

export interface ReservaResponseDto {
  id: number;                  // camelCase
  habitacionId: number;
  huespedId: number;
  fechaEntrada: string;
  fechaSalida: string;
  numeroNoches: number;
  numeroHuespedes: number;
  estado: string;
  precioPorNoche: number;
  precioTotal: number;
  observaciones?: string | null;
  creadoEn: string;
  nombreHabitacion?: string;
  nombreHuesped?: string;
}