import { Injectable } from '@angular/core';
import Dexie, { type EntityTable } from 'dexie';
import type { Animal } from '../models/animal';
import type { Finca } from '../models/finca';
import type { SyncQueueItem } from '../models/sync';

@Injectable({ providedIn: 'root' })
export class DbService extends Dexie {
  animales!: EntityTable<Animal, 'id'>;
  fincas!: EntityTable<Finca, 'id'>;
  syncQueue!: EntityTable<SyncQueueItem, 'id'>;

  constructor() {
    super('TrazabilidadIberica');
    this.version(1).stores({
      animales: 'id, estado, fincaActualId, deletedAt',
      fincas: 'id, ganaderoId, deletedAt',
      syncQueue: '++id, entityType, entityId, createdAt',
    });
  }
}
