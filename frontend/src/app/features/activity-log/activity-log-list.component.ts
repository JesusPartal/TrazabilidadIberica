import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ActivityLogService } from '../../core/services/activity-log.service';
import { exportCsv } from '../../shared/utils/csv-export';
import type { ActivityLogRecord } from '../../core/models/activity-log';

@Component({
  selector: 'app-activity-log-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page">
      <header>
        <a routerLink="/" class="back">←</a>
        <h1>Registro de Actividad</h1>
        <button class="btn-outline" (click)="exportCsv()">📥 CSV</button>
        <button class="btn-outline danger" (click)="clearLog()">🗑 Limpiar</button>
      </header>

      <div class="filters">
        <input #q type="text" placeholder="Buscar por entidad o detalle..." (input)="searchQuery.set(q.value)" class="search-input" />
        <select #act (change)="actionFilter.set(act.value || null)">
          <option value="">Todas las acciones</option>
          <option value="Creación">Creación</option>
          <option value="Modificación">Modificación</option>
          <option value="Baja">Baja</option>
        </select>
      </div>

      @if (loading()) {
        <div class="loading">Cargando...</div>
      } @else if (filteredItems().length === 0) {
        <div class="empty">
          <p>{{ items().length === 0 ? 'No hay actividad registrada' : 'Ningún registro coincide con los filtros' }}</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Acción</th>
                <th>Entidad</th>
                <th>Detalle</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              @for (r of filteredItems(); track r.id) {
                <tr>
                  <td class="date">{{ r.performedAt | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td><span class="badge" [class]="badgeClass(r.action)">{{ r.action }}</span></td>
                  <td>{{ r.entityName }}</td>
                  <td class="detail">{{ r.details }}</td>
                  <td class="user">{{ r.performedBy }}</td>
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
    header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
    header h1 { flex: 1; font-size: 1.25rem; }
    .back { text-decoration: none; color: #2563eb; font-size: 1.25rem; }
    .btn-outline { background: transparent; color: #2563eb; border: 1px solid #2563eb; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; cursor: pointer; white-space: nowrap; }
    .btn-outline:hover { background: #eff6ff; }
    .btn-outline.danger { color: #dc2626; border-color: #dc2626; }
    .btn-outline.danger:hover { background: #fef2f2; }
    .loading, .empty { text-align: center; padding: 3rem; color: #666; }
    .empty { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .search-input { flex: 1; min-width: 160px; padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.875rem; }
    .filters select { padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.875rem; background: white; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #eee; font-size: 0.875rem; }
    th { font-weight: 600; color: #666; font-size: 0.75rem; text-transform: uppercase; }
    .date { white-space: nowrap; }
    .detail { color: #64748b; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .user { color: #64748b; font-size: 0.8rem; }
    .badge { display: inline-block; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .badge.creación { background: #dcfce7; color: #166534; }
    .badge.modificación { background: #dbeafe; color: #1e40af; }
    .badge.baja { background: #fee2e2; color: #991b1b; }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
    .pagination button { background: none; border: 1px solid #ccc; border-radius: 4px; padding: 0.25rem 0.75rem; cursor: pointer; }
    .pagination button:disabled { opacity: 0.4; cursor: default; }
    @media (max-width: 640px) {
      header { flex-wrap: wrap; }
      .btn-outline { flex: 1; text-align: center; }
      .filters { flex-direction: column; }
      .filters select { width: 100%; }
    }
  `],
})
export class ActivityLogListComponent implements OnInit {
  private logService = inject(ActivityLogService);

  items = signal<ActivityLogRecord[]>([]);
  totalCount = signal(0);
  loading = signal(true);
  page = signal(1);

  searchQuery = signal('');
  actionFilter = signal<string | null>(null);

  filteredItems = signal<ActivityLogRecord[]>([]);
  totalPages = signal(1);
  private readonly pageSize = 50;

  ngOnInit() {
    this.load();
  }

  private async load() {
    this.loading.set(true);
    const { items, totalCount } = await this.logService.getAll(this.page(), this.pageSize);
    this.items.set(items);
    this.totalCount.set(totalCount);
    this.totalPages.set(Math.max(1, Math.ceil(totalCount / this.pageSize)));
    this.applyFilters();
    this.loading.set(false);
  }

  private applyFilters() {
    let items = this.items();
    const q = this.searchQuery().toLowerCase();
    if (q) items = items.filter(i => i.entityName.toLowerCase().includes(q) || (i.details?.toLowerCase() ?? '').includes(q));
    if (this.actionFilter()) items = items.filter(i => i.action === this.actionFilter());
    this.filteredItems.set(items);
  }

  goTo(p: number) {
    this.page.set(p);
    this.load();
  }

  exportCsv() {
    exportCsv('actividad.csv', [
      { label: 'Fecha', value: r => r.performedAt },
      { label: 'Acción', value: r => r.action },
      { label: 'Entidad', value: r => r.entityName },
      { label: 'Detalle', value: r => r.details ?? '' },
      { label: 'Usuario', value: r => r.performedBy },
    ], this.filteredItems());
  }

  async clearLog() {
    if (!confirm('¿Limpiar todo el registro de actividad?')) return;
    await this.logService.clearAll();
    this.page.set(1);
    this.load();
  }

  badgeClass(action: string): string {
    return action.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
}
