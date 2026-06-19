export enum CategoriaLote {
  Cebo = 0,
  Recria = 1,
  Transicion = 2,
  Reproduccion = 3,
  Lechones = 4,
}

export interface Lote {
  id: string;
  fincaId: string;
  codigoLote: string;
  fechaFormacion: string;
  categoria: CategoriaLote;
  numeroAnimales: number;
  pesoMedioKg: number;
  composicionRacial: string;
  origen: string | null;
  cerrado: boolean;
  finca?: { id: string; nombre: string };
  createdOffline: boolean;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
