import { Injectable, signal } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  type: AlertType;
  message: string;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  public alert = signal<Alert | null>(null);
  private timeoutId: any;

  // Método principal para mostrar alertas
  show(type: AlertType, message: string, title?: string, duration: number = 3000) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.alert.set({ type, message, title });

    if (duration > 0) {
      this.timeoutId = setTimeout(() => {
        this.clear();
      }, duration);
    }
  }

  // ====== ALERTAS BÁSICAS ======

  success(message: string, title: string = '¡Éxito!') {
    this.show('success', message, title, 3500);
  }

  error(message: string, title: string = 'Error') {
    this.show('error', message, title, 5000);
  }

  warning(message: string, title: string = 'Atención') {
    this.show('warning', message, title, 4000);
  }

  info(message: string, title: string = 'Información') {
    this.show('info', message, title, 4000);
  }

  // ====== ALERTAS ESPECÍFICAS PARA HUÉSPEDES ======

  huespedCreado(nombre: string) {
    this.show(
      'success',
      `${nombre} ha sido registrado correctamente. Continúe con la reserva.`,
      '¡Huésped Registrado!',
      3500
    );
  }

  huespedExistente(nombre: string) {
    this.show(
      'info',
      `${nombre} ya está registrado en el sistema. Los datos se han cargado automáticamente.`,
      'Huésped Encontrado',
      4000
    );
  }

  huespedDuplicado(documento: string) {
    this.show(
      'warning',
      `Ya existe un huésped registrado con el documento ${documento}. Verifique los datos o use el huésped existente.`,
      'Documento Duplicado',
      5000
    );
  }

  // ====== ALERTAS ESPECÍFICAS PARA RESERVAS ======

  reservaCreada(numeroHabitacion: string, fechas: string) {
    this.show(
      'success',
      `Habitación ${numeroHabitacion} reservada del ${fechas}. La habitación ha quedado bloqueada.`,
      '¡Reserva Confirmada!',
      4000
    );
  }

  reservaCancelada(numeroHabitacion: string) {
    this.show(
      'info',
      `La reserva de la habitación ${numeroHabitacion} ha sido cancelada exitosamente.`,
      'Reserva Cancelada',
      3500
    );
  }

  reservaNoEncontrada() {
    this.show(
      'error',
      'No se encontró la reserva solicitada. Puede que haya sido eliminada.',
      'Reserva No Encontrada',
      4000
    );
  }

  // ====== ALERTAS ESPECÍFICAS PARA FECHAS ======

  fechasInvalidas() {
    this.show(
      'error',
      'La fecha de salida debe ser posterior a la fecha de entrada. Por favor, corrija las fechas.',
      'Fechas Inválidas',
      4000
    );
  }

  fechasPasado() {
    this.show(
      'error',
      'No puede seleccionar fechas en el pasado. Elija fechas a partir de hoy.',
      'Fecha No Válida',
      4000
    );
  }

  estadiaMinima(dias: number = 1) {
    this.show(
      'warning',
      `La reserva debe ser de al menos ${dias} día(s). Ajuste las fechas para continuar.`,
      'Estadía Mínima',
      4000
    );
  }

  // ====== ALERTAS DE DISPONIBILIDAD ======

  habitacionesDisponibles(cantidad: number) {
    this.show(
      'success',
      `Se encontraron ${cantidad} habitación(es) disponible(s) para sus fechas seleccionadas.`,
      'Habitaciones Disponibles',
      3000
    );
  }

  sinHabitacionesDisponibles() {
    this.show(
      'warning',
      'No hay habitaciones disponibles para las fechas seleccionadas. Por favor, elija otras fechas.',
      'Sin Disponibilidad',
      5000
    );
  }

  habitacionOcupada(numeroHabitacion: string) {
    this.show(
      'warning',
      `La habitación ${numeroHabitacion} no está disponible en estas fechas. Seleccione otra habitación.`,
      'Habitación Ocupada',
      4000
    );
  }

  // ====== ALERTAS DE VALIDACIÓN ======

  camposIncompletos(campos?: string[]) {
    const mensaje = campos && campos.length > 0
      ? `Complete los siguientes campos obligatorios: ${campos.join(', ')}.`
      : 'Por favor complete todos los campos obligatorios antes de continuar.';

    this.show('warning', mensaje, 'Campos Incompletos', 4500);
  }

  emailInvalido() {
    this.show(
      'error',
      'El formato del correo electrónico no es válido. Ejemplo: usuario@ejemplo.com',
      'Email Inválido',
      3500
    );
  }

  documentoInvalido() {
    this.show(
      'error',
      'El número de documento ingresado no es válido. Verifique e intente nuevamente.',
      'Documento Inválido',
      3500
    );
  }

  telefonoInvalido() {
    this.show(
      'error',
      'El formato del teléfono no es válido. Use el formato: +52 123 456 7890',
      'Teléfono Inválido',
      3500
    );
  }

  // ====== ALERTAS DE CONEXIÓN Y SERVIDOR ======

  errorConexion() {
    this.show(
      'error',
      'No se pudo conectar con el servidor. Verifique su conexión a internet e intente nuevamente.',
      'Error de Conexión',
      6000
    );
  }

  errorServidor() {
    this.show(
      'error',
      'Ocurrió un error en el servidor. Si el problema persiste, contacte al administrador del sistema.',
      'Error del Servidor',
      6000
    );
  }

  sesionExpirada() {
    this.show(
      'warning',
      'Su sesión ha expirado. Por favor, inicie sesión nuevamente para continuar.',
      'Sesión Expirada',
      5000
    );
  }

  sinAutorizacion() {
    this.show(
      'error',
      'No tiene permisos para realizar esta acción. Contacte al administrador si considera que esto es un error.',
      'Acceso Denegado',
      5000
    );
  }

  // ====== ALERTAS DE CARGA ======

  cargandoDatos() {
    this.show(
      'info',
      'Cargando información del sistema...',
      'Procesando',
      0 // Sin duración, se cierra manualmente
    );
  }

  procesandoReserva() {
    this.show(
      'info',
      'Procesando su reserva. Por favor espere...',
      'Procesando',
      0
    );
  }

  // ====== ALERTAS DE OPERACIONES EXITOSAS ======

  operacionExitosa(operacion: string) {
    this.show(
      'success',
      `${operacion} realizado correctamente.`,
      '¡Operación Exitosa!',
      3000
    );
  }

  guardadoExitoso() {
    this.show(
      'success',
      'Los cambios han sido guardados correctamente.',
      'Guardado Exitoso',
      3000
    );
  }

  eliminacionExitosa(elemento: string) {
    this.show(
      'success',
      `${elemento} ha sido eliminado correctamente del sistema.`,
      'Eliminación Exitosa',
      3000
    );
  }

  actualizacionExitosa() {
    this.show(
      'success',
      'La información ha sido actualizada correctamente.',
      'Actualización Exitosa',
      3000
    );
  }

  // ====== ALERTAS PARA PAGOS ======

  pagoExitoso(monto: number) {
    this.show(
      'success',
      `Pago de $${monto.toFixed(2)} procesado exitosamente.Recibirá un comprobante por correo.`,
      '¡Pago Completado!',
      4000
    );
  }

  pagoFallido() {
    this.show(
      'error',
      'No se pudo procesar el pago. Verifique sus datos e intente nuevamente.',
      'Error en el Pago',
      5000
    );
  }

  // ====== ALERTAS DE CONFIRMACIÓN ======

  confirmacionRequerida(accion: string) {
    this.show(
      'warning',
      `¿Está seguro que desea ${accion}? Esta acción no se puede deshacer.`,
      'Confirmación Requerida',
      5000
    );
  }

  // ====== ALERTAS PERSONALIZADAS ======

  custom(config: {
    type: AlertType;
    title: string;
    message: string;
    duration?: number;
  }) {
    this.show(
      config.type,
      config.message,
      config.title,
      config.duration || 4000
    );
  }

  // Limpiar alerta
  clear() {
    this.alert.set(null);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}