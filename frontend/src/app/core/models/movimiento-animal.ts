export enum TipoMovimiento {
  Entrada = 0,
  Salida = 1,
  TrasladoInterno = 2,
  TrasladoExterno = 3,
}

export interface MovimientoAnimal {
  id: string;
  animalId: string;
  fincaOrigenId: string;
  fincaDestinoId: string;
  tipoMovimiento: TipoMovimiento;
  fechaMovimiento: string;
  numeroGuia: string | null;
  motivo: string | null;
  operadorDestino: string | null;
  numDocumentoAcompanamiento: string | null;
  csv: string | null;
  animal?: { id: string; numeroCrotal: string };
  fincaOrigen?: { id: string; nombre: string };
  fincaDestino?: { id: string; nombre: string };
  createdOffline: boolean;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
