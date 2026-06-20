export enum EstadoCampania {
  Planificada = 0,
  Activa = 1,
  Cerrada = 2,
}

export interface CampaniaMontanera {
  id: string;
  fincaId: string;
  temporada: number;
  fechaInicio: string;
  fechaFin: string | null;
  hectareasUtilizadas: number;
  capacidadMaxAnimales: number;
  estadoCampania: EstadoCampania;
  numAutorizacionDO: string | null;
  finca?: { id: string; nombre: string };
  createdOffline: boolean;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
