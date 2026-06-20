import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { OfflineDataService } from '../../core/services/offline-data.service';
import type { MovimientoAnimal } from '../../core/models/movimiento-animal';
import { TipoMovimiento } from '../../core/models/movimiento-animal';

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
      </header>

      @if (loading()) {
        <div class="loading">Cargando...</div>
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else if (movimientos().length === 0) {
        <div class="empty">
          <p>No hay movimientos registrados</p>
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
              @for (m of movimientos(); track m.id) {
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
    .btn-primary { background: #2563eb; color: white; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-size: 0.875rem; }
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

  ngOnInit() {
    this.loadMovimientos();
  }

  private async loadMovimientos() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const { items, totalPages } = await this.offline.getAll('movimientosAnimal', this.api.getMovimientos(undefined, undefined, this.page()));
      this.movimientos.set(items);
      this.totalPages.set(totalPages);
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
