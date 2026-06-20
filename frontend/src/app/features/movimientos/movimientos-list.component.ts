import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import type { MovimientoAnimal } from '../../core/models/movimiento-animal';
import { TipoMovimiento } from '../../core/models/movimiento-animal';
import { exportCsv } from '../../shared/utils/csv-export';

@Component({
  selector: 'app-movimientos-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page">
      <header>
        <a routerLink="/" class="back">←</a>
        <h1>Movimientos</h1>
        <a routerLink="/movements/new" class="btn-primary">➕ Nuevo</a>
        <button class="btn-outline" (click)="exportCsv()">📥 CSV</button>
      </header>

      <div class="filters">
        <input #q type="text" placeholder="Buscar por crotal..." (input)="searchQuery.set(q.value)" class="search-input" />
        <select #tip (change)="tipoFilter.set(tip.value ? +tip.value : null)">
          <option value="">Todos los tipos</option>
          <option value="0">Entrada</option>
          <option value="1">Salida</option>
          <option value="2">Traslado Interno</option>
          <option value="3">Traslado Externo</option>
        </select>
      </div>

      @if (!online()) {
        <div class="offline-banner">⚠️ Sin conexión — mostrando datos guardados</div>
      }

      @if (loading()) {
        <div class="loading">Cargando...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else if (movimientos().length === 0) {
        <div class="empty">
          <p>No hay movimientos registrados</p>
        </div>
      } @else if (filteredItems().length === 0) {
        <div class="empty">
          <p>Ningún movimiento coincide con los filtros</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Animal</th>
                <th>Tipo</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Fecha</th>
                <th>Guía</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
              @for (m of filteredItems(); track m.id) {
                <tr>
                  <td>{{ m.animal?.numeroCrotal ?? '—' }}</td>
                  <td>
                    <span class="badge" [class]="tipoClass(m.tipoMovimiento)">{{ tipoLabel(m.tipoMovimiento) }}</span>
                  </td>
                  <td>{{ m.fincaOrigen?.nombre ?? '—' }}</td>
                  <td>{{ m.fincaDestino?.nombre ?? '—' }}</td>
                  <td>{{ m.fechaMovimiento | date:'dd/MM/yyyy' }}</td>
                  <td>{{ m.numeroGuia ?? '—' }}</td>
                  <td class="actions">
                    <a [routerLink]="['/movements', m.id, 'edit']" class="btn-sm">✎</a>
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
    td.actions { white-space: nowrap; display: flex; gap: 0.25rem; }
    .loading, .error, .empty { text-align: center; padding: 3rem; color: #666; }
    .error { color: #dc2626; }
    .empty { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #eee; font-size: 0.875rem; }
    th { font-weight: 600; color: #666; font-size: 0.75rem; text-transform: uppercase; }
    .badge { display: inline-block; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .badge.Entrada { background: #dcfce7; color: #166534; }
    .badge.Salida { background: #fee2e2; color: #991b1b; }
    .badge.TrasladoInterno { background: #fef3c7; color: #92400e; }
    .badge.TrasladoExterno { background: #e5e7eb; color: #374151; }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
    .pagination button { background: none; border: 1px solid #ccc; border-radius: 4px; padding: 0.25rem 0.75rem; cursor: pointer; }
    .pagination button:disabled { opacity: 0.4; cursor: default; }
    .filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .search-input { flex: 1; min-width: 160px; padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.875rem; }
    .filters select { padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.875rem; background: white; }
    .offline-banner { background: #fef3c7; color: #92400e; padding: 0.5rem 1rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }
  `],
})
export class MovimientosListComponent implements OnInit {
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);

  movimientos = signal<MovimientoAnimal[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  page = signal(1);
  totalPages = signal(1);

  online = signal(true);
  searchQuery = signal('');
  tipoFilter = signal<number | null>(null);

  filteredItems = computed(() => {
    let items = this.movimientos();
    const q = this.searchQuery().toLowerCase();
    if (q) items = items.filter(m => (m.animal?.numeroCrotal ?? '').toLowerCase().includes(q));
    if (this.tipoFilter() != null) items = items.filter(m => m.tipoMovimiento === this.tipoFilter());
    return items;
  });

  ngOnInit() {
    this.loadMovimientos();
  }

  private async loadMovimientos() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { items, totalPages, online } = await this.offline.getAll('movimientosAnimal', this.api.getMovimientos(undefined, undefined, this.page()));
      this.movimientos.set(items);
      this.totalPages.set(totalPages);
      this.online.set(online);
    } catch {
      this.error.set('Error al cargar movimientos');
    }
    this.loading.set(false);
  }

  goTo(p: number) {
    this.page.set(p);
    this.loadMovimientos();
  }

  tipoLabel(t: TipoMovimiento): string {
    const map: Record<number, string> = {
      [TipoMovimiento.Entrada]: 'Entrada',
      [TipoMovimiento.Salida]: 'Salida',
      [TipoMovimiento.TrasladoInterno]: 'Traslado Interno',
      [TipoMovimiento.TrasladoExterno]: 'Traslado Externo',
    };
    return map[t] ?? '—';
  }

  exportCsv() {
    exportCsv('movimientos.csv', [
      { label: 'Animal', value: m => m.animal?.numeroCrotal ?? '' },
      { label: 'Tipo', value: m => this.tipoLabel(m.tipoMovimiento) },
      { label: 'Origen', value: m => m.fincaOrigen?.nombre ?? '' },
      { label: 'Destino', value: m => m.fincaDestino?.nombre ?? '' },
      { label: 'Fecha', value: m => m.fechaMovimiento },
      { label: 'Guía', value: m => m.numeroGuia ?? '' },
    ], this.filteredItems());
  }

  tipoClass(t: TipoMovimiento): string {
    const map: Record<number, string> = {
      [TipoMovimiento.Entrada]: 'Entrada',
      [TipoMovimiento.Salida]: 'Salida',
      [TipoMovimiento.TrasladoInterno]: 'TrasladoInterno',
      [TipoMovimiento.TrasladoExterno]: 'TrasladoExterno',
    };
    return map[t] ?? '';
  }
}
