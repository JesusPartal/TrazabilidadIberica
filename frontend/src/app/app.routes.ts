import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then((c) => c.RegisterComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then((c) => c.DashboardComponent),
  },
  {
    path: 'farms',
    canActivate: [authGuard],
    loadComponent: () => import('./features/fincas/fincas-list.component').then((c) => c.FincasListComponent),
  },
  {
    path: 'farms/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/fincas/finca-form.component').then((c) => c.FincaFormComponent),
  },
  {
    path: 'farms/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/fincas/finca-form.component').then((c) => c.FincaFormComponent),
  },
  {
    path: 'animals',
    canActivate: [authGuard],
    loadComponent: () => import('./features/animales/animales-list.component').then((c) => c.AnimalesListComponent),
  },
  {
    path: 'animals/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/animales/animal-form.component').then((c) => c.AnimalFormComponent),
  },
  {
    path: 'animals/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/animales/animal-form.component').then((c) => c.AnimalFormComponent),
  },
  {
    path: 'lotes',
    canActivate: [authGuard],
    loadComponent: () => import('./features/lotes/lotes-list.component').then((c) => c.LotesListComponent),
  },
  {
    path: 'movements',
    canActivate: [authGuard],
    loadComponent: () => import('./features/movimientos/movimientos-list.component').then((c) => c.MovimientosListComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
