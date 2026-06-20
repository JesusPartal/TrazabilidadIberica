import { Injectable, inject, signal, NgZone } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DbService } from './db.service';
import { ApiService } from './api.service';
import type { SyncQueueItem } from '../models/sync';

@Injectable({ providedIn: 'root' })
export class SyncService {
  private db = inject(DbService);
  private api = inject(ApiService);
  private zone = inject(NgZone);

  pendingCount = signal(0);
  syncing = signal(false);
  private isSyncing = false;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.refreshPendingCount();

    this.zone.runOutsideAngular(() => {
      window.addEventListener('online', () => this.zone.run(() => this.syncNow()));
    });
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
    this.syncNow();
  }

  async dequeue(id: number): Promise<void> {
    await this.db.syncQueue.delete(id);
    this.refreshPendingCount();
  }

  async syncNow(): Promise<void> {
    if (this.isSyncing) return;
    if (!navigator.onLine) return;
    this.isSyncing = true;
    this.syncing.set(true);

    try {
      const items = await this.db.syncQueue.orderBy('createdAt').toArray();
      if (items.length === 0) return;

      let hasFailures = false;

      for (const item of items) {
        try {
          await this.replayItem(item);
          await this.dequeue(item.id!);
        } catch {
          hasFailures = true;
          await this.db.syncQueue.update(item.id!, { retryCount: (item.retryCount || 0) + 1 });
        }
      }

      this.refreshPendingCount();

      if (hasFailures) this.scheduleRetry();
    } finally {
      this.isSyncing = false;
      this.syncing.set(false);
    }
  }

  private scheduleRetry(): void {
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.retryTimer = setTimeout(() => this.syncNow(), 30_000);
  }

  private async replayItem(item: SyncQueueItem): Promise<void> {
    const { entityType, operation, payload, entityId } = item;
    const api = this.api;

    switch (entityType) {
      case 'animal':
        if (operation === 'create') await firstValueFrom(api.createAnimal(payload as any));
        else if (operation === 'update') await firstValueFrom(api.updateAnimal(entityId, payload as any));
        else if (operation === 'delete') await firstValueFrom(api.deleteAnimal(entityId));
        break;
      case 'finca':
        if (operation === 'create') await firstValueFrom(api.createFinca(payload as any));
        else if (operation === 'update') await firstValueFrom(api.updateFinca(entityId, payload as any));
        else if (operation === 'delete') await firstValueFrom(api.deleteFinca(entityId));
        break;
      case 'lote':
        if (operation === 'create') await firstValueFrom(api.createLote(payload as any));
        else if (operation === 'update') await firstValueFrom(api.updateLote(entityId, payload as any));
        else if (operation === 'delete') await firstValueFrom(api.deleteLote(entityId));
        break;
      case 'movimiento':
        if (operation === 'create') await firstValueFrom(api.createMovimiento(payload as any));
        else if (operation === 'update') await firstValueFrom(api.updateMovimiento(entityId, payload as any));
        else if (operation === 'delete') await firstValueFrom(api.deleteMovimiento(entityId));
        break;
      case 'ganadero':
        if (operation === 'create') await firstValueFrom(api.createGanadero(payload as any));
        else if (operation === 'update') await firstValueFrom(api.updateGanadero(entityId, payload as any));
        else if (operation === 'delete') await firstValueFrom(api.deleteGanadero(entityId));
        break;
      case 'veterinario':
        if (operation === 'create') await firstValueFrom(api.createVeterinario(payload as any));
        else if (operation === 'update') await firstValueFrom(api.updateVeterinario(entityId, payload as any));
        else if (operation === 'delete') await firstValueFrom(api.deleteVeterinario(entityId));
        break;
      case 'baja':
        if (operation === 'create') await firstValueFrom(api.createBaja(payload as any));
        else if (operation === 'update') await firstValueFrom(api.updateBaja(entityId, payload as any));
        else if (operation === 'delete') await firstValueFrom(api.deleteBaja(entityId));
        break;
      case 'campania':
        if (operation === 'create') await firstValueFrom(api.createCampania(payload as any));
        else if (operation === 'update') await firstValueFrom(api.updateCampania(entityId, payload as any));
        else if (operation === 'delete') await firstValueFrom(api.deleteCampania(entityId));
        break;
      case 'tratamiento':
        if (operation === 'create') await firstValueFrom(api.createTratamiento(payload as any));
        else if (operation === 'update') await firstValueFrom(api.updateTratamiento(entityId, payload as any));
        else if (operation === 'delete') await firstValueFrom(api.deleteTratamiento(entityId));
        break;
    }
  }

  private async refreshPendingCount(): Promise<void> {
    const count = await this.db.syncQueue.count();
    this.pendingCount.set(count);
  }
}
