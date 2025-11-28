// src/app/admin/admin.routes.ts

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
        path: 'configuracion', 
        loadComponent: () => import('./pages/settings/settings.component')
          .then(m => m.SettingsComponent)
      }

      // Editar habitación (OPCIONAL)
      /* { 
        path: 'editar-habitacion/:id', 
        loadComponent: () => import('./pages/form-room/create-room.component')
          .then(m => m.default) 
      } */

      // TODO: Agregar estas rutas cuando crees los componentes:
      // { path: 'reservas', loadComponent: ... },
      // { path: 'calendario', loadComponent: ... },
      // { path: 'configuracion', loadComponent: ... }
    ]
  }
];