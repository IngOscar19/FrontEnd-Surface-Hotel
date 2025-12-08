import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { AlertService } from '../../../core/services/alert.service';
import { Temporada } from '../../../core/interface/settings.interface';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [DatePipe], 
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);
  
  
  temporadas = signal<Temporada[]>([]);
  isLoading = signal<boolean>(false);

  
  infoForm: FormGroup = this.fb.group({
    name: ['Hotel San Miguel', Validators.required],
    address: ['Calle Principal 123', Validators.required],
    phone: ['+52 415 123 4567', Validators.required],
  });

  
  temporadaForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
    factorMultiplicador: [1.2, [Validators.required, Validators.min(0.1)]],
    activo: [true]
  });

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading.set(true);
    
    
    this.settingsService.getDashboardData().subscribe({
      next: ({ temporadas }) => {
       
        
       
        const temporadasActivas = temporadas.filter(t => t.activo === true);
        this.temporadas.set(temporadasActivas);
        
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.isLoading.set(false);
        
        let mensajeError = 'Error al cargar los datos.';
        if (err.status === 0) {
          mensajeError = 'No se puede conectar con el servidor. Verifica el backend.';
        } else if (err.status === 401) {
          mensajeError = 'Sesión expirada. Inicia sesión nuevamente.';
        } else if (err.error?.mensaje) {
          mensajeError = err.error.mensaje;
        }
        
        this.alertService.error(mensajeError);
      }
    });
  }

 
  saveInfo() {
    if (this.infoForm.valid) {
      
      this.alertService.success('Información del hotel guardada correctamente');
    } else {
      this.alertService.warning('Por favor verifica la información del hotel');
    }
  }

  
  guardarTemporada() {
    if (this.temporadaForm.invalid) {
      this.alertService.warning('Por favor completa todos los campos requeridos correctamente');
      return;
    }

    const formValue = this.temporadaForm.value;
    this.isLoading.set(true);
    
    this.settingsService.createTemporada(formValue).subscribe({
      next: (result) => {
        this.isLoading.set(false);
        this.closeModal('modal_temporada');
        
        this.temporadaForm.reset({ 
          factorMultiplicador: 1.2, 
          activo: true, 
          descripcion: ''
        });
        
        this.alertService.success('Nueva temporada creada exitosamente');
        
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al crear temporada:', err);
        this.isLoading.set(false);
        
        let mensaje = 'Error al crear la temporada';
        if (err.error?.mensaje) {
          mensaje = err.error.mensaje;
        } else if (err.error?.errors) {
          mensaje = 'Errores de validación en los datos enviados';
        }
        
        this.alertService.error(mensaje);
      }
    });
  }

  
  openModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    } else {
      console.error('Modal no encontrado:', id);
    }
  }

  closeModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }

  
  getBadgeClass(factor: number): string {
    if (factor > 1) return 'badge-error bg-red-100 text-red-600';
    if (factor < 1) return 'badge-success bg-green-100 text-green-700';
    return 'badge-ghost';
  }
  
  getFactorLabel(factor: number): string {
    if (factor === 1) return 'Precio base';
    const porcentaje = Math.round((factor - 1) * 100);
    return porcentaje > 0 ? `+${porcentaje}%` : `${porcentaje}%`;
  }
}