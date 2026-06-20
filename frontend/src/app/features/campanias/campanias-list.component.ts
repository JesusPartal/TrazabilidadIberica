import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import type { CampaniaMontanera } from '../../core/models/campania-montanera';
import { EstadoCampania } from '../../core/models/campania-montanera';
import { exportCsv } from '../../shared/utils/csv-export';

@Component({
  selector: 'app-campanias-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page">
      <header>
        <a routerLink="/" class="back">←</a>
        <h1>Campañas Montanera</h1>
        <a routerLink="/campanias/new" class="btn-primary">➕ Nueva</a>
        <button class="btn-outline" (click)="exportCsv()">📥 CSV</button>
      </header>

      <div class="filters">
        <input #q type="text" placeholder="Buscar por finca..." (input)="searchQuery.set(q.value)" class="search-input" />
        <select #est (change)="estadoFilter.set(est.value ? +est.value : null)">
          <option value="">Todos los estados</option>
          <option value="0">Planificada</option>
          <option value="1">Activa</option>
          <option value="2">Cerrada</option>
        </select>
      </div>

      @if (!online()) {
        <div class="offline-banner">⚠️ Sin conexión — mostrando datos guardados</div>
      }

      @if (loading()) {
        <div class="loading">Cargando...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else if (items().length === 0) {
        <div class="empty">
          <p>No hay campañas registradas</p>
          <a routerLink="/campanias/new" class="btn-primary">Registrar primera campaña</a>
        </div>
      } @else if (filteredItems().length === 0) {
        <div class="empty">
          <p>Ninguna campaña coincide con los filtros</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Finca</th>
                <th>Temporada</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Has.</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (item of filteredItems(); track item.id) {
                <tr>
                  <td>{{ item.finca?.nombre ?? '—' }}</td>
                  <td>{{ item.temporada }}</td>
                  <td>{{ item.fechaInicio | date:'dd/MM/yyyy' }}</td>
                  <td>{{ (item.fechaFin | date:'dd/MM/yyyy') ?? '—' }}</td>
                  <td>{{ estadoLabel(item.estadoCampania) }}</td>
                  <td>{{ item.hectareasUtilizadas }}</td>
                  <td class="actions">
                    <a [routerLink]="['/campanias', item.id, 'edit']" class="btn-sm">✎</a>
                    <button class="btn-sm danger" (click)="deleteItem(item.id)">✕</button>
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
    .btn-sm { background: none; border: 1px solid #ccc; border-radius: 4px; padding: 0.25rem 0.5rem; cursor: pointer; font-size: 0.8rem; text-decoration: none; color: inherit; }
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
  `],
})
export class CampaniasListComponent implements OnInit {
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);

  items = signal<CampaniaMontanera[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  page = signal(1);
  totalPages = signal(1);

  online = signal(true);
  searchQuery = signal('');
  estadoFilter = signal<number | null>(null);

  filteredItems = computed(() => {
    let items = this.items();
    const q = this.searchQuery().toLowerCase();
    if (q) items = items.filter(c => (c.finca?.nombre ?? '').toLowerCase().includes(q));
    if (this.estadoFilter() != null) items = items.filter(c => c.estadoCampania === this.estadoFilter());
    return items;
  });

  ngOnInit() {
    this.loadItems();
  }

  private async loadItems() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { items, totalPages, online } = await this.offline.getAll('campaniasMontanera', this.api.getCampanias(this.page()));
      this.items.set(items);
      this.totalPages.set(totalPages);
      this.online.set(online);
    } catch {
      this.error.set('Error al cargar campañas');
    }
    this.loading.set(false);
  }

  goTo(p: number) {
    this.page.set(p);
    this.loadItems();
  }

  exportCsv() {
    exportCsv('campanias.csv', [
      { label: 'Finca', value: c => c.finca?.nombre ?? '' },
      { label: 'Temporada', value: c => c.temporada },
      { label: 'Inicio', value: c => c.fechaInicio },
      { label: 'Fin', value: c => c.fechaFin ?? '' },
      { label: 'Estado', value: c => this.estadoLabel(c.estadoCampania) },
      { label: 'Has.', value: c => c.hectareasUtilizadas },
    ], this.filteredItems());
  }

  async deleteItem(id: string) {
    if (!confirm('¿Eliminar esta campaña?')) return;
    await this.offline.remove('campaniasMontanera', 'campania', id, this.api.deleteCampania(id));
    this.loadItems();
  }

  estadoLabel(e: EstadoCampania): string {
    const map: Record<number, string> = {
      [EstadoCampania.Planificada]: 'Planificada',
      [EstadoCampania.Activa]: 'Activa',
      [EstadoCampania.Cerrada]: 'Cerrada',
    };
    return map[e] ?? '—';
  }
}
