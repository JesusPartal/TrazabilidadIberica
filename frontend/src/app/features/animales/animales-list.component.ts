import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import type { Animal } from '../../core/models/animal';
import { EstadoAnimal, SexoAnimal, TipoAnimal } from '../../core/models/animal';
import { exportCsv } from '../../shared/utils/csv-export';

@Component({
  selector: 'app-animales-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page">
      <header>
        <a routerLink="/" class="back">←</a>
        <h1>Animales</h1>
        <a routerLink="/animals/new" class="btn-primary">➕ Nuevo</a>
        <button class="btn-outline" (click)="exportCsv()">📥 CSV</button>
      </header>

      <div class="filters">
        <input #q type="text" placeholder="Buscar por crotal..." (input)="searchQuery.set(q.value)" class="search-input" />
        <select #est (change)="estadoFilter.set(est.value ? +est.value : null)">
          <option value="">Todos los estados</option>
          <option value="0">Activo</option>
          <option value="1">Vendido</option>
          <option value="2">Muerto</option>
          <option value="3">Perdido</option>
          <option value="4">Sacrificado</option>
        </select>
        <select #tip (change)="tipoFilter.set(tip.value ? +tip.value : null)">
          <option value="">Todos los tipos</option>
          <option value="0">Cerdo</option>
          <option value="1">Lechón</option>
        </select>
        <select #sx (change)="sexoFilter.set(sx.value ? +sx.value : null)">
          <option value="">Todos los sexos</option>
          <option value="0">Macho</option>
          <option value="1">Hembra</option>
        </select>
      </div>

      @if (!online()) {
        <div class="offline-banner">⚠️ Sin conexión — mostrando datos guardados</div>
      }

      @if (loading()) {
        <div class="loading">Cargando...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else if (animales().length === 0) {
        <div class="empty">
          <p>No hay animales registrados</p>
          <a routerLink="/animals/new" class="btn-primary">Registrar primer animal</a>
        </div>
      } @else if (filteredAnimales().length === 0) {
        <div class="empty">
          <p>Ningún animal coincide con los filtros</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Crotal</th>
                <th>Tipo</th>
                <th>Sexo</th>
                <th>Nacimiento</th>
                <th>Entrada</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (a of filteredAnimales(); track a.id) {
                <tr>
                  <td>{{ a.numeroCrotal }}</td>
                  <td>{{ tipoLabel(a.tipo) }}</td>
                  <td>{{ sexoLabel(a.sexo) }}</td>
                  <td>{{ a.fechaNacimiento | date:'dd/MM/yyyy' }}</td>
                  <td>{{ a.fechaEntrada | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <span class="badge" [class]="estadoClass(a.estado)">{{ estadoLabel(a.estado) }}</span>
                  </td>
                  <td class="actions">
                    <a [routerLink]="['/animals', a.id, 'edit']" class="btn-sm">✎</a>
                    <button class="btn-sm danger" (click)="deleteAnimal(a.id)">✕</button>
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
    header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
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
    .filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .search-input { flex: 1; min-width: 160px; padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.875rem; }
    .filters select { padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.875rem; background: white; }
    .offline-banner { background: #fef3c7; color: #92400e; padding: 0.5rem 1rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #eee; font-size: 0.875rem; }
    th { font-weight: 600; color: #666; font-size: 0.75rem; text-transform: uppercase; }
    td.actions { white-space: nowrap; display: flex; gap: 0.25rem; }
    .badge { display: inline-block; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .badge.Activo { background: #dcfce7; color: #166534; }
    .badge.Vendido { background: #fef3c7; color: #92400e; }
    .badge.Muerto { background: #fee2e2; color: #991b1b; }
    .badge.Perdido { background: #f3e8ff; color: #6b21a8; }
    .badge.Sacrificado { background: #e5e7eb; color: #374151; }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
    .pagination button { background: none; border: 1px solid #ccc; border-radius: 4px; padding: 0.25rem 0.75rem; cursor: pointer; }
    .pagination button:disabled { opacity: 0.4; cursor: default; }
    @media (max-width: 640px) {
      header { flex-wrap: wrap; }
      .btn-primary, .btn-outline { flex: 1; text-align: center; }
      .filters { flex-direction: column; }
      .filters select { width: 100%; }
    }
  `],
})
export class AnimalesListComponent implements OnInit {
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);

  animales = signal<Animal[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  page = signal(1);
  totalPages = signal(1);

  online = signal(true);
  searchQuery = signal('');
  estadoFilter = signal<number | null>(null);
  tipoFilter = signal<number | null>(null);
  sexoFilter = signal<number | null>(null);

  filteredAnimales = computed(() => {
    let items = this.animales();
    const q = this.searchQuery().toLowerCase();
    if (q) items = items.filter(a => a.numeroCrotal.toLowerCase().includes(q));
    if (this.estadoFilter() != null) items = items.filter(a => a.estado === this.estadoFilter());
    if (this.tipoFilter() != null) items = items.filter(a => a.tipo === this.tipoFilter());
    if (this.sexoFilter() != null) items = items.filter(a => a.sexo === this.sexoFilter());
    return items;
  });

  ngOnInit() {
    this.loadAnimales();
  }

  private async loadAnimales() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { items, totalPages, online } = await this.offline.getAll('animales', this.api.getAnimals(this.page()));
      this.animales.set(items);
      this.totalPages.set(totalPages);
      this.online.set(online);
    } catch {
      this.error.set('Error al cargar animales');
    }
    this.loading.set(false);
  }

  goTo(p: number) {
    this.page.set(p);
    this.loadAnimales();
  }

  async deleteAnimal(id: string) {
    if (!confirm('¿Eliminar este animal?')) return;
    await this.offline.remove('animales', 'animal', id, this.api.deleteAnimal(id));
    this.loadAnimales();
  }

  tipoLabel(t: TipoAnimal): string {
    return TipoAnimal[t];
  }

  sexoLabel(s: SexoAnimal): string {
    return SexoAnimal[s];
  }

  estadoLabel(e: EstadoAnimal): string {
    return EstadoAnimal[e];
  }

  exportCsv() {
    exportCsv('animales.csv', [
      { label: 'Crotal', value: a => a.numeroCrotal },
      { label: 'Tipo', value: a => TipoAnimal[a.tipo] },
      { label: 'Sexo', value: a => SexoAnimal[a.sexo] },
      { label: 'Nacimiento', value: a => a.fechaNacimiento },
      { label: 'Entrada', value: a => a.fechaEntrada },
      { label: 'Estado', value: a => EstadoAnimal[a.estado] },
    ], this.filteredAnimales());
  }

  estadoClass(e: EstadoAnimal): string {
    return EstadoAnimal[e];
  }
}
