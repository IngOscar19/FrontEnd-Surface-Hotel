import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      
      // Dashboard
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/dashboard/dashboard.component')
          .then(m => m.DashboardPageComponent) 
      },

      // Habitaciones - Lista
      { 
        path: 'habitaciones', 
        loadComponent: () => import('./pages/rooms-list/rooms-list.component')
          .then(m => m.RoomsListComponent) 
      },

      // Habitaciones - Detalle (NUEVO)
      { 
        path: 'habitaciones/:id', 
        loadComponent: () => import('./pages/details-room/details-room')
          .then(m => m.DetailsRoomComponent) 
      },

      // Crear habitación
      { 
        path: 'crear-habitacion', 
        // Suponiendo que la clase se llama CreateRoomComponent
        loadComponent: () => import('./pages/form-room/create-room.component')
        .then(m => m.CreateRoomComponent)
      },
      { 
        // 1. La lista (Lo que abre el Sidebar)
        path: 'reservas', 
        loadComponent: () => import('./pages/reserva-list/reserva-list')
          .then(m => m.ReservaList) 
      },
      { 
        // 2. El Wizard (Crear Huésped -> Crear Reserva)
        path: 'reservas/crear', 
        loadComponent: () => import('./pages/reserva/reserva')
          .then(m => m.ReservaComponent) 
      },
      { 
        path: 'calendario', 
        // Asegúrate de que esta ruta coincida con donde creaste el archivo
        loadComponent: () => import('./pages/calendar/calendar')
          .then(m => m.Calendar) 
      },
      { 
        path: 'configuracion', 
        loadComponent: () => import('./pages/settings/settings.component')
          .then(m => m.SettingsComponent)
      }
    ]
  }
];