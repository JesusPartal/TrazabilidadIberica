import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import type { Veterinario } from '../../core/models/veterinario';

@Component({
  selector: 'app-veterinarios-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <header>
        <a routerLink="/" class="back">←</a>
        <h1>Veterinarios</h1>
        <a routerLink="/veterinarios/new" class="btn-primary">➕ Nuevo</a>
      </header>

      @if (loading()) {
        <div class="loading">Cargando...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else if (items().length === 0) {
        <div class="empty">
          <p>No hay veterinarios registrados</p>
          <a routerLink="/veterinarios/new" class="btn-primary">Registrar primer veterinario</a>
        </div>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Nº Colegiado</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (item of items(); track item.id) {
                <tr>
                  <td>{{ item.nombreCompleto }}</td>
                  <td>{{ item.numeroColegiado }}</td>
                  <td>{{ item.telefono ?? '—' }}</td>
                  <td>{{ item.email ?? '—' }}</td>
                  <td class="actions">
                    <a [routerLink]="['/veterinarios', item.id, 'edit']" class="btn-sm">✎</a>
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
    .btn-primary { background: #2563eb; color: white; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-size: 0.875rem; }
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
export class VeterinariosListComponent implements OnInit {
  private api = inject(ApiService);
  private offline = inject(OfflineDataService);

  items = signal<Veterinario[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  page = signal(1);
  totalPages = signal(1);

  ngOnInit() {
    this.loadItems();
  }

  private async loadItems() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { items, totalPages } = await this.offline.getAll('veterinarios', this.api.getVeterinarios(this.page()));
      this.items.set(items);
      this.totalPages.set(totalPages);
    } catch {
      this.error.set('Error al cargar veterinarios');
    }
    this.loading.set(false);
  }

  goTo(p: number) {
    this.page.set(p);
    this.loadItems();
  }

  async deleteItem(id: string) {
    if (!confirm('¿Eliminar este veterinario?')) return;
    await this.offline.remove('veterinarios', 'veterinario', id, this.api.deleteVeterinario(id));
    this.loadItems();
  }
}
