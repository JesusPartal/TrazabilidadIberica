export enum CausaBaja {
  Venta = 0,
  Muerte = 1,
  Sacrificio = 2,
  Perdida = 3,
  Donacion = 4,
}

export interface Baja {
  id: string;
  animalId: string;
  fechaBaja: string;
  causa: CausaBaja;
  destino: string | null;
  numGuiaAsociada: string | null;
  observaciones: string | null;
  animal?: { id: string; numeroCrotal: string };
  createdOffline: boolean;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
