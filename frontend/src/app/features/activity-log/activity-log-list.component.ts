import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ActivityLogService } from '../../core/services/activity-log.service';
import { exportCsv } from '../../shared/utils/csv-export';
import type { ActivityLogRecord } from '../../core/models/activity-log';

interface DayGroup {
  label: string;
  items: ActivityLogRecord[];
}

@Component({
  selector: 'app-activity-log-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page">
      <header>
        <a routerLink="/" class="back">←</a>
        <h1>Registro de Actividad</h1>
        <button class="btn-outline" (click)="exportCsv()">📥 CSV</button>
        <button class="btn-outline danger" (click)="clearLog()">🗑 Limpiar</button>
      </header>

      <div class="summary">
        <div class="stat-card total">
          <span class="stat-num">{{ totalCount() }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-card creation">
          <span class="stat-num">{{ stats().created }}</span>
          <span class="stat-label">Creaciones</span>
        </div>
        <div class="stat-card modification">
          <span class="stat-num">{{ stats().modified }}</span>
          <span class="stat-label">Modificaciones</span>
        </div>
        <div class="stat-card deletion">
          <span class="stat-num">{{ stats().deleted }}</span>
          <span class="stat-label">Bajas</span>
        </div>
      </div>

      <div class="filters">
        <input #q type="text" placeholder="Buscar por entidad o detalle..." (input)="onSearch(q.value)" class="search-input" />
        <select #act (change)="actionFilter.set(act.value || null); applyFilters()">
          <option value="">Todas las acciones</option>
          <option value="Creación">Creación</option>
          <option value="Modificación">Modificación</option>
          <option value="Baja">Baja</option>
        </select>
      </div>

      @if (loading()) {
        <div class="loading"><div class="spinner"></div> Cargando...</div>
      } @else if (filteredItems().length === 0) {
        <div class="empty">
          @if (items().length === 0) {
            <div class="empty-icon">📋</div>
            <p>No hay actividad registrada todavía</p>
            <span class="empty-hint">Las operaciones que realices aparecerán aquí</span>
          } @else {
            <div class="empty-icon">🔍</div>
            <p>Ningún registro coincide con los filtros</p>
          }
        </div>
      } @else {
        <div class="timeline">
          @for (group of groups(); track group.label) {
            <div class="day-header">
              <span class="day-line"></span>
              <span class="day-label">{{ group.label }}</span>
              <span class="day-line"></span>
            </div>
            @for (r of group.items; track r.id) {
              <div class="tl-entry">
                <div class="tl-dot" [class]="dotClass(r.action)"></div>
                <div class="tl-card">
                  <div class="tl-top">
                    <span class="tl-action" [class]="badgeClass(r.action)">{{ r.action }}</span>
                    <span class="tl-entity">{{ r.entityName }}</span>
                    <span class="tl-time">{{ r.performedAt | date:'HH:mm' }}</span>
                  </div>
                  <div class="tl-detail">{{ r.details }}</div>
                  <div class="tl-user">{{ r.performedBy }}</div>
                </div>
              </div>
            }
          }
        </div>

        @if (totalPages() > 1) {
          <div class="pagination">
            <button [disabled]="page() <= 1" (click)="goTo(page() - 1)">← Anterior</button>
            <span>Pág. {{ page() }} de {{ totalPages() }}</span>
            <button [disabled]="page() >= totalPages()" (click)="goTo(page() + 1)">Siguiente →</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page { max-width: 800px; margin: 0 auto; padding: 1rem; }
    header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
    header h1 { flex: 1; font-size: 1.2rem; font-weight: 700; color: #0f172a; }
    .back { text-decoration: none; color: #64748b; font-size: 1.25rem; }
    .back:hover { color: #2563eb; }
    .btn-outline { background: #fff; color: #475569; border: 1px solid #e2e8f0; padding: 0.45rem 1rem; border-radius: 8px; font-size: 0.8rem; cursor: pointer; white-space: nowrap; }
    .btn-outline:hover { background: #f8fafc; border-color: #94a3b8; }
    .btn-outline.danger { color: #dc2626; border-color: #fecaca; }
    .btn-outline.danger:hover { background: #fef2f2; border-color: #fca5a5; }

    .summary { display: grid; grid-template-columns: repeat(4,1fr); gap: 0.6rem; margin-bottom: 1rem; }
    .stat-card { background: #fff; border-radius: 10px; padding: 0.7rem 0.5rem; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,.06); border-top: 3px solid #94a3b8; }
    .stat-card.total { border-top-color: #64748b; }
    .stat-card.creation { border-top-color: #22c55e; }
    .stat-card.modification { border-top-color: #3b82f6; }
    .stat-card.deletion { border-top-color: #ef4444; }
    .stat-num { display: block; font-size: 1.3rem; font-weight: 700; color: #0f172a; }
    .stat-label { font-size: 0.6rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }

    .filters { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; }
    .search-input { flex: 1; padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; background: #fff; }
    .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); outline: none; }
    .filters select { padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; background: #fff; cursor: pointer; min-width: 150px; }
    .filters select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); outline: none; }

    .loading { text-align: center; padding: 4rem; color: #64748b; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
    .spinner { width: 28px; height: 28px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: s .7s linear infinite; }
    @keyframes s { to { transform: rotate(360deg); } }

    .empty { text-align: center; padding: 4rem 2rem; color: #64748b; }
    .empty-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .empty p { font-size: 0.95rem; margin: 0 0 0.25rem; color: #334155; }
    .empty-hint { font-size: 0.8rem; color: #94a3b8; }

    .timeline { position: relative; padding-left: 2rem; }
    .day-header { display: flex; align-items: center; gap: 0.75rem; margin: 1.5rem 0 0.75rem -2rem; }
    .day-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; white-space: nowrap; }
    .day-line { flex: 1; height: 1px; background: #e2e8f0; }

    .tl-entry { position: relative; margin-bottom: 0.75rem; }
    .tl-entry::before { content: ''; position: absolute; left: -1.65rem; top: 1.2rem; bottom: -0.75rem; width: 2px; background: #e2e8f0; }
    .tl-entry:last-child::before { display: none; }
    .tl-dot { position: absolute; left: -2rem; top: 1rem; width: 12px; height: 12px; border-radius: 50%; border: 2.5px solid #94a3b8; background: #fff; z-index: 1; }
    .tl-dot.creacion { border-color: #22c55e; background: #f0fdf4; }
    .tl-dot.modificacion { border-color: #3b82f6; background: #eff6ff; }
    .tl-dot.baja { border-color: #ef4444; background: #fef2f2; }

    .tl-card { background: #fff; border-radius: 10px; padding: 0.75rem 1rem; box-shadow: 0 1px 3px rgba(0,0,0,.06); border: 1px solid #f1f5f9; }
    .tl-card:hover { box-shadow: 0 3px 12px rgba(0,0,0,.08); }
    .tl-top { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
    .tl-action { display: inline-block; padding: 0.1rem 0.45rem; border-radius: 6px; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
    .tl-action.creacion { background: #dcfce7; color: #166534; }
    .tl-action.modificacion { background: #dbeafe; color: #1e40af; }
    .tl-action.baja { background: #fee2e2; color: #991b1b; }
    .tl-entity { font-size: 0.85rem; font-weight: 500; color: #0f172a; flex: 1; }
    .tl-time { font-size: 0.72rem; color: #94a3b8; white-space: nowrap; }
    .tl-detail { font-size: 0.8rem; color: #475569; margin-bottom: 0.2rem; }
    .tl-user { font-size: 0.7rem; color: #94a3b8; }

    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 2rem; padding-bottom: 2rem; }
    .pagination button { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.4rem 1rem; cursor: pointer; font-size: 0.8rem; color: #475569; }
    .pagination button:hover:not(:disabled) { border-color: #3b82f6; color: #3b82f6; }
    .pagination button:disabled { opacity: 0.4; cursor: default; }
    .pagination span { font-size: 0.8rem; color: #64748b; }

    @media (max-width: 640px) {
      .page { padding: 0.75rem; }
      header { flex-wrap: wrap; }
      .btn-outline { flex: 1; text-align: center; }
      .summary { grid-template-columns: repeat(2,1fr); }
      .filters { flex-direction: column; }
      .filters select { width: 100%; }
      .timeline { padding-left: 1.5rem; }
      .tl-dot { left: -1.45rem; width: 10px; height: 10px; }
      .tl-entry::before { left: -1.1rem; }
      .day-header { margin-left: -1.5rem; }
      .tl-card { padding: 0.6rem 0.75rem; }
    }
  `],
})
export class ActivityLogListComponent implements OnInit {
  private logService = inject(ActivityLogService);

  items = signal<ActivityLogRecord[]>([]);
  filteredItems = signal<ActivityLogRecord[]>([]);
  totalCount = signal(0);
  loading = signal(true);
  page = signal(1);
  totalPages = signal(1);

  searchQuery = signal('');
  actionFilter = signal<string | null>(null);

  groups = computed(() => {
    const items = this.filteredItems();
    const map = new Map<string, ActivityLogRecord[]>();

    for (const item of items) {
      const key = this.dayKey(item.performedAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }

    const labels: Record<string, string> = {};
    for (const item of items) {
      const key = this.dayKey(item.performedAt);
      if (!labels[key]) labels[key] = this.dayLabel(item.performedAt);
    }

    return Array.from(map.entries()).map(([key, items]) => ({
      label: labels[key] || key,
      items,
    }));
  });

  stats = computed(() => {
    const all = this.items();
    return {
      created: all.filter(i => i.action === 'Creación').length,
      modified: all.filter(i => i.action === 'Modificación').length,
      deleted: all.filter(i => i.action === 'Baja').length,
    };
  });

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

  applyFilters() {
    let items = this.items();
    const q = this.searchQuery().toLowerCase();
    if (q) items = items.filter(i => i.entityName.toLowerCase().includes(q) || (i.details?.toLowerCase() ?? '').includes(q));
    if (this.actionFilter()) items = items.filter(i => i.action === this.actionFilter());
    this.filteredItems.set(items);
  }

  onSearch(value: string) {
    this.searchQuery.set(value);
    this.applyFilters();
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

  dotClass(action: string): string {
    return this.badgeClass(action);
  }

  private dayKey(iso: string): string {
    return iso.substring(0, 10);
  }

  private dayLabel(iso: string): string {
    const date = new Date(iso.substring(0, 10) + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const diff = Math.round((today.getTime() - date.getTime()) / 86400000);

    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Ayer';
    if (diff <= 7) return `Hace ${diff} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
