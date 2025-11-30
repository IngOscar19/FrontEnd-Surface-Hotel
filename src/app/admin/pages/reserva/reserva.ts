import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

// Servicios
import { HuespedService } from '../../services/huesped.service';
import { ReservacionService } from '../../services/reservacion.service';
import { RoomService } from '../../services/room.service';

// Interfaces
import { HabitacionDetalle } from '../../../core/interface/room.interface';
import {
  CreateHuespedDTO,
  ReservaCreateDto,
  ReservaResponseDto,
  Huesped
} from '../../../core/interface/reserva.interface';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.html',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule
  ]
})
export class ReservaComponent implements OnInit {

  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private huespedService = inject(HuespedService);
  private reservationService = inject(ReservacionService);
  private roomService = inject(RoomService);

  // Signals para estado
  currentStep = signal(1);
  loading = signal(false);
  errorMessage = signal('');
  
  habitaciones = signal<HabitacionDetalle[]>([]); 
  huespedIdCreado = signal<number | null>(null);

  // Formularios
  guestForm = this.fb.group({
    Nombre: ['', Validators.required],
    Apellido: ['', Validators.required],
    NumeroDocumento: ['', Validators.required],
    TipoDocumento: ['DNI'], 
    FechaNacimiento: [''], 
    Telefono: [''], // CORRECCIÓN: Quitado Validators.required si no es obligatorio
    Email: ['', [Validators.email]] // CORRECCIÓN: Email opcional pero validado
  });

  bookingForm = this.fb.group({
    HabitacionId: [null as number | null, Validators.required], // CORRECCIÓN: Tipo correcto
    FechaEntrada: ['', Validators.required],
    FechaSalida: ['', Validators.required],
    NumeroHuespedes: [1, [Validators.required, Validators.min(1)]],
    Observaciones: ['']
  });

  // Ciclo de vida: Al iniciar el componente
  ngOnInit() {
    this.loadRooms();
    console.log('Componente inicializado');
  }

  // Método para cargar habitaciones
  loadRooms() {
    console.log('Cargando habitaciones...');
    this.roomService.getRooms().subscribe({
      next: (data) => {
        console.log('Habitaciones recibidas del servicio:', data);
        this.habitaciones.set(data);
      },
      error: (err) => {
        console.error('Error cargando habitaciones:', err);
        this.errorMessage.set('No se pudieron cargar las habitaciones disponibles.');
      }
    });
  }

  // Envío del Huésped
  submitGuest() {
    if (this.guestForm.invalid) {
      this.guestForm.markAllAsTouched();
      this.errorMessage.set("Por favor complete los datos obligatorios del huésped.");
      return;
    }

    // CORRECCIÓN: Construcción correcta del payload
    const formValue = this.guestForm.value;
    const payload: CreateHuespedDTO = {
      Nombre: formValue.Nombre || '',
      Apellido: formValue.Apellido || '',
      NumeroDocumento: formValue.NumeroDocumento || null,
      TipoDocumento: formValue.TipoDocumento || null,
      FechaNacimiento: formValue.FechaNacimiento || null,
      Telefono: formValue.Telefono || null,
      Email: formValue.Email || null
    };

    console.log('Enviando huésped con payload:', payload);
    this.loading.set(true);

    this.huespedService.createHuesped(payload).subscribe({
      next: (huesped: Huesped) => {
        this.loading.set(false);
        this.errorMessage.set('');
        
        console.log('Huésped creado exitosamente:', huesped);
        console.log('ID del huésped:', huesped.id);
        
        // Guardamos el ID (en camelCase)
        this.huespedIdCreado.set(huesped.id);
        
        // Verificación adicional
        console.log('✅ ID guardado en signal:', this.huespedIdCreado());
        
        this.currentStep.set(2);
      },
      error: (err: any) => {
        this.loading.set(false);
        console.error('Error completo:', err);
        
        // CORRECCIÓN: Mejor manejo de errores
        if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else if (err.error?.errors) {
          const errors = Object.values(err.error.errors).flat();
          this.errorMessage.set(`Errores: ${errors.join(', ')}`);
        } else {
          this.errorMessage.set("Error al registrar el huésped. Intente nuevamente.");
        }
      }
    });
  }

  // Envío de la Reserva
  submitBooking() {
    console.log('=== INICIO submitBooking ===');
    console.log('Estado del formulario:', this.bookingForm.value);
    console.log('ID del huésped en signal:', this.huespedIdCreado());
    
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      this.errorMessage.set("Por favor seleccione fechas y habitación.");
      return;
    }

    const guestId = this.huespedIdCreado();
    
    if (!guestId) {
      console.error('ERROR: No hay ID de huésped');
      this.errorMessage.set("Error: No se ha identificado al huésped. Vuelva al paso 1.");
      this.currentStep.set(1); // Forzar volver al paso 1
      return;
    }

    const formValues = this.bookingForm.value;

    // CORRECCIÓN: Validar que HabitacionId no sea null
    if (!formValues.HabitacionId) {
      this.errorMessage.set("Por favor seleccione una habitación.");
      return;
    }

    // CORRECCIÓN: Construcción correcta del payload
    const payload: ReservaCreateDto = {
      HabitacionId: Number(formValues.HabitacionId),
      HuespedId: guestId,
      FechaEntrada: formValues.FechaEntrada || '',
      FechaSalida: formValues.FechaSalida || '',
      NumeroHuespedes: Number(formValues.NumeroHuespedes) || 1,
      Observaciones: formValues.Observaciones || null
    };

    console.log('Payload de reserva a enviar:', payload);

    this.loading.set(true);

    this.reservationService.createReservation(payload).subscribe({
              next: (reserva: ReservaResponseDto) => {
        this.loading.set(false);
        this.errorMessage.set('');
        console.log('Reserva creada exitosamente:', reserva);
        this.currentStep.set(3); // Éxito
        
        // OPCIONAL: Resetear formularios después de mostrar éxito
        setTimeout(() => {
          this.resetForms();
        }, 100);
      },
      error: (err: any) => {
        this.loading.set(false);
        console.error('Error completo al crear reserva:', err);
        
        // CORRECCIÓN: Mejor manejo de errores
        if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else if (err.error?.errors) {
          const errors = Object.values(err.error.errors).flat();
          this.errorMessage.set(`Errores: ${errors.join(', ')}`);
        } else if (err.status === 0) {
          this.errorMessage.set("No se pudo conectar con el servidor. Verifique su conexión.");
        } else {
          this.errorMessage.set("Error al crear la reserva. Verifique disponibilidad.");
        }
      }
    });
  }

  // NUEVO: Método para resetear formularios
  private resetForms() {
    this.guestForm.reset({
      TipoDocumento: 'DNI'
    });
    this.bookingForm.reset({
      NumeroHuespedes: 1
    });
    this.huespedIdCreado.set(null);
  }

  // NUEVO: Método para volver a empezar
  startNew() {
    this.currentStep.set(1);
    this.resetForms();
    this.errorMessage.set('');
    this.loadRooms(); // Recargar habitaciones
  }
}