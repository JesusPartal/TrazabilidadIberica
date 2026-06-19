import { Component, inject } from '@angular/core';
import { SyncService } from '../../core/services/sync.service';

@Component({
  selector: 'app-sync-indicator',
  standalone: true,
  template: `
    @if (sync.pendingCount() > 0) {
      <button class="sync-btn" (click)="sync.syncNow()" title="Enviar cambios pendientes">
        📤 {{ sync.pendingCount() }}
      </button>
    }
  `,
  styles: [`
    .sync-btn {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 9999px;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 1000;
    }
  `],
})
export class SyncIndicatorComponent {
  sync = inject(SyncService);
}
