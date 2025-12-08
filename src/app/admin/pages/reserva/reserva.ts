import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router'; 
import { HuespedService } from '../../services/huesped.service';
import { ReservacionService } from '../../services/reservacion.service';
import { RoomService } from '../../services/room.service';
import { AlertService } from '../../../core/services/alert.service'; 
import { HabitacionDetalle } from '../../../core/interface/room.interface';
import {
  CreateHuespedDTO,
  ReservaCreateDto,
  ReservaResponseDto,
  Huesped
} from '../../../core/interface/reserva.interface';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    RouterLink
  ],
  templateUrl: './reserva.html'
})
export class ReservaComponent implements OnInit {

  private fb = inject(FormBuilder);
  private huespedService = inject(HuespedService);
  private reservationService = inject(ReservacionService);
  private roomService = inject(RoomService);
  private alertService = inject(AlertService); 

  currentStep = signal(1);
  loading = signal(false);
  
  
  habitaciones = signal<HabitacionDetalle[]>([]); 
  huespedIdCreado = signal<number | null>(null);


  guestForm = this.fb.group({
    Nombre: ['', Validators.required],
    Apellido: ['', Validators.required],
    NumeroDocumento: ['', Validators.required],
    TipoDocumento: ['DNI'], 
    FechaNacimiento: [''], 
    Telefono: [''], 
    Email: ['', [Validators.email]]
  });

  bookingForm = this.fb.group({
    HabitacionId: [null as number | null, Validators.required],
    FechaEntrada: ['', Validators.required],
    FechaSalida: ['', Validators.required],
    NumeroHuespedes: [1, [Validators.required, Validators.min(1)]],
    Observaciones: ['']
  });

  ngOnInit() {
    this.loadRooms();
  }

  // Método para cargar habitaciones
  loadRooms() {
    ('Cargando habitaciones...');
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.habitaciones.set(data);
      },
      error: (err) => {
        console.error('Error cargando habitaciones:', err);
      
        this.alertService.error('No se pudieron cargar las habitaciones disponibles. Verifique su conexión.');
      }
    });
  }

  // Envío del Huésped
  submitGuest() {
    if (this.guestForm.invalid) {
      this.guestForm.markAllAsTouched();
      this.alertService.warning('Por favor complete todos los campos obligatorios del huésped.');
      return;
    }

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

    this.loading.set(true);

    this.huespedService.createHuesped(payload).subscribe({
      next: (huesped: Huesped) => {
        this.loading.set(false);
        
       
        this.huespedIdCreado.set(huesped.id);
        
        
        this.alertService.success('Huésped registrado correctamente. Continúe con la reserva.');
        
        this.currentStep.set(2);
      },
      error: (err: any) => {
        this.loading.set(false);
        console.error('Error al crear huésped:', err);
        
        let msg = 'Error al registrar el huésped.';
        if (err.error?.message) {
          msg = err.error.message;
        } else if (err.error?.errors) {
          const errors = Object.values(err.error.errors).flat();
          msg = `Errores: ${errors.join(', ')}`;
        }

        
        this.alertService.error(msg);
      }
    });
  }

  
  submitBooking() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      
      this.alertService.warning('Por favor seleccione las fechas y una habitación válida.');
      return;
    }

    const guestId = this.huespedIdCreado();
    
    if (!guestId) {
      this.alertService.error('Error crítico: No se ha identificado al huésped. Vuelva al paso 1.');
      this.currentStep.set(1);
      return;
    }

    const formValues = this.bookingForm.value;

    if (!formValues.HabitacionId) {
      this.alertService.warning('Debe seleccionar una habitación para continuar.');
      return;
    }

    const payload: ReservaCreateDto = {
      HabitacionId: Number(formValues.HabitacionId),
      HuespedId: guestId,
      FechaEntrada: formValues.FechaEntrada || '',
      FechaSalida: formValues.FechaSalida || '',
      NumeroHuespedes: Number(formValues.NumeroHuespedes) || 1,
      Observaciones: formValues.Observaciones || null
    };

    this.loading.set(true);

    this.reservationService.createReservation(payload).subscribe({
      next: (reserva: ReservaResponseDto) => {
        this.loading.set(false);
      
        
       
        this.alertService.success('¡Reserva confirmada exitosamente!');
        
        this.currentStep.set(3);
        
        setTimeout(() => {
          this.resetForms();
        }, 100);
      },
      error: (err: any) => {
        this.loading.set(false);
        console.error('Error reserva:', err);
        
        let msg = 'Error al crear la reserva.';
        if (err.error?.message) {
          msg = err.error.message;
        } else if (err.status === 0) {
          msg = 'No se pudo conectar con el servidor.';
        }

        
        this.alertService.error(msg);
      }
    });
  }

  private resetForms() {
    this.guestForm.reset({
      TipoDocumento: 'DNI'
    });
    this.bookingForm.reset({
      NumeroHuespedes: 1
    });
    this.huespedIdCreado.set(null);
  }

  startNew() {
    this.currentStep.set(1);
    this.resetForms();
    this.loadRooms();
    this.alertService.info('Listo para una nueva reserva');
  }
}