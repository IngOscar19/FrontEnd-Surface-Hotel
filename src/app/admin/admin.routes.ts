import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      
     
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/dashboard/dashboard.component')
          .then(m => m.DashboardPageComponent) 
      },

     
      { 
        path: 'habitaciones', 
        loadComponent: () => import('./pages/rooms-list/rooms-list.component')
          .then(m => m.RoomsListComponent) 
      },
      { 
        path: 'habitaciones/:id', 
        loadComponent: () => import('./pages/details-room/details-room')
          .then(m => m.DetailsRoomComponent) 
      },
      { 
        path: 'crear-habitacion', 
       
        loadComponent: () => import('./pages/form-room/create-room.component')
        .then(m => m.CreateRoomComponent)
      },
      {
        path: 'editar-habitacion/:id',
        loadComponent: () => import('./pages/form-room/create-room.component')
          .then(m => m.CreateRoomComponent)
      },
      { 
       
        path: 'reservas', 
        loadComponent: () => import('./pages/reserva-list/reserva-list')
          .then(m => m.ReservaList) 
      },
      { 
       
        path: 'reservas/crear', 
        loadComponent: () => import('./pages/reserva/reserva')
          .then(m => m.ReservaComponent) 
      },
      { 
        path: 'calendario', 
        
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