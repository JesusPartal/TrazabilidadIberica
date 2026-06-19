export enum EstadoAnimal {
  Activo = 0,
  Vendido = 1,
  Muerto = 2,
  Perdido = 3,
  Sacrificado = 4,
}

export enum SexoAnimal {
  Macho = 0,
  Hembra = 1,
}

export enum TipoAnimal {
  Cerdo = 0,
  Lechon = 1,
}

export interface Animal {
  id: string;
  numeroCrotal: string;
  tipo: TipoAnimal;
  sexo: SexoAnimal;
  fechaNacimiento: string;
  pesoNacimiento: number | null;
  fechaEntrada: string;
  pesoEntrada: number;
  estado: EstadoAnimal;
  fincaActualId: string | null;
  loteActualId: string | null;
  createdOffline: boolean;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
