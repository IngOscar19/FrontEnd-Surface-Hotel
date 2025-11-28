import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { Temporada, PrecioPorTipoView, Habitacion } from '../../../core/interface/settings.interface';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // Agregamos FormsModule para inputs simples
  providers: [DatePipe, CurrencyPipe],
  templateUrl: './settings.component.html',

})
export class SettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private fb = inject(FormBuilder);
  
  // Datos
  temporadas = signal<Temporada[]>([]);
  preciosPorTipo = signal<PrecioPorTipoView[]>([]);
  todasLasHabitaciones: Habitacion[] = []; // Guardamos referencia para actualizar precios
  isLoading = signal<boolean>(false);

  // Formularios
  infoForm: FormGroup = this.fb.group({
    name: ['Hotel San Miguel', Validators.required],
    address: ['Calle Principal 123', Validators.required],
    phone: ['+52 415 123 4567', Validators.required],
  });

  temporadaForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
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
      next: ({ temporadas, tipos, habitaciones }) => {
        this.temporadas.set(temporadas);
        this.todasLasHabitaciones = habitaciones; // Guardamos las habitaciones crudas

        // Calcular vista de precios
        const listaPrecios: PrecioPorTipoView[] = tipos.map(tipo => {
          const habits = habitaciones.filter(h => h.tipoHabitacionId === tipo.id);
          const precio = habits.length > 0 ? habits[0].precioBase : 0;
          return {
            idTipo: tipo.id, // Necesitamos el ID para guardar luego
            nombreTipo: tipo.nombre,
            precioBase: precio,
            cantidadHabitaciones: habits.length
          };
        });
        this.preciosPorTipo.set(listaPrecios);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  // --- ACCIONES DE LOS BOTONES ---

  // 1. Guardar Info General
  saveInfo() {
    if (this.infoForm.valid) {
      // Aquí llamarías al servicio. Por ahora un alert.
      alert('Información guardada correctamente');
    }
  }

  // 2. Gestionar Precios (Guardar cambios del Modal)
  guardarPrecios() {
    this.isLoading.set(true);
    // Recorremos los precios modificados en la vista
    const actualizaciones = this.preciosPorTipo().map(view => 
      this.settingsService.updatePrecioPorTipo(view.idTipo!, view.precioBase, this.todasLasHabitaciones)
    );

    // Esperamos a que todas las actualizaciones terminen
    import('rxjs').then(({ forkJoin }) => {
        forkJoin(actualizaciones).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.closeModal('modal_precios');
                this.cargarDatos(); // Recargar para confirmar
                alert('Precios actualizados');
            },
            error: (err) => {
                console.error(err);
                this.isLoading.set(false);
            }
        });
    });
  }

  // 3. Crear Temporada
  guardarTemporada() {
    if (this.temporadaForm.valid) {
      this.isLoading.set(true);
      const nuevaTemp = this.temporadaForm.value;
      
      this.settingsService.createTemporada(nuevaTemp).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.closeModal('modal_temporada');
          this.temporadaForm.reset({ factorMultiplicador: 1.2, activo: true }); // Resetear form
          this.cargarDatos(); // Refrescar lista
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
    }
  }

  // --- Helpers para Modales ---
  openModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  closeModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) modal.close();
  }

  // --- Helpers Visuales (Badge de temporadas) ---
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

