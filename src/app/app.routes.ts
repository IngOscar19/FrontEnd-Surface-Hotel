import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard'; 
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    
    canActivate: [publicGuard], 
    children: [
      {
        path: 'login',
        loadComponent: () => import('./Usuarios/login/login.component')
          .then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./Usuarios/register/register.component')
          .then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'admin',

    canActivate: [authGuard], 
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];