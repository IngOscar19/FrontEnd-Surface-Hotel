import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { RoomService } from '../../services/room.service';
import { AlertService } from '../../../core/services/alert.service'; 
import { TipoHabitacion, Servicio } from '../../../core/interface/room.interface';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-room.component.html'
})
export class CreateRoomComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roomService = inject(RoomService);
  private alertService = inject(AlertService); 
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  roomForm: FormGroup;
  selectedFiles: File[] = [];
  
  isLoading = signal(false);
  isEditMode = signal(false);
  roomId: number | null = null;
  
  tiposHabitacion: TipoHabitacion[] = [];
  serviciosDisponibles: Servicio[] = [];
  
 
  habitacionActual: any = null;
  
  
  reemplazarFotos = signal(false);

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
    ('🎬 CreateRoomComponent - ngOnInit ejecutado');
    
   
    this.loadCatalogs();
    
    
    this.route.params.subscribe((params: any) => {
      
      if (params['id']) {
        this.isEditMode.set(true);
        this.roomId = +params['id'];
        
        setTimeout(() => {
          this.loadRoomData(this.roomId!);
        }, 500);
      } else {
        this.isEditMode.set(false);
        this.roomId = null;
      }
    });
  }

  loadCatalogs(): void {
    
    this.roomService.getTiposHabitacion().subscribe({
      next: (data: TipoHabitacion[]) => {
        this.tiposHabitacion = data;
      },
      error: (err: any) => {
        console.error('Error cargando tipos de habitación:', err);
        this.alertService.warning('No se pudo conectar con el catálogo de tipos.');
        
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
        this.serviciosDisponibles = data;
      },
      error: (err: any) => {
        console.error('Error cargando servicios:', err);
      }
    });
  }

  loadRoomData(id: number): void {
    
    this.isLoading.set(true);
    
    this.roomService.getRoomById(id).subscribe({
      next: (room: any) => {
        
        // Guardar habitación actual
        this.habitacionActual = room;
        
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
          serviciosArray.clear();
          
          room.servicios.forEach((servicio: any) => {
            serviciosArray.push(new FormControl(servicio.id));
          });
        }

        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error cargando habitación:', err);
        this.isLoading.set(false);
        this.alertService.error('No se pudo cargar la información de la habitación.');
        this.router.navigate(['/admin/habitaciones']);
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
      
      
      // Por defecto, en modo edición, agregar fotos (no reemplazar)
      if (this.isEditMode()) {
        this.reemplazarFotos.set(false);
      }
    }
  }

 
  clearSelectedFiles(): void {
    this.selectedFiles = [];
    this.reemplazarFotos.set(false);
  }

  getImageUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:5053${url}`;
  }

  onSubmit(): void {
    (' onSubmit ejecutado');
    
    if (this.roomForm.invalid) {
      this.roomForm.markAllAsTouched();
      this.alertService.error('Por favor completa todos los campos obligatorios.');
      return;
    }

    this.isLoading.set(true);

    if (this.isEditMode() && this.roomId) {
      // Modo edición
      
      this.roomService.updateRoom(
        this.roomId, 
        this.roomForm.value, 
        this.selectedFiles,
        this.reemplazarFotos()
      ).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.alertService.success('Habitación actualizada exitosamente');
          this.router.navigate(['/admin/habitaciones']);
        },
        error: (err: any) => {
          console.error('Error actualizando:', err);
          this.isLoading.set(false);
          this.alertService.error('Hubo un problema al actualizar la habitación.');
        }
      });
    } else {
      
      this.roomService.createRoom(this.roomForm.value, this.selectedFiles).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.alertService.success('Habitación creada exitosamente');
          this.router.navigate(['/admin/habitaciones']);
        },
        error: (err: any) => {
          console.error('Error creando:', err);
          this.isLoading.set(false);
          this.alertService.error('Hubo un problema al crear la habitación.');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/habitaciones']);
  }
}