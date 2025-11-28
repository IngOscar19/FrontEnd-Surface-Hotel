import { Component, OnInit, inject,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { RoomService } from '../../services/room.service';
import { TipoHabitacion, Servicio, CreateRoomDTO } from '../../../core/interface/room.interface'

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-room.component.html'
})
export class CreateRoomComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roomService = inject(RoomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  roomForm: FormGroup;
  selectedFiles: File[] = [];
  
  isLoading = signal(false);
  isEditMode = signal(false);
  roomId: number | null = null;
  
  tiposHabitacion: TipoHabitacion[] = [];
  serviciosDisponibles: Servicio[] = [];

  constructor() {
    this.roomForm = this.fb.group({
      NumeroHabitacion: ['', Validators.required],
      TipoHabitacionId: ['', Validators.required],
      Piso: ['', [Validators.required, Validators.min(1)]],
      PrecioBase: ['', [Validators.required, Validators.min(0)]],
      Capacidad: ['', [Validators.required, Validators.min(1)]],
      Descripcion: ['', Validators.required],
      ServiciosIds: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Cargar catálogos PRIMERO
    this.loadCatalogs();
    
    // Luego verificar si estamos en modo edición
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.isEditMode.set(true);
        this.roomId = +params['id'];
        // Esperar a que los catálogos se carguen antes de cargar los datos de la habitación
        setTimeout(() => {
          this.loadRoomData(this.roomId!);
        }, 500);
      }
    });
  }

  loadCatalogs(): void {
    console.log('Cargando catálogos...');
    
    this.roomService.getTiposHabitacion().subscribe({
      next: (data: TipoHabitacion[]) => {
        console.log('Tipos de habitación cargados:', data);
        this.tiposHabitacion = data;
      },
      error: (err: any) => {
        console.error('Error cargando tipos de habitación:', err);
        // Datos de ejemplo si falla
        this.tiposHabitacion = [
          { id: 1, nombre: 'Simple' },
          { id: 2, nombre: 'Doble' },
          { id: 3, nombre: 'Suite' },
          { id: 4, nombre: 'Deluxe' }
        ];
      }
    });

    this.roomService.getServicios().subscribe({
      next: (data: Servicio[]) => {
        console.log('Servicios cargados:', data);
        this.serviciosDisponibles = data;
      },
      error: (err: any) => {
        console.error('Error cargando servicios:', err);
        // Datos de ejemplo si falla
        this.serviciosDisponibles = [
          { id: 1, nombre: 'WiFi' },
          { id: 2, nombre: 'Aire Acondicionado' },
          { id: 3, nombre: 'TV' },
          { id: 4, nombre: 'Minibar' },
          { id: 5, nombre: 'Caja Fuerte' },
          { id: 6, nombre: 'Balcón' },
          { id: 7, nombre: 'Desayuno Incluido' },
          { id: 8, nombre: 'Room Service' }
        ];
      }
    });
  }

  loadRoomData(id: number): void {
    this.isLoading.set(true);
    this.roomService.getRoomById(id).subscribe({
      next: (room: any) => {
        this.roomForm.patchValue({
          NumeroHabitacion: room.numeroHabitacion,
          TipoHabitacionId: room.tipoHabitacionId,
          Piso: room.piso,
          PrecioBase: room.precioBase,
          Capacidad: room.capacidad,
          Descripcion: room.descripcion
        });

        // Cargar servicios seleccionados
        if (room.servicios && room.servicios.length > 0) {
          const serviciosArray = this.roomForm.get('ServiciosIds') as FormArray;
          room.servicios.forEach((servicio: any) => {
            serviciosArray.push(new FormControl(servicio.id));
          });
        }

        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error cargando habitación:', err);
        this.isLoading.set(false);
      }
    });
  }

  onServiceChange(event: Event, servicioId: number): void {
    const formArray: FormArray = this.roomForm.get('ServiciosIds') as FormArray;
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      formArray.push(new FormControl(servicioId));
    } else {
      const index = formArray.controls.findIndex(x => x.value === servicioId);
      if (index !== -1) {
        formArray.removeAt(index);
      }
    }
  }

  isServiceSelected(servicioId: number): boolean {
    const serviciosArray = this.roomForm.get('ServiciosIds') as FormArray;
    return serviciosArray.controls.some(control => control.value === servicioId);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onSubmit(): void {
    if (this.roomForm.invalid) {
      this.roomForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    if (this.isEditMode() && this.roomId) {
      // Modo edición
      this.roomService.updateRoom(this.roomId, this.roomForm.value, this.selectedFiles).subscribe({
        next: () => {
          this.isLoading.set(false);
          alert('Habitación actualizada exitosamente');
          this.router.navigate(['/admin/habitaciones']);
        },
        error: (err: any) => {
          console.error('Error actualizando habitación:', err);
          this.isLoading.set(false);
          alert('Error al actualizar la habitación');
        }
      });
    } else {
      // Modo creación
      this.roomService.createRoom(this.roomForm.value, this.selectedFiles).subscribe({
        next: () => {
          this.isLoading.set(false);
          alert('Habitación creada exitosamente');
          this.router.navigate(['/admin/habitaciones']);
        },
        error: (err: any) => {
          console.error('Error creando habitación:', err);
          this.isLoading.set(false);
          alert('Error al crear la habitación');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/habitaciones']);
  }
}