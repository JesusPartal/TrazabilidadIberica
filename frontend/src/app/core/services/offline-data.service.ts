import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DbService } from './db.service';
import { ApiService } from './api.service';
import { SyncService } from './sync.service';
import type { Observable } from 'rxjs';
import type { PagedList } from '../models/paged-list';

export interface OfflineResult<T> {
  items: T[];
  totalPages: number;
  online: boolean;
}

@Injectable({ providedIn: 'root' })
export class OfflineDataService {
  private db = inject(DbService);
  private api = inject(ApiService);
  private sync = inject(SyncService);

  async save<T extends { id: string; createdOffline?: boolean; clientId?: string | null }>(
    table: string,
    dexieTable: string,
    entityType: string,
    data: T,
    existingId?: string | null,
    onlineCall?: Observable<any>,
  ): Promise<T> {
    const record = { ...data, id: existingId || data.id || crypto.randomUUID() };

    if (!existingId) {
      record.createdOffline = true;
      record.clientId = crypto.randomUUID();
    }

    await (this.db as any)[dexieTable].put(record);

    try {
      if (onlineCall) await firstValueFrom(onlineCall);
    } catch {
      await this.sync.enqueue(entityType, record.id, existingId ? 'update' : 'create', record);
    }

    return record;
  }

  async remove(
    dexieTable: string,
    entityType: string,
    id: string,
    onlineCall?: Observable<any>,
  ): Promise<void> {
    const existing = await (this.db as any)[dexieTable].get(id);
    if (existing) {
      await (this.db as any)[dexieTable].update(id, { deletedAt: new Date().toISOString() });
    }

    try {
      if (onlineCall) await firstValueFrom(onlineCall);
    } catch {
      await this.sync.enqueue(entityType, id, 'delete', null);
    }
  }

  async getAll<T>(
    dexieTable: string,
    onlineCall: Observable<PagedList<T>>,
  ): Promise<OfflineResult<T>> {
    try {
      const apiResult = await firstValueFrom(onlineCall);
      const items = apiResult.items.filter((i: any) => !i.deletedAt);
      for (const item of items) {
        await (this.db as any)[dexieTable].put(item);
      }
      return { items, totalPages: apiResult.totalPages, online: true };
    } catch {
      const all = await (this.db as any)[dexieTable].toArray();
      const items = all.filter((i: any) => !i.deletedAt) as T[];
      return { items, totalPages: Math.ceil(items.length / 50), online: false };
    }
  }

  async getById<T>(
    dexieTable: string,
    id: string,
    onlineCall: Observable<T>,
  ): Promise<{ item: T | null; online: boolean }> {
    try {
      const item = await firstValueFrom(onlineCall);
      await (this.db as any)[dexieTable].put(item);
      return { item, online: true };
    } catch {
      const item = await (this.db as any)[dexieTable].get(id);
      return { item: item ?? null, online: false };
    }
  }
}
