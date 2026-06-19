import { Injectable, inject, signal } from '@angular/core';
import { DbService } from './db.service';
import { ApiService } from './api.service';
import type { SyncQueueItem } from '../models/sync';

@Injectable({ providedIn: 'root' })
export class SyncService {
  private db = inject(DbService);
  private api = inject(ApiService);

  pendingCount = signal(0);
  private isSyncing = false;

  constructor() {
    this.refreshPendingCount();
  }

  async enqueue(entityType: string, entityId: string, operation: 'create' | 'update' | 'delete', payload: unknown): Promise<void> {
    await this.db.syncQueue.add({
      entityType,
      entityId,
      operation,
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    });
    this.refreshPendingCount();
  }

  async dequeue(id: number): Promise<void> {
    await this.db.syncQueue.delete(id);
    this.refreshPendingCount();
  }

  async syncNow(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const items = await this.db.syncQueue.orderBy('createdAt').toArray();
      if (items.length === 0) return;

      this.api.sync(items).subscribe({
        next: async (response) => {
          if (response.success) {
            await this.db.syncQueue.clear();
            this.refreshPendingCount();
          }
        },
        error: () => {
          // Backoff handled by retry count; do nothing here
        },
      });
    } finally {
      this.isSyncing = false;
    }
  }

  private async refreshPendingCount(): Promise<void> {
    const count = await this.db.syncQueue.count();
    this.pendingCount.set(count);
  }
}
