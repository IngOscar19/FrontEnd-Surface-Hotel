import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { Temporada, PrecioPorTipoView, Habitacion, TipoHabitacion } from '../../../core/interface/settings.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [DatePipe, CurrencyPipe],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private fb = inject(FormBuilder);
  
  // Datos
  temporadas = signal<Temporada[]>([]);
  preciosPorTipo = signal<PrecioPorTipoView[]>([]);
  todasLasHabitaciones: Habitacion[] = [];
  todosTipos: TipoHabitacion[] = [];
  isLoading = signal<boolean>(false);

  // Formularios
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
      next: ({ temporadas, tipos }) => {
        console.log('📊 Datos recibidos del backend:');
        console.log('  ➤ Temporadas:', temporadas);
        console.log('  ➤ Tipos:', tipos);
        
        // Guardar datos completos
        this.todosTipos = tipos;
        
        // Filtrar solo temporadas activas
        const temporadasActivas = temporadas.filter(t => t.activo === true);
        console.log('✅ Temporadas activas:', temporadasActivas);
        this.temporadas.set(temporadasActivas);

        // Para calcular precios, necesitamos habitaciones
        // Cargar habitaciones por separado solo para calcular precios
        this.cargarPreciosPorTipo();
        
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error al cargar datos:', err);
        this.isLoading.set(false);
        
        let mensajeError = 'Error al cargar los datos.';
        if (err.status === 0) {
          mensajeError = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:5053';
        } else if (err.status === 401) {
          mensajeError = 'No estás autenticado. Inicia sesión nuevamente.';
        } else if (err.error?.mensaje) {
          mensajeError = err.error.mensaje;
        }
        
        alert(mensajeError);
      }
    });
  }

  cargarPreciosPorTipo() {
    // Cargar habitaciones solo para calcular precios
    this.settingsService.getHabitaciones().subscribe({
      next: (habitaciones: Habitacion[]) => {
        console.log('  ➤ Habitaciones:', habitaciones);
        this.todasLasHabitaciones = habitaciones;

        // Calcular precios por tipo
        const listaPrecios: PrecioPorTipoView[] = [];
        
        this.todosTipos.forEach(tipo => {
          // Filtrar habitaciones de este tipo
          const habitacionesDelTipo = habitaciones.filter((h: Habitacion) => h.tipoHabitacionId === tipo.id);

          console.log(`  🏨 Tipo "${tipo.nombre}":`, {
            cantidadHabitaciones: habitacionesDelTipo.length,
            habitaciones: habitacionesDelTipo
          });
          
          if (habitacionesDelTipo.length > 0) {
            // Calcular precio promedio
            const sumaPrecios = habitacionesDelTipo.reduce((sum: number, h: Habitacion) => sum + h.precioBase, 0);
            const precioPromedio = sumaPrecios / habitacionesDelTipo.length;
            
            listaPrecios.push({
              idTipo: tipo.id,
              nombreTipo: tipo.nombre,
              precioBase: Math.round(precioPromedio * 100) / 100,
              cantidadHabitaciones: habitacionesDelTipo.length
            });
          } else {
            // Si no hay habitaciones, mostrar con precio 0
            listaPrecios.push({
              idTipo: tipo.id,
              nombreTipo: tipo.nombre,
              precioBase: 0,
              cantidadHabitaciones: 0
            });
          }
        });
        
        console.log('💰 Precios calculados por tipo:', listaPrecios);
        this.preciosPorTipo.set(listaPrecios);
      },
      error: (err) => {
        console.warn('⚠️ No se pudieron cargar habitaciones:', err);
        // Mostrar tipos sin precios
        const listaPrecios: PrecioPorTipoView[] = this.todosTipos.map(tipo => ({
          idTipo: tipo.id,
          nombreTipo: tipo.nombre,
          precioBase: 0,
          cantidadHabitaciones: 0
        }));
        this.preciosPorTipo.set(listaPrecios);
      }
    });
  }

  // Guardar Info General
  saveInfo() {
    if (this.infoForm.valid) {
      console.log('💾 Guardando información general:', this.infoForm.value);
      // TODO: Implementar endpoint para guardar configuración general
      alert('Información guardada correctamente');
    }
  }

  // Gestionar Precios
  guardarPrecios() {
    const preciosActuales = this.preciosPorTipo();
    
    if (preciosActuales.length === 0) {
      alert('No hay precios para actualizar');
      return;
    }

    console.log('💰 Actualizando precios:', preciosActuales);
    this.isLoading.set(true);
    
    const actualizaciones = preciosActuales
      .filter(view => view.idTipo !== undefined && view.cantidadHabitaciones > 0)
      .map(view => {
        console.log(`  ➤ Actualizando tipo ${view.nombreTipo} (ID: ${view.idTipo}) a $${view.precioBase}`);
        return this.settingsService.updatePrecioPorTipo(
          view.idTipo!, 
          view.precioBase, 
          this.todasLasHabitaciones
        );
      });

    if (actualizaciones.length === 0) {
      this.isLoading.set(false);
      alert('No hay habitaciones para actualizar');
      return;
    }

    forkJoin(actualizaciones).subscribe({
      next: (resultados) => {
        console.log('✅ Precios actualizados:', resultados);
        this.isLoading.set(false);
        this.closeModal('modal_precios');
        alert('Precios actualizados correctamente');
        this.cargarDatos(); // Recargar datos
      },
      error: (err) => {
        console.error('❌ Error al actualizar precios:', err);
        this.isLoading.set(false);
        alert('Error al actualizar precios: ' + (err.error?.mensaje || err.message));
      }
    });
  }

  // Crear Temporada
  guardarTemporada() {
    if (this.temporadaForm.invalid) {
      alert('Por favor completa todos los campos requeridos');
      Object.keys(this.temporadaForm.controls).forEach(key => {
        const control = this.temporadaForm.get(key);
        if (control?.invalid) {
          console.log(`❌ Campo inválido: ${key}`, control.errors);
        }
      });
      return;
    }

    const formValue = this.temporadaForm.value;
    console.log('🗓️ Creando temporada:', formValue);
    
    this.isLoading.set(true);
    
    this.settingsService.createTemporada(formValue).subscribe({
      next: (result) => {
        console.log('✅ Temporada creada:', result);
        this.isLoading.set(false);
        this.closeModal('modal_temporada');
        this.temporadaForm.reset({ 
          factorMultiplicador: 1.2, 
          activo: true,
          descripcion: ''
        });
        alert('Temporada creada correctamente');
        this.cargarDatos();
      },
      error: (err) => {
        console.error('❌ Error al crear temporada:', err);
        this.isLoading.set(false);
        
        let mensaje = 'Error al crear la temporada';
        if (err.error?.mensaje) {
          mensaje = err.error.mensaje;
        } else if (err.error?.errors) {
          mensaje = 'Errores de validación: ' + JSON.stringify(err.error.errors);
        }
        
        alert(mensaje);
      }
    });
  }

  // Helpers para Modales
  openModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    } else {
      console.error('❌ Modal no encontrado:', id);
    }
  }

  closeModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }

  // Helpers Visuales
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