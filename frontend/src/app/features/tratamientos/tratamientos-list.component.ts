import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import type { TratamientoVeterinario } from '../../core/models/tratamiento-veterinario';
import { exportCsv } from '../../shared/utils/csv-export';

@Component({
  selector: 'app-tratamientos-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page">
      <header>
        <a routerLink="/" class="back">←</a>
        <h1>Tratamientos Veterinarios</h1>
        <a routerLink="/tratamientos/new" class="btn-primary">➕ Nuevo</a>
        <button class="btn-outline" (click)="exportCsv()">📥 CSV</button>
      </header>

      <div class="filters">
        <input #q type="text" placeholder="Buscar por crotal o medicamento..." (input)="searchQuery.set(q.value)" class="search-input" />
      </div>

      @if (loading()) {
        <div class="loading">Cargando...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else if (items().length === 0) {
        <div class="empty">
          <p>No hay tratamientos registrados</p>
          <a routerLink="/tratamientos/new" class="btn-primary">Registrar primer tratamiento</a>
        </div>
      } @else if (filteredItems().length === 0) {
        <div class="empty">
          <p>Ningún tratamiento coincide con los filtros</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Animal</th>
                <th>Veterinario</th>
                <th>Medicamento</th>
                <th>Fecha Admin.</th>
                <th>Dosis</th>
                <th>Supresión</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (item of filteredItems(); track item.id) {
                <tr>
                  <td>{{ item.animal?.numeroCrotal ?? item.animalId }}</td>
                  <td>{{ item.veterinario?.nombreCompleto ?? item.veterinarioId }}</td>
                  <td>{{ item.nombreMedicamento }}</td>
                  <td>{{ item.fechaAdministracion | date:'dd/MM/yyyy' }}</td>
                  <td>{{ item.dosisAdministrada }} {{ item.unidadDosis ?? '' }}</td>
                  <td>{{ item.periodoSupresionDias }} días</td>
                  <td class="actions">
                    <a [routerLink]="['/tratamientos', item.id, 'edit']" class="btn-sm">✎</a>
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
    .filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .search-input { flex: 1; min-width: 160px; padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.875rem; }
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
  `],
})
export class TratamientosListComponent implements OnInit {
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);

  items = signal<TratamientoVeterinario[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  page = signal(1);
  totalPages = signal(1);
  searchQuery = signal('');

  filteredItems = computed(() => {
    let items = this.items();
    const q = this.searchQuery().toLowerCase();
    if (q) items = items.filter(t => (t.animal?.numeroCrotal ?? '').toLowerCase().includes(q) || t.nombreMedicamento.toLowerCase().includes(q));
    return items;
  });

  ngOnInit() {
    this.loadItems();
  }

  private async loadItems() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { items, totalPages } = await this.offline.getAll('tratamientosVeterinarios', this.api.getTratamientos(this.page()));
      this.items.set(items);
      this.totalPages.set(totalPages);
    } catch {
      this.error.set('Error al cargar tratamientos');
    }
    this.loading.set(false);
  }

  goTo(p: number) {
    this.page.set(p);
    this.loadItems();
  }

  exportCsv() {
    exportCsv('tratamientos.csv', [
      { label: 'Animal', value: t => t.animal?.numeroCrotal ?? '' },
      { label: 'Medicamento', value: t => t.nombreMedicamento },
      { label: 'Veterinario', value: t => t.veterinario?.nombreCompleto ?? '' },
      { label: 'Fecha Admin.', value: t => t.fechaAdministracion },
      { label: 'Dosis', value: t => `${t.dosisAdministrada} ${t.unidadDosis ?? ''}` },
      { label: 'Supresión (días)', value: t => t.periodoSupresionDias },
    ], this.filteredItems());
  }

  async deleteItem(id: string) {
    if (!confirm('¿Eliminar este tratamiento?')) return;
    await this.offline.remove('tratamientosVeterinarios', 'tratamiento', id, this.api.deleteTratamiento(id));
    this.loadItems();
  }
}
