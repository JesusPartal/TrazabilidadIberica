import { ChangeDetectionStrategy, Component, OnInit, inject, signal, viewChild, ElementRef, effect, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { ApiService } from '../../core/services/api.service';
import { DbService } from '../../core/services/db.service';
import { MovimientoAnimal, TipoMovimiento } from '../../core/models/movimiento-animal';
import { EstadoAnimal } from '../../core/models/animal';

Chart.register(...registerables);

interface StatEntry {
  label: string;
  route: string;
  color: string;
  icon: string;
  count: number;
}

interface ChartSlice {
  label: string;
  count: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="dashboard">
      <header>
        <span class="brand">
          <span class="crotal" aria-hidden="true"></span>
          <h1>Trazabilidad Ibérica</h1>
        </span>
        <span class="user-badge">{{ auth.email() }}</span>
        <button class="theme-toggle" (click)="theme.toggle()" [attr.title]="theme.isDark() ? 'Modo claro' : 'Modo oscuro'">{{ theme.isDark() ? '☀️' : '🌙' }}</button>
        <button class="logout" (click)="auth.logout()">Salir</button>
      </header>

      <div class="content">
        @if (loading()) {
          <div class="loading">Cargando estadísticas...</div>
        }

        <section class="stats">
          @for (s of stats(); track s.label) {
            <a [routerLink]="s.route" class="stat-card" [style.borderLeftColor]="s.color">
              <span class="stat-icon">{{ s.icon }}</span>
              <span class="stat-count">{{ s.count }}</span>
              <span class="stat-label">{{ s.label }}</span>
            </a>
          }
        </section>

        @if (!loading()) {
          <section class="charts">
            <div class="chart-card">
              <h2>Animales por estado</h2>
              <div class="chart-wrap"><canvas #animalChart></canvas></div>
            </div>
            <div class="chart-card">
              <h2>Movimientos por tipo</h2>
              <div class="chart-wrap"><canvas #movementChart></canvas></div>
            </div>
          </section>
        }

        @if (!loading() && recentMovements().length > 0) {
          <section class="recent">
            <h2>Últimos movimientos</h2>
            <div class="movement-list">
              @for (m of recentMovements(); track m.id) {
                <div class="movement-row">
                  <span class="movement-type" [class.badge-green]="m.tipoMovimiento === 0" [class.badge-red]="m.tipoMovimiento === 1" [class.badge-blue]="m.tipoMovimiento >= 2">
                    {{ tipoLabels[m.tipoMovimiento] }}
                  </span>
                  <span class="movement-detail">{{ m.animal?.numeroCrotal ?? m.animalId }}</span>
                  <span class="movement-date">{{ m.fechaMovimiento | date:'dd/MM/yyyy' }}</span>
                </div>
              }
            </div>
          </section>
        }

        <nav class="grid">
          <a routerLink="/animals" class="card"><h3>Animales</h3><p>Gestión de crotales y animales</p></a>
          <a routerLink="/farms" class="card"><h3>Fincas</h3><p>Explotaciones y fincas</p></a>
          <a routerLink="/lotes" class="card"><h3>Lotes</h3><p>Agrupaciones de animales</p></a>
          <a routerLink="/movements" class="card"><h3>Movimientos</h3><p>Entradas y salidas</p></a>
          <a routerLink="/ganaderos" class="card"><h3>Ganaderos</h3><p>Titulares de explotaciones</p></a>
          <a routerLink="/veterinarios" class="card"><h3>Veterinarios</h3><p>Profesionales veterinarios</p></a>
          <a routerLink="/bajas" class="card"><h3>Bajas</h3><p>Registro de bajas de animales</p></a>
          <a routerLink="/campanias" class="card"><h3>Campañas</h3><p>Campañas de montanera</p></a>
          <a routerLink="/tratamientos" class="card"><h3>Tratamientos</h3><p>Tratamientos veterinarios</p></a>
          <a routerLink="/activity-log" class="card"><h3>Actividad</h3><p>Registro de operaciones</p></a>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { min-height: 100vh; background: var(--color-bg); }
    header { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.5rem; background: var(--color-primary); color: #fff; }
    .brand { display: flex; align-items: center; gap: 0.6rem; margin-right: auto; }
    .crotal {
      display: inline-block; width: 20px; height: 26px; border-radius: 4px;
      background: linear-gradient(135deg, var(--color-straw-light), var(--color-straw));
      border: 1px solid rgba(0,0,0,0.15);
      position: relative; flex-shrink: 0;
    }
    .crotal::after {
      content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 8px; height: 8px; border-radius: 50%;
      background: radial-gradient(circle, var(--color-earth-dark) 30%, transparent 70%);
    }
    h1 { font-family: var(--font-display); font-weight: 400; font-size: 1.25rem; letter-spacing: 0.01em; }
    .user-badge { font-size: 0.8rem; opacity: 0.75; font-family: var(--font-body); }
    .logout { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.35); padding: 0.25rem 0.75rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-family: var(--font-body); }
    .logout:hover { background: rgba(255,255,255,0.1); }
    .theme-toggle { background: transparent; color: #fff; border: none; padding: 0.25rem; cursor: pointer; font-size: 1.1rem; line-height: 1; opacity: 0.7; transition: opacity 0.15s; }
    .theme-toggle:hover { opacity: 1; }
    .content { max-width: 1100px; margin: 0 auto; padding: 0 1rem; }
    .loading { text-align: center; padding: 2rem; color: var(--color-text-muted); }

    .stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 0.75rem; padding: 1.5rem 0; }
    .stat-card { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; background: var(--color-surface); padding: 0.85rem 0.5rem; border-radius: 10px; border-left: 4px solid var(--color-primary); box-shadow: 0 1px 3px rgba(0,0,0,0.07); text-decoration: none; color: inherit; transition: transform 0.15s, box-shadow 0.15s; }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .stat-icon { font-size: 1.4rem; }
    .stat-count { font-size: 1.4rem; font-weight: 700; color: var(--color-text); font-family: var(--font-display); }
    .stat-label { font-size: 0.65rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; text-align: center; font-weight: 500; }

    .charts { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
    .chart-card { background: var(--color-surface); border-radius: 10px; padding: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.07); }
    .chart-card h2 { font-size: 0.9rem; margin: 0 0 0.5rem; color: var(--color-text); font-family: var(--font-display); font-weight: 400; }
    .chart-wrap { position: relative; height: 200px; }
    .chart-wrap canvas { width: 100% !important; height: 100% !important; }

    .recent { background: var(--color-surface); border-radius: 10px; padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.07); }
    .recent h2 { font-size: 0.95rem; margin: 0 0 0.75rem; color: var(--color-text); font-family: var(--font-display); font-weight: 400; }
    .movement-list { display: flex; flex-direction: column; }
    .movement-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid var(--color-leather-dark); font-size: 0.85rem; }
    .movement-row:last-child { border-bottom: none; }
    .movement-type { padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; white-space: nowrap; }
    .badge-green { background: #E6F0E8; color: var(--color-holm-oak); }
    .badge-red { background: #F5E6E0; color: var(--color-terracotta); }
    .badge-blue { background: var(--color-straw-light); color: var(--color-earth-dark); }
    .movement-detail { flex: 1; color: var(--color-text); }
    .movement-date { color: var(--color-text-muted); font-size: 0.8rem; }

    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; padding-bottom: 2rem; }
    .card { background: var(--color-surface); padding: 1.1rem; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.07); text-decoration: none; color: inherit; transition: box-shadow 0.2s; }
    .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
    .card h3 { font-size: 0.95rem; margin: 0 0 0.15rem; font-family: var(--font-display); font-weight: 400; }
    .card p { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }

    @media (max-width: 640px) {
      .stats { grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
      .stat-card { padding: 0.6rem 0.3rem; }
      .stat-icon { font-size: 1.1rem; }
      .stat-count { font-size: 1.1rem; }
      .charts { grid-template-columns: 1fr; }
      .grid { grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
      .card { padding: 0.9rem; }
      .card h3 { font-size: 0.85rem; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  private api = inject(ApiService);
  private db = inject(DbService);
  private destroyRef = inject(DestroyRef);

  stats = signal<StatEntry[]>([]);
  recentMovements = signal<MovimientoAnimal[]>([]);
  loading = signal(true);

  animalSlices = signal<ChartSlice[]>([]);
  movementSlices = signal<ChartSlice[]>([]);

  readonly animalChart = viewChild<ElementRef<HTMLCanvasElement>>('animalChart');
  readonly movementChart = viewChild<ElementRef<HTMLCanvasElement>>('movementChart');

  private animalChartInstance: Chart | null = null;
  private movementChartInstance: Chart | null = null;

  readonly tipoLabels = ['Entrada', 'Salida', 'Traslado int.', 'Traslado ext.'];

  constructor() {
    effect(() => {
      const slices = this.animalSlices();
      const canvas = this.animalChart();
      if (slices.length && canvas?.nativeElement) {
        this.animalChartInstance?.destroy();
        this.animalChartInstance = new Chart(canvas.nativeElement, {
          type: 'doughnut',
          data: {
            labels: slices.map(s => s.label),
            datasets: [{
              data: slices.map(s => s.count),
              backgroundColor: slices.map(s => s.color),
              borderWidth: 0,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12, font: { size: 11, family: "'Inter', sans-serif" } } },
            },
          },
        });
      }
    });

    effect(() => {
      const slices = this.movementSlices();
      const canvas = this.movementChart();
      if (slices.length && canvas?.nativeElement) {
        this.movementChartInstance?.destroy();
        this.movementChartInstance = new Chart(canvas.nativeElement, {
          type: 'bar',
          data: {
            labels: slices.map(s => s.label),
            datasets: [{
              data: slices.map(s => s.count),
              backgroundColor: slices.map(s => s.color),
              borderRadius: 4,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11, family: "'Inter', sans-serif" } } },
              x: { ticks: { font: { size: 11, family: "'Inter', sans-serif" } } },
            },
          },
        });
      }
    });

    this.destroyRef.onDestroy(() => {
      this.animalChartInstance?.destroy();
      this.movementChartInstance?.destroy();
    });
  }

  async ngOnInit() {
    await Promise.all([this.loadStats(), this.loadRecentMovements(), this.loadCharts()]);
    this.loading.set(false);
  }

  private async loadStats() {
    const configs = [
      { label: 'Animales', route: '/animals', color: '#8B6F47', icon: '🐖', api: () => this.api.getAnimals(1, 1), db: () => this.db.animales.count() },
      { label: 'Fincas', route: '/farms', color: '#2D5A3A', icon: '🏘', api: () => this.api.getFincas(undefined, 1, 1), db: () => this.db.fincas.count() },
      { label: 'Lotes', route: '/lotes', color: '#D4A96A', icon: '📦', api: () => this.api.getLotes(undefined, 1, 1), db: () => this.db.lotes.count() },
      { label: 'Ganaderos', route: '/ganaderos', color: '#6B5B4E', icon: '👤', api: () => this.api.getGanaderos(1, 1), db: () => this.db.ganaderos.count() },
      { label: 'Veterinarios', route: '/veterinarios', color: '#A88B61', icon: '⚕', api: () => this.api.getVeterinarios(1, 1), db: () => this.db.veterinarios.count() },
      { label: 'Movimientos', route: '/movements', color: '#B85C3A', icon: '🔄', api: () => this.api.getMovimientos(undefined, undefined, 1, 1), db: () => this.db.movimientosAnimal.count() },
      { label: 'Bajas', route: '/bajas', color: '#5A4E42', icon: '📋', api: () => this.api.getBajas(1, 1), db: () => this.db.bajas.count() },
      { label: 'Campañas', route: '/campanias', color: '#4A7D5C', icon: '🌿', api: () => this.api.getCampanias(1, 1), db: () => this.db.campaniasMontanera.count() },
      { label: 'Tratamientos', route: '/tratamientos', color: '#D4A96A', icon: '💊', api: () => this.api.getTratamientos(1, 1), db: () => this.db.tratamientosVeterinarios.count() },
    ];

    const entries = await Promise.all(
      configs.map(async (c) => {
        try {
          const r = await firstValueFrom(c.api() as any) as any;
          return { ...c, count: r.totalCount } as StatEntry;
        } catch {
          const count = await c.db();
          return { label: c.label, route: c.route, color: c.color, icon: c.icon, count };
        }
      })
    );
    this.stats.set(entries);
  }

  private async loadRecentMovements() {
    try {
      const r = await firstValueFrom(this.api.getMovimientos(undefined, undefined, 1, 5));
      this.recentMovements.set(r.items);
    } catch {
      const all = await this.db.movimientosAnimal.toArray();
      const items = all
        .filter(i => !i.deletedAt)
        .sort((a, b) => b.fechaMovimiento.localeCompare(a.fechaMovimiento))
        .slice(0, 5);
      this.recentMovements.set(items);
    }
  }

  private async loadCharts() {
    const [animalResult, movementResult] = await Promise.all([
      this.loadAnimalsForChart(),
      this.loadMovementsForChart(),
    ]);
    this.animalSlices.set(animalResult);
    this.movementSlices.set(movementResult);
  }

  private async loadAnimalsForChart(): Promise<ChartSlice[]> {
    const colors = ['#2D5A3A', '#D4A96A', '#B85C3A', '#6B5B4E', '#8A7A6D'];
    const labels = ['Activo', 'Vendido', 'Muerto', 'Perdido', 'Sacrificado'];

    try {
      const r = await firstValueFrom(this.api.getAnimals(1, 500));
      const counts = [0, 0, 0, 0, 0];
      for (const a of r.items) {
        if (a.estado >= 0 && a.estado <= 4) counts[a.estado]++;
      }
      return counts.map((c, i) => ({ label: labels[i], count: c, color: colors[i] })).filter(s => s.count > 0);
    } catch {
      const all = await this.db.animales.toArray();
      const active = all.filter(a => !a.deletedAt);
      const counts = [0, 0, 0, 0, 0];
      for (const a of active) {
        if (a.estado >= 0 && a.estado <= 4) counts[a.estado]++;
      }
      return counts.map((c, i) => ({ label: labels[i], count: c, color: colors[i] })).filter(s => s.count > 0);
    }
  }

  private async loadMovementsForChart(): Promise<ChartSlice[]> {
    const colors = ['#2D5A3A', '#B85C3A', '#D4A96A', '#8A7A6D'];
    const labels = ['Entrada', 'Salida', 'Traslado int.', 'Traslado ext.'];

    try {
      const r = await firstValueFrom(this.api.getMovimientos(undefined, undefined, 1, 500));
      const counts = [0, 0, 0, 0];
      for (const m of r.items) {
        if (m.tipoMovimiento >= 0 && m.tipoMovimiento <= 3) counts[m.tipoMovimiento]++;
      }
      return counts.map((c, i) => ({ label: labels[i], count: c, color: colors[i] })).filter(s => s.count > 0);
    } catch {
      const all = await this.db.movimientosAnimal.toArray();
      const active = all.filter(m => !m.deletedAt);
      const counts = [0, 0, 0, 0];
      for (const m of active) {
        if (m.tipoMovimiento >= 0 && m.tipoMovimiento <= 3) counts[m.tipoMovimiento]++;
      }
      return counts.map((c, i) => ({ label: labels[i], count: c, color: colors[i] })).filter(s => s.count > 0);
    }
  }
}
