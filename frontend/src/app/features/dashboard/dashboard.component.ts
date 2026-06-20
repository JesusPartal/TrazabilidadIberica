import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <header>
        <h1>Trazabilidad Ibérica</h1>
        <button class="logout" (click)="auth.logout()">Cerrar sesión</button>
      </header>

      <div class="welcome">
        <p>Bienvenido, <strong>{{ auth.email() }}</strong></p>
      </div>

      <nav class="grid">
        <a routerLink="/animals" class="card">
          <h2>Animales</h2>
          <p>Gestión de crotales y animales</p>
        </a>
        <a routerLink="/farms" class="card">
          <h2>Fincas</h2>
          <p>Explotaciones y fincas</p>
        </a>
        <a routerLink="/lotes" class="card">
          <h2>Lotes</h2>
          <p>Agrupaciones de animales</p>
        </a>
        <a routerLink="/movements" class="card">
          <h2>Movimientos</h2>
          <p>Entradas y salidas</p>
        </a>
        <a routerLink="/ganaderos" class="card">
          <h2>Ganaderos</h2>
          <p>Titulares de explotaciones</p>
        </a>
        <a routerLink="/veterinarios" class="card">
          <h2>Veterinarios</h2>
          <p>Profesionales veterinarios</p>
        </a>
        <a routerLink="/bajas" class="card">
          <h2>Bajas</h2>
          <p>Registro de bajas de animales</p>
        </a>
        <a routerLink="/campanias" class="card">
          <h2>Campañas</h2>
          <p>Campañas de montanera</p>
        </a>
        <a routerLink="/tratamientos" class="card">
          <h2>Tratamientos</h2>
          <p>Tratamientos veterinarios</p>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #2563eb; color: white; }
    h1 { font-size: 1.25rem; }
    .logout { background: transparent; color: white; border: 1px solid white; padding: 0.25rem 0.75rem; border-radius: 4px; cursor: pointer; font-size: 0.875rem; }
    .welcome { padding: 2rem; font-size: 1.125rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; padding: 0 2rem 2rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-decoration: none; color: inherit; transition: box-shadow 0.2s; }
    .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    h2 { font-size: 1.125rem; margin-bottom: 0.25rem; }
    p { font-size: 0.875rem; color: #666; }
  `],
})
export class DashboardComponent {
  auth = inject(AuthService);
}
