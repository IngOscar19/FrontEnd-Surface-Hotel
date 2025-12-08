import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  iconName: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', iconName: 'dashboard', route: '/admin/dashboard' },
    { label: 'Habitaciones', iconName: 'bed', route: '/admin/habitaciones' },
    { label: 'Reservas', iconName: 'receipt', route: '/admin/reservas' },
    { label: 'Calendario', iconName: 'calendar', route: '/admin/calendario' },
    { label: 'Configuracion', iconName: 'cog', route: '/admin/configuracion' },
  ];
}