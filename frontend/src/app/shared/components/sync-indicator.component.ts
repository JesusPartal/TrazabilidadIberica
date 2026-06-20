import { Component, inject } from '@angular/core';
import { SyncService } from '../../core/services/sync.service';

@Component({
  selector: 'app-sync-indicator',
  standalone: true,
  template: `
    @if (sync.pendingCount() > 0 || sync.syncing()) {
      <button class="sync-btn" [class.syncing]="sync.syncing()" (click)="sync.syncNow()" [disabled]="sync.syncing()" title="Sincronizar">
        @if (sync.syncing()) {
          ⟳ Sincronizando...
        } @else {
          📤 {{ sync.pendingCount() }} pendiente(s)
        }
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
      transition: background 0.2s;
    }
    .sync-btn.syncing {
      background: #f59e0b;
      cursor: default;
    }
    .sync-btn:disabled {
      opacity: 0.8;
    }
  `],
})
export class SyncIndicatorComponent {
  sync = inject(SyncService);
}
