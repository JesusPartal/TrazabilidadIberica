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
    pathMatch: 'full',
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
    path: 'lotes/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/lotes/lote-form.component').then((c) => c.LoteFormComponent),
  },
  {
    path: 'lotes/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/lotes/lote-form.component').then((c) => c.LoteFormComponent),
  },
  {
    path: 'movements',
    canActivate: [authGuard],
    loadComponent: () => import('./features/movimientos/movimientos-list.component').then((c) => c.MovimientosListComponent),
  },
  {
    path: 'movements/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/movimientos/movimiento-form.component').then((c) => c.MovimientoFormComponent),
  },
  {
    path: 'movements/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/movimientos/movimiento-form.component').then((c) => c.MovimientoFormComponent),
  },
  {
    path: 'ganaderos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/ganaderos/ganaderos-list.component').then((c) => c.GanaderosListComponent),
  },
  {
    path: 'ganaderos/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/ganaderos/ganadero-form.component').then((c) => c.GanaderoFormComponent),
  },
  {
    path: 'ganaderos/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/ganaderos/ganadero-form.component').then((c) => c.GanaderoFormComponent),
  },
  {
    path: 'veterinarios',
    canActivate: [authGuard],
    loadComponent: () => import('./features/veterinarios/veterinarios-list.component').then((c) => c.VeterinariosListComponent),
  },
  {
    path: 'veterinarios/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/veterinarios/veterinario-form.component').then((c) => c.VeterinarioFormComponent),
  },
  {
    path: 'veterinarios/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/veterinarios/veterinario-form.component').then((c) => c.VeterinarioFormComponent),
  },
  {
    path: 'bajas',
    canActivate: [authGuard],
    loadComponent: () => import('./features/bajas/bajas-list.component').then((c) => c.BajasListComponent),
  },
  {
    path: 'bajas/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/bajas/baja-form.component').then((c) => c.BajaFormComponent),
  },
  {
    path: 'bajas/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/bajas/baja-form.component').then((c) => c.BajaFormComponent),
  },
  {
    path: 'campanias',
    canActivate: [authGuard],
    loadComponent: () => import('./features/campanias/campanias-list.component').then((c) => c.CampaniasListComponent),
  },
  {
    path: 'campanias/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/campanias/campania-form.component').then((c) => c.CampaniaFormComponent),
  },
  {
    path: 'campanias/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/campanias/campania-form.component').then((c) => c.CampaniaFormComponent),
  },
  {
    path: 'tratamientos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tratamientos/tratamientos-list.component').then((c) => c.TratamientosListComponent),
  },
  {
    path: 'tratamientos/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tratamientos/tratamiento-form.component').then((c) => c.TratamientoFormComponent),
  },
  {
    path: 'tratamientos/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tratamientos/tratamiento-form.component').then((c) => c.TratamientoFormComponent),
  },
  {
    path: 'activity-log',
    canActivate: [authGuard],
    loadComponent: () => import('./features/activity-log/activity-log-list.component').then((c) => c.ActivityLogListComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
