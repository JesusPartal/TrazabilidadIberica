import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import { ActivityLogService } from '../../core/services/activity-log.service';
import type { Finca } from '../../core/models/finca';
import { exportCsv } from '../../shared/utils/csv-export';

@Component({
  selector: 'app-fincas-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="page">
      <header>
        <a routerLink="/" class="back">←</a>
        <h1>Fincas</h1>
        <a routerLink="/farms/new" class="btn-primary">➕ Nueva</a>
        <button class="btn-outline" (click)="exportCsv()">📥 CSV</button>
      </header>

      <div class="filters">
        <input #q type="text" placeholder="Buscar por nombre o REGA..." (input)="searchQuery.set(q.value)" class="search-input" />
        <select #p (change)="provinciaFilter.set(p.value || null)">
          <option value="">Todas las provincias</option>
          @for (prov of provincias(); track prov) {
            <option [value]="prov">{{ prov }}</option>
          }
        </select>
      </div>

      @if (!online()) {
        <div class="offline-banner">⚠️ Sin conexión — mostrando datos guardados</div>
      }

      @if (loading()) {
        <div class="loading">Cargando...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else if (fincas().length === 0) {
        <div class="empty">
          <p>No hay fincas registradas</p>
          <a routerLink="/farms/new" class="btn-primary">Crear primera finca</a>
        </div>
      } @else if (filteredItems().length === 0) {
        <div class="empty">
          <p>Ninguna finca coincide con los filtros</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>REGA</th>
                <th>Municipio</th>
                <th>Provincia</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (f of filteredItems(); track f.id) {
                <tr>
                  <td>{{ f.nombre }}</td>
                  <td>{{ f.rega }}</td>
                  <td>{{ f.municipio ?? '—' }}</td>
                  <td>{{ f.provincia ?? '—' }}</td>
                  <td class="actions">
                    <a [routerLink]="['/farms', f.id, 'edit']" class="btn-sm">✎</a>
                    <button class="btn-sm danger" (click)="deleteFinca(f.id)">✕</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (totalPages() > 1) {
          <div class="pagination">
            <button [disabled]="page() <= 1" (click)="goTo(page() - 1)">←</button>
            <span>Página {{ page() }} de {{ totalPages() }}</span>
            <button [disabled]="page() >= totalPages()" (click)="goTo(page() + 1)">→</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page { max-width: 960px; margin: 0 auto; padding: 1rem; }
    header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
    header h1 { flex: 1; font-size: 1.25rem; }
    .back { text-decoration: none; color: #2563eb; font-size: 1.25rem; }
    .btn-primary { background: #2563eb; color: white; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-size: 0.875rem; border: none; cursor: pointer; }
    .btn-outline { background: transparent; color: #2563eb; border: 1px solid #2563eb; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; cursor: pointer; white-space: nowrap; }
    .btn-outline:hover { background: #eff6ff; }
    .btn-sm { background: none; border: 1px solid #ccc; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 0.8rem; }
    .btn-sm.danger { color: #dc2626; border-color: #dc2626; }
    .loading, .error, .empty { text-align: center; padding: 3rem; color: #666; }
    .error { color: #dc2626; }
    .empty { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #eee; font-size: 0.875rem; }
    th { font-weight: 600; color: #666; font-size: 0.75rem; text-transform: uppercase; }
    td.actions { white-space: nowrap; display: flex; gap: 0.25rem; }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
    .pagination button { background: none; border: 1px solid #ccc; border-radius: 4px; padding: 0.25rem 0.75rem; cursor: pointer; }
    .pagination button:disabled { opacity: 0.4; cursor: default; }
    .filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .search-input { flex: 1; min-width: 160px; padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.875rem; }
    .filters select { padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.875rem; background: white; }
    .offline-banner { background: #fef3c7; color: #92400e; padding: 0.5rem 1rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }
    @media (max-width: 640px) {
      header { flex-wrap: wrap; }
      .btn-primary, .btn-outline { flex: 1; text-align: center; }
      .filters { flex-direction: column; }
      .filters select { width: 100%; }
    }
  `],
})
export class FincasListComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private offline = inject(OfflineDataService);
  private log = inject(ActivityLogService);

  fincas = signal<Finca[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  page = signal(1);
  totalPages = signal(1);

  online = signal(true);
  searchQuery = signal('');
  provinciaFilter = signal<string | null>(null);

  filteredItems = computed(() => {
    let items = this.fincas();
    const q = this.searchQuery().toLowerCase();
    if (q) items = items.filter(f => f.nombre.toLowerCase().includes(q) || f.rega.toLowerCase().includes(q));
    if (this.provinciaFilter()) items = items.filter(f => f.provincia === this.provinciaFilter());
    return items;
  });

  provincias = computed(() => [...new Set(this.fincas().map(f => f.provincia).filter(Boolean) as string[])]);

  ngOnInit() {
    this.loadFincas();
  }

  private async loadFincas() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { items, totalPages, online } = await this.offline.getAll('fincas', this.api.getFincas(this.auth.ganaderoId() ?? undefined, this.page()));
      this.fincas.set(items);
      this.totalPages.set(totalPages);
      this.online.set(online);
    } catch {
      this.error.set('Error al cargar fincas');
    }
    this.loading.set(false);
  }

  goTo(p: number) {
    this.page.set(p);
    this.loadFincas();
  }

  exportCsv() {
    exportCsv('fincas.csv', [
      { label: 'Nombre', value: f => f.nombre },
      { label: 'REGA', value: f => f.rega },
      { label: 'Dirección', value: f => f.direccion ?? '' },
      { label: 'Municipio', value: f => f.municipio ?? '' },
      { label: 'Provincia', value: f => f.provincia ?? '' },
      { label: 'CP', value: f => f.codigoPostal ?? '' },
    ], this.filteredItems());
  }

  async deleteFinca(id: string) {
    if (!confirm('¿Eliminar esta finca?')) return;
    const f = this.fincas().find(x => x.id === id);
    await this.offline.remove('fincas', 'finca', id, this.api.deleteFinca(id));
    await this.log.log('Finca', id, 'Baja', f ? `Nombre: ${f.nombre}` : null);
    this.loadFincas();
  }
}
