import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservacionService } from '../../services/reservacion.service';
import { ReservaResponseDto } from '../../../core/interface/reserva.interface';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
})
export class Calendar implements OnInit {
  
  private reservacionService = inject(ReservacionService);
  

  currentDate = signal(new Date()); 
  reservas = signal<ReservaResponseDto[]>([]);
  daysInMonth = signal<(Date | null)[]>([]); 
  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];


  currentMonthName = computed(() => this.monthNames[this.currentDate().getMonth()]);
  currentYear = computed(() => this.currentDate().getFullYear());

  ngOnInit() {
    this.generateCalendar();
    this.loadReservations();
  }

  loadReservations() {
    this.reservacionService.getReservations().subscribe(data => {
      this.reservas.set(data);
    });
  }

  generateCalendar() {
    const year = this.currentDate().getFullYear();
    const month = this.currentDate().getMonth();

    // Primer día del mes (0 = Domingo, 1 = Lunes, etc.)
    const firstDayIndex = new Date(year, month, 1).getDay();
    
    // Total de días en el mes
    const totalDays = new Date(year, month + 1, 0).getDate();

    const daysArray: (Date | null)[] = [];

    // Rellenar espacios vacíos antes del primer día
    for (let i = 0; i < firstDayIndex; i++) {
      daysArray.push(null);
    }

    // Rellenar los días reales
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push(new Date(year, month, i));
    }

    this.daysInMonth.set(daysArray);
  }

  changeMonth(offset: number) {
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() + offset);
    this.currentDate.set(newDate);
    this.generateCalendar();
    
  }


  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

 
  getReservationsForDate(date: Date | null): ReservaResponseDto[] {
    if (!date) return [];
    
   
    const currentDayTime = date.getTime();

    return this.reservas().filter(reserva => {
      
      
      const start = new Date(reserva.fechaEntrada); 
      const end = new Date(reserva.fechaSalida);
      
      
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999); 

      return currentDayTime >= start.getTime() && currentDayTime <= end.getTime();
    });
  }
}
