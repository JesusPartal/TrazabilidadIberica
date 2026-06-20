import { Injectable } from '@angular/core';
import Dexie, { type EntityTable } from 'dexie';
import type { Animal } from '../models/animal';
import type { Finca } from '../models/finca';
import type { Lote } from '../models/lote';
import type { MovimientoAnimal } from '../models/movimiento-animal';
import type { Ganadero } from '../models/ganadero';
import type { Veterinario } from '../models/veterinario';
import type { Baja } from '../models/baja';
import type { CampaniaMontanera } from '../models/campania-montanera';
import type { TratamientoVeterinario } from '../models/tratamiento-veterinario';
import type { SyncQueueItem } from '../models/sync';

@Injectable({ providedIn: 'root' })
export class DbService extends Dexie {
  animales!: EntityTable<Animal, 'id'>;
  fincas!: EntityTable<Finca, 'id'>;
  lotes!: EntityTable<Lote, 'id'>;
  movimientosAnimal!: EntityTable<MovimientoAnimal, 'id'>;
  ganaderos!: EntityTable<Ganadero, 'id'>;
  veterinarios!: EntityTable<Veterinario, 'id'>;
  bajas!: EntityTable<Baja, 'id'>;
  campaniasMontanera!: EntityTable<CampaniaMontanera, 'id'>;
  tratamientosVeterinarios!: EntityTable<TratamientoVeterinario, 'id'>;
  syncQueue!: EntityTable<SyncQueueItem, 'id'>;

  constructor() {
    super('TrazabilidadIberica');
    this.version(1).stores({
      animales: 'id, estado, fincaActualId, deletedAt',
      fincas: 'id, ganaderoId, deletedAt',
      syncQueue: '++id, entityType, entityId, createdAt',
    });
    this.version(2).stores({
      animales: 'id, estado, fincaActualId, deletedAt',
      fincas: 'id, ganaderoId, deletedAt',
      lotes: 'id, fincaId, deletedAt',
      movimientosAnimal: 'id, animalId, fincaOrigenId, deletedAt',
      syncQueue: '++id, entityType, entityId, createdAt',
    });
    this.version(3).stores({
      animales: 'id, estado, fincaActualId, deletedAt',
      fincas: 'id, ganaderoId, deletedAt',
      lotes: 'id, fincaId, deletedAt',
      movimientosAnimal: 'id, animalId, fincaOrigenId, deletedAt',
      ganaderos: 'id, deletedAt',
      veterinarios: 'id, deletedAt',
      bajas: 'id, animalId, deletedAt',
      campaniasMontanera: 'id, fincaId, deletedAt',
      tratamientosVeterinarios: 'id, animalId, veterinarioId, deletedAt',
      syncQueue: '++id, entityType, entityId, createdAt',
    });
  }
}
