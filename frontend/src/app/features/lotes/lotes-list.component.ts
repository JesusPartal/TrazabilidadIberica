import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import type { Lote } from '../../core/models/lote';
import { CategoriaLote } from '../../core/models/lote';
import { exportCsv } from '../../shared/utils/csv-export';


@Component({
  selector: 'app-lotes-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page">
      <header>
        <a routerLink="/" class="back">←</a>
        <h1>Lotes</h1>
        <a routerLink="/lotes/new" class="btn-primary">➕ Nuevo</a>
        <button class="btn-outline" (click)="exportCsv()">📥 CSV</button>
      </header>

      <div class="filters">
        <input #q type="text" placeholder="Buscar por código..." (input)="searchQuery.set(q.value)" class="search-input" />
        <select #cat (change)="categoriaFilter.set(cat.value ? +cat.value : null)">
          <option value="">Todas las categorías</option>
          <option value="0">Cebo</option>
          <option value="1">Recría</option>
          <option value="2">Transición</option>
          <option value="3">Reproducción</option>
          <option value="4">Lechones</option>
        </select>
      </div>

      @if (loading()) {
        <div class="loading">Cargando...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else if (lotes().length === 0) {
        <div class="empty">
          <p>No hay lotes registrados</p>
        </div>
      } @else if (filteredItems().length === 0) {
        <div class="empty">
          <p>Ningún lote coincide con los filtros</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Finca</th>
                <th>Categoría</th>
                <th>Animales</th>
                <th>Peso Medio</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (l of filteredItems(); track l.id) {
                <tr>
                  <td>{{ l.codigoLote }}</td>
                  <td>{{ l.finca?.nombre ?? '—' }}</td>
                  <td>{{ categoriaLabel(l.categoria) }}</td>
                  <td>{{ l.numeroAnimales }}</td>
                  <td>{{ l.pesoMedioKg }} kg</td>
                  <td>{{ l.fechaFormacion | date:'dd/MM/yyyy' }}</td>
                  <td class="actions">
                    <a [routerLink]="['/lotes', l.id, 'edit']" class="btn-sm">✎</a>
                    <button class="btn-sm danger" (click)="deleteLote(l.id)">✕</button>
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
  `],
})
export class LotesListComponent implements OnInit {
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);

  lotes = signal<Lote[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  page = signal(1);
  totalPages = signal(1);

  searchQuery = signal('');
  categoriaFilter = signal<number | null>(null);

  filteredItems = computed(() => {
    let items = this.lotes();
    const q = this.searchQuery().toLowerCase();
    if (q) items = items.filter(l => l.codigoLote.toLowerCase().includes(q));
    if (this.categoriaFilter() != null) items = items.filter(l => l.categoria === this.categoriaFilter());
    return items;
  });

  ngOnInit() {
    this.loadLotes();
  }

  private async loadLotes() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { items, totalPages } = await this.offline.getAll('lotes', this.api.getLotes(undefined, this.page()));
      this.lotes.set(items);
      this.totalPages.set(totalPages);
    } catch {
      this.error.set('Error al cargar lotes');
    }
    this.loading.set(false);
  }

  goTo(p: number) {
    this.page.set(p);
    this.loadLotes();
  }

  exportCsv() {
    exportCsv('lotes.csv', [
      { label: 'Código', value: l => l.codigoLote },
      { label: 'Finca', value: l => l.finca?.nombre ?? '' },
      { label: 'Categoría', value: l => this.categoriaLabel(l.categoria) },
      { label: 'Animales', value: l => l.numeroAnimales },
      { label: 'Peso Medio (kg)', value: l => l.pesoMedioKg },
      { label: 'Fecha', value: l => l.fechaFormacion },
    ], this.filteredItems());
  }

  async deleteLote(id: string) {
    if (!confirm('¿Eliminar este lote?')) return;
    await this.offline.remove('lotes', 'lote', id, this.api.deleteLote(id));
    this.loadLotes();
  }

  categoriaLabel(c: CategoriaLote): string {
    const map: Record<number, string> = {
      [CategoriaLote.Cebo]: 'Cebo',
      [CategoriaLote.Recria]: 'Recría',
      [CategoriaLote.Transicion]: 'Transición',
      [CategoriaLote.Reproduccion]: 'Reproducción',
      [CategoriaLote.Lechones]: 'Lechones',
    };
    return map[c] ?? '—';
  }
}
