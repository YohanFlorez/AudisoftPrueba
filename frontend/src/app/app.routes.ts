import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'estudiantes', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./features/auth/registro/registro.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'estudiantes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/estudiantes/estudiantes.component').then((m) => m.EstudiantesComponent)
  },
  {
    path: 'profesores',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profesores/profesores.component').then((m) => m.ProfesoresComponent)
  },
  {
    path: 'notas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/notas/notas.component').then((m) => m.NotasComponent)
  },
  { path: '**', redirectTo: 'estudiantes' }
];
